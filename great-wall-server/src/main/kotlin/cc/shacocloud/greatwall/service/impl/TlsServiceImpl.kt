package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.dto.input.TlsInput
import cc.shacocloud.greatwall.model.event.DeleteTlsEvent
import cc.shacocloud.greatwall.model.event.RefreshTlsEvent
import cc.shacocloud.greatwall.model.mo.TlsBundleMo
import cc.shacocloud.greatwall.model.mo.TlsFile
import cc.shacocloud.greatwall.model.po.TlsPo
import cc.shacocloud.greatwall.repository.TlsRepository
import cc.shacocloud.greatwall.service.TlsService
import cc.shacocloud.greatwall.utils.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.withContext
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.ssl.PemSslBundleProperties
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.time.LocalDateTime
import java.util.*
import java.util.zip.ZipOutputStream
import kotlin.io.path.absolutePathString
import kotlin.io.path.invariantSeparatorsPathString


/**
 * 基于 [来此加密](https://letsencrypt.osfipin.com/) 的tls证书服务器实现
 * @author 思追(shaco)
 */
@Service
@Transactional(rollbackFor = [Exception::class])
class TlsServiceImpl(
    val tlsRepository: TlsRepository,
    val tlsProvider: CompositionTlsProvider,
) : TlsService {

    companion object {
        // 证书文件存储的父文件夹
        private val filesParent = "${System.getProperty("user.dir")}/data/tls/"

        private val certificatePath = Paths.get(filesParent, "certificate.crt").createOfNotExist()

        private val privateKeyPath = Paths.get(filesParent, "private.pem").createOfNotExist()

        private val log: Logger = LoggerFactory.getLogger(TlsServiceImpl::class.java)
    }

    /**
     * 重新加载证书
     */
    override suspend fun load(): TlsBundleMo? {
        // 没有证书配置，返回null
        findTlsPo() ?: return null

        return loadLocal()
    }

    /**
     * 查询证书信息
     */
    override suspend fun findTlsPo(): TlsPo? {
        return tlsRepository.findByKey(TlsPo.TLS_KEY).awaitSingleOrNull()
    }

    /**
     * 更新证书
     */
    override suspend fun update(input: TlsInput): TlsPo {
        val tlsConfig = input.config

        return tlsFileHandler {
            tlsProvider.getLatestTls(tlsConfig, it)

            val tlsExpiredTime = getTlsExpiredTime(it.certificatePath)?.toDate()

            // 更新入库
            var tlsPo = findTlsPo()
            if (tlsPo == null) {
                tlsPo = TlsPo(
                    type = tlsConfig.type,
                    config = tlsConfig,
                    expiredTime = tlsExpiredTime,
                    createTime = Date(),
                    lastUpdateTime = Date()
                )
            } else {
                tlsPo.apply {
                    type = tlsConfig.type
                    config = tlsConfig
                    expiredTime = tlsExpiredTime
                    lastUpdateTime = Date()
                }
            }
            tlsRepository.save(tlsPo).awaitSingle()
        }
    }

    /**
     * 刷新证书
     */
    override suspend fun refresh() {
        val tlsPo = findTlsPo() ?: return

        tlsFileHandler {
            tlsProvider.getLatestTls(tlsPo.config, it)
        }
    }

    /**
     * 获取证书过期时间
     */
    override suspend fun getTlsExpiredTime(): LocalDateTime? {
        // 没有证书配置
        val tlsPo = findTlsPo() ?: return null

        val tlsExpiredTime = getTlsExpiredTime(certificatePath)

        //  更新过期时间
        if (tlsExpiredTime != null && tlsPo.expiredTime == null) {
            tlsPo.expiredTime = tlsExpiredTime.toDate()
            tlsRepository.save(tlsPo).awaitSingle()
        }

        return tlsExpiredTime
    }

    /**
     * 生成 zip 文件
     */
    override suspend fun genZipFile(path: Path) {
        withContext(Dispatchers.IO) {
            ZipOutputStream(Files.newOutputStream(path)).use { zos ->
                certificatePath.putZipEntry(zos)
                privateKeyPath.putZipEntry(zos)
            }
        }
    }

    /**
     * 移除证书
     */
    override suspend fun delete() {
        val tlsPo = findTlsPo()

        if (tlsPo != null) {
            tlsRepository.delete(tlsPo).awaitSingleOrNull()
            ApplicationContextHolder.getInstance().publishEvent(DeleteTlsEvent())
        }
    }

    /**
     * 加载本地证书
     */
    suspend fun loadLocal(): TlsBundleMo {

        // 封装为证书的配置
        val sslProperties = PemSslBundleProperties().apply {
            keystore.apply {
                certificate = certificatePath.absolutePathString()
                privateKey = privateKeyPath.absolutePathString()
            }
        }

        // 获取当前证书的过期时间
        val expirationTime = getTlsExpiredTime(certificatePath)

        return TlsBundleMo(
            properties = sslProperties,
            expirationTime = expirationTime
        )
    }

    /**
     * 获取证书过期时间
     */
    suspend fun getTlsExpiredTime(certificatePath: Path): LocalDateTime? {
        try {
            val process = arrayOf(
                "openssl", "x509", "-in", certificatePath.invariantSeparatorsPathString, "-noout", "-enddate"
            ).exec()

            return withContext(Dispatchers.IO) {

                val code = process.waitFor()
                if (code == 0) {
                    process.inputStream.use { input ->
                        val result = input.readAllBytes().toString(Charsets.UTF_8)
                        val timeStr = result.trim().removePrefix("notAfter=").trim()
                        LocalDateTime.parse(timeStr, OPENSSL_DATE_FORMAT)
                    }
                } else {
                    throw IllegalArgumentException(process.errorStream.bufferedReader().readText())
                }

            }
        } catch (e: Throwable) {
            if (log.isWarnEnabled) {
                log.warn("读取证书过期时间失败", e)
            }
            return null
        }
    }

    suspend fun <T> tlsFileHandler(handler: suspend (tlsFile: TlsFile) -> T): T {
        // 使用临时文件存储
        val tempDir =
            Paths.get(filesParent, "temp", UUID.randomUUID().toString().lowercase())

        try {
            val tempDirStr = tempDir.invariantSeparatorsPathString
            val tempCertificatePath = Paths.get(tempDirStr, "certificate.crt").createOfNotExist()
            val tempPrivateKeyPath = Paths.get(tempDirStr, "private.pem").createOfNotExist()

            val tlsFile = TlsFile(tempCertificatePath, tempPrivateKeyPath)

            val tlsPo = handler(tlsFile)

            // 复制临时证书文件到目标地址
            copyFile(tempCertificatePath, certificatePath)
            copyFile(tempPrivateKeyPath, privateKeyPath)

            val load = loadLocal()

            // 发布更新事件
            ApplicationContextHolder.getInstance().publishEvent(RefreshTlsEvent(load))

            return tlsPo
        } finally {
            withContext(Dispatchers.IO) {
                tempDir.deleteAll()
            }
        }
    }

    /**
     * 复制文件
     */
    suspend fun copyFile(source: Path, target: Path) {
        withContext(Dispatchers.IO) {
            Files.copy(
                source,
                target,
                StandardCopyOption.REPLACE_EXISTING,
                StandardCopyOption.COPY_ATTRIBUTES,
            )
        }
    }

}