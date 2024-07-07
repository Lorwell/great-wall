package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.TlsLoadMo
import cc.shacocloud.greatwall.model.dto.input.TlsInput
import cc.shacocloud.greatwall.model.event.RefreshTlsEvent
import cc.shacocloud.greatwall.model.mo.TlsFile
import cc.shacocloud.greatwall.model.po.TlsPo
import cc.shacocloud.greatwall.repository.TlsRepository
import cc.shacocloud.greatwall.service.TlsService
import cc.shacocloud.greatwall.utils.*
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.withContext
import org.springframework.boot.autoconfigure.ssl.PemSslBundleProperties
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.IOException
import java.io.UncheckedIOException
import java.nio.file.*
import java.time.LocalDateTime
import java.util.*
import java.util.zip.ZipEntry
import java.util.zip.ZipFile
import java.util.zip.ZipOutputStream
import kotlin.io.path.absolutePathString
import kotlin.io.path.createTempFile
import kotlin.io.path.invariantSeparatorsPathString
import kotlin.io.path.name


/**
 * 基于 [来此加密](https://letsencrypt.osfipin.com/) 的tls证书服务器实现
 * @author 思追(shaco)
 */
@Slf4j
@Service
@Transactional(rollbackFor = [Exception::class])
class TlsServiceImpl(
    val tlsRepository: TlsRepository,
    val tlsProvider: CompositionTlsProvider
) : TlsService {

    companion object {
        // 证书文件存储的父文件夹
        private val filesParent = "${System.getProperty("user.dir")}/data/tls/"

        private val certificatePath = Paths.get(filesParent, "certificate.crt").createOfNotExist()

        private val privateKeyPath = Paths.get(filesParent, "private.pem").createOfNotExist()
    }

    /**
     * 重新加载证书
     */
    override suspend fun load(): TlsLoadMo? {

        // 没有证书配置
        if (findTlsPo() == null) {
            return null
        }

        // 封装为证书的配置
        val sslProperties = PemSslBundleProperties().apply {
            keystore.apply {
                certificate = certificatePath.absolutePathString()
                privateKey = privateKeyPath.absolutePathString()
            }
        }

        // 获取当前证书的过期时间
        val expirationTime = getTlsExpiredTime(certificatePath)

        return TlsLoadMo(
            properties = sslProperties,
            expirationTime = expirationTime
        )
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
        if (findTlsPo() == null) {
            return null
        }

        return getTlsExpiredTime(certificatePath)
    }

    /**
     * 生成 zip 文件
     */
    override suspend fun genZipFile(): ZipFile {
        val tempFile = createTempFile(prefix = "tls")
        withContext(Dispatchers.IO) {
            ZipOutputStream(Files.newOutputStream(tempFile)).use { zos ->
                certificatePath.putZipEntry(zos)
                privateKeyPath.putZipEntry(zos)
            }

        }
        return ZipFile(tempFile.toFile()){

        }
    }

    /**
     * 获取证书过期时间
     */
    suspend fun getTlsExpiredTime(certificatePath: Path): LocalDateTime? {
        val process = arrayOf(
            "openssl", "x509", "-in", certificatePath.invariantSeparatorsPathString, "-noout", "-enddate"
        ).exec()

        return withContext(Dispatchers.IO) {
            try {
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
            } catch (e: Throwable) {
                if (log.isErrorEnabled) {
                    log.error("读取证书过期时间失败", e)
                }
                null
            }
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

            val result = handler(tlsFile)

            // 复制临时证书文件到目标地址
            copyFile(tempCertificatePath, certificatePath)
            copyFile(tempPrivateKeyPath, privateKeyPath)

            // 发布更新事件
            ApplicationContextHolder.getInstance().publishEvent(RefreshTlsEvent())

            return result
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