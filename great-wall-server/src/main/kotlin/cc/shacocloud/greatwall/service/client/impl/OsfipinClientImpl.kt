package cc.shacocloud.greatwall.service.client.impl

import cc.shacocloud.greatwall.config.InputStreamHttpMessageConverter
import cc.shacocloud.greatwall.config.OsfipinProperties
import cc.shacocloud.greatwall.service.client.LogLevel
import cc.shacocloud.greatwall.service.client.OsfipinClient
import cc.shacocloud.greatwall.service.client.RestTemplateLogRequestInterceptor
import cc.shacocloud.greatwall.service.client.dto.output.CertificateDetailOutput
import cc.shacocloud.greatwall.utils.Json
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import org.slf4j.event.Level
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.RequestEntity
import org.springframework.http.ResponseEntity
import org.springframework.http.client.BufferingClientHttpRequestFactory
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.SimpleClientHttpRequestFactory
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.web.client.RestTemplate
import java.io.File
import java.io.InputStream
import java.net.URI
import java.time.Duration
import java.util.zip.ZipFile
import kotlin.io.path.createTempFile


/**
 * [文档](https://www.yuque.com/osfipin/letsencrypt/tzwt07)
 * @author 思追(shaco)
 */
class OsfipinClientImpl(
    private val osfipinProperties: OsfipinProperties,
) : OsfipinClient {

    companion object {
        private val restTemplate = RestTemplate()

        init {
            val clientHttpRequestFactory = SimpleClientHttpRequestFactory()
            // 连接超时
            clientHttpRequestFactory.setConnectTimeout(Duration.ofSeconds(3))
            // 读取超市
            clientHttpRequestFactory.setReadTimeout(Duration.ofSeconds(30))

            // 提供对传出/传入流的缓冲,可以让响应body多次读取(如果不配置,拦截器读取了Response流,再响应数据时会返回body=null)
            restTemplate.setRequestFactory(BufferingClientHttpRequestFactory(clientHttpRequestFactory));
            // 拦截器
            restTemplate.interceptors = arrayListOf<ClientHttpRequestInterceptor>(
                RestTemplateLogRequestInterceptor(
                    logLevel = LogLevel.BODY,
                    printLevel = Level.INFO
                )
            )

            val messageConverters = restTemplate.messageConverters.toMutableList()

            // 使用自定义的json转换器
            messageConverters.removeIf { it is AbstractJackson2HttpMessageConverter }
            messageConverters.add(MappingJackson2HttpMessageConverter(Json.mapper))

            // 新增支持 InputStream 的消息转换器
            messageConverters.add(InputStreamHttpMessageConverter())

            restTemplate.messageConverters = messageConverters
        }
    }

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
     * 证书详情
     */
    override fun certificateDetail(): CertificateDetailOutput {
        val id = osfipinProperties.id

        val requestEntity = RequestEntity<Void>(
            getHttpHeaders(),
            HttpMethod.GET,
            URI("${osfipinProperties.baseUrl.removeSuffix("/")}/order/detail?id=$id")
        )

        val responseEntity = restTemplate.exchange(requestEntity, CertificateDetailOutput::class.java)
        assertResponseSuccess(requestEntity, responseEntity)

        val body = responseEntity.body
            ?: throw IllegalStateException("证书文件主体为空！")

        return body
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