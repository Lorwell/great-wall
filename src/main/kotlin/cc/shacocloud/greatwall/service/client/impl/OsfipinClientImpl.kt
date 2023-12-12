package cc.shacocloud.greatwall.service.client.impl

import cc.shacocloud.greatwall.config.OsfipinProperties
import cc.shacocloud.greatwall.service.client.OsfipinClient
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import org.springframework.context.annotation.Import
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.RequestEntity
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.io.File
import java.io.InputStream
import java.net.URI
import java.util.zip.ZipFile
import kotlin.io.path.createTempFile

/**
 * [文档](https://www.yuque.com/osfipin/letsencrypt/tzwt07)
 * @author 思追(shaco)
 */
@Service
@Import(OsfipinProperties::class)
class OsfipinClientImpl(
    val osfipinProperties: OsfipinProperties,
) : OsfipinClient {

    val restTemplate = RestTemplate()

    /**
     * 下载证书《为一个zip文件
     *
     * [文档](https://www.yuque.com/osfipin/letsencrypt/xv6h1y)
     */
    override fun download(): ZipFile {
        val autoId = osfipinProperties.autoId

        val requestEntity = RequestEntity<Void>(
            getHttpHeaders(),
            HttpMethod.GET,
            URI("${osfipinProperties.baseUrl.removeSuffix("/")}/order/down?id=${autoId}&type=auto")
        )

        val responseEntity = restTemplate.exchange(requestEntity, InputStream::class.java)
        assertResponseSuccess(requestEntity, responseEntity)

        val body = responseEntity.body
            ?: throw IllegalStateException("证书文件主体为空！")

        // 写入临时文件
        val tempFile = createTempFile(prefix = autoId).toFile()
        body.use { inputStream ->
            tempFile.outputStream().use { outputStream ->
                inputStream.copyTo(outputStream)
            }
        }

        return OsfipinCertificateZipFile(tempFile)
    }

    /**
     * 断言响应为成功状态
     */
    fun <T> assertResponseSuccess(requestEntity: RequestEntity<*>, responseEntity: ResponseEntity<T>) {
        val statusCode = responseEntity.statusCode
        when {
            statusCode.is3xxRedirection -> {
                throw IllegalStateException("请求 ${requestEntity.url} 收到300区间的状态码 ${statusCode.value()}，当前处理器不支持重定向请求！")
            }

            statusCode.is4xxClientError -> {
                throw IllegalStateException("请求 ${requestEntity.url} 收到400区间的状态码 ${statusCode.value()}，请检查当前请求的参数！")
            }

            statusCode.is5xxServerError -> {
                throw IllegalStateException("请求 ${requestEntity.url} 收到500区间的状态码 ${statusCode.value()}，服务器发生错误！")
            }
        }
    }

    /**
     * 获取认证的请求头
     */
    fun getHttpHeaders(): HttpHeaders {
        val httpHeaders = HttpHeaders()
        httpHeaders[HttpHeaders.AUTHORIZATION] = getAuthorizationHeader()
        return httpHeaders
    }

    /**
     * 获取认证的值
     */
    fun getAuthorizationHeader(): String {
        return "Bearer ${osfipinProperties.token}:${osfipinProperties.user}"
    }

    /**
     * 证书文件，关闭时自动删除
     */
    @Slf4j
    class OsfipinCertificateZipFile(private val file: File) : ZipFile(file) {

        override fun close() {
            try {
                super.close()
            } finally {
                try {
                    file.delete()
                } catch (e: Exception) {
                    if (log.isWarnEnabled) {
                        log.warn("关闭证书文件时，删除证书文件发生例外！", e)
                    }
                    file.deleteOnExit()
                }
            }
        }
    }

}