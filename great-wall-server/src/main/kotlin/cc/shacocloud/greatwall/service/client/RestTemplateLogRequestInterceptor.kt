package cc.shacocloud.greatwall.service.client

import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import org.slf4j.event.Level
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpRequest
import org.springframework.http.MediaType
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse
import org.springframework.web.client.RestTemplate
import java.io.IOException
import java.nio.charset.UnsupportedCharsetException
import java.util.concurrent.TimeUnit

/**
 * [RestTemplate] 的请求日志拦截器
 * @author 思追(shaco)
 */
@Slf4j
class RestTemplateLogRequestInterceptor(

    /**
     * 请求日志记录级别
     */
    private val logLevel: LogLevel,

    /**
     * 日志打印级别
     */
    private val printLevel: Level

) : ClientHttpRequestInterceptor {

    @Throws(IOException::class)
    override fun intercept(
        request: HttpRequest,
        body: ByteArray,
        execution: ClientHttpRequestExecution
    ): ClientHttpResponse {

        if (logLevel == LogLevel.NONE) {
            return execution.execute(request, body)
        }

        val startNs = System.nanoTime()

        val logBody = logLevel == LogLevel.BODY
        val logHeaders = logBody || logLevel == LogLevel.HEADERS

        val hasRequestBody = body.isNotEmpty()

        var requestStartMessage = "--> " + request.method + ' ' + request.uri + ' '
        if (!logHeaders && hasRequestBody) {
            requestStartMessage += " (" + body.size + "-byte body)"
        }

        println(requestStartMessage)

        if (logHeaders) {
            val headers = request.headers
            val contentType = headers.contentType
            val contentLength = if (headers.contentLength != -1L) headers.contentLength else body.size

            if (hasRequestBody) {
                println("Content-Type: $contentType")
                if (body.isNotEmpty()) {
                    println("Content-Length: $contentLength")
                }
            }

            headers.forEach { println("${it.key}: ${it.value.joinToString(separator = "; ")}") }

            if (!logBody || !hasRequestBody) {
                println("--> END ${request.method}")
            } else if (bodyEncoded(headers)) {
                println("--> END ${request.method} (省略编码正文)")
            } else {
                var charset = Charsets.UTF_8
                if (contentType != null) {
                    charset = contentType.charset ?: Charsets.UTF_8
                }

                println("")

                if (MediaType.APPLICATION_JSON.equalsTypeAndSubtype(contentType)) {
                    println(body.toString(charset))
                    println("--> END ${request.method} ($contentLength-byte body)")
                } else {
                    println("--> END ${request.method} (binary $contentLength-byte body omitted)")
                }
            }
        }

        // 发起请求
        val response = execution.execute(request, body)

        val tookMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startNs)

        val responseBody = response.body
        val headers = response.headers

        val contentLength = if (headers.contentLength != -1L) "${headers.contentLength}-byte" else "${responseBody.available()}-byte"
        println("<-- ${response.statusCode} ${response.statusText} ${request.uri} ( ${tookMs}ms${if (logHeaders) ", $contentLength body" else ""})")

        if (logHeaders) {
            headers.forEach { println("${it.key}: ${it.value.joinToString(separator = "; ")}") }

            if (!logBody) {
                println("<-- END HTTP")
            } else if (bodyEncoded(headers)) {
                println("<-- END HTTP (省略编码正文)")
            } else {
                var charset = Charsets.UTF_8
                val contentType = headers.contentType
                if (contentType != null) {
                    try {
                        charset = contentType.charset ?: Charsets.UTF_8
                    } catch (e: UnsupportedCharsetException) {
                        println("")
                        println("无法解码响应正文; 字符集可能格式不正确。")
                        println("<-- END HTTP")
                        return response
                    }
                }

                // 只大约 json 格式格式主体
                if (!MediaType.APPLICATION_JSON.equalsTypeAndSubtype(contentType)) {
                    println("")
                    println("<-- END HTTP (二进制正文 $contentLength 省略)")
                    return response
                }

                println("")
                println(responseBody.bufferedReader(charset).readText())

                println("<-- END HTTP ($contentLength body)")
            }
        }

        return response
    }

    /**
     * 主体是否可以解码
     */
    private fun bodyEncoded(headers: HttpHeaders): Boolean {
        val contentEncoding = headers.getFirst("Content-Encoding")
        return contentEncoding != null && !contentEncoding.equals("identity", ignoreCase = true)
    }

    /**
     * 打印日志
     */
    private fun println(format: String, vararg arguments: Array<Any>) {
        when (printLevel) {
            Level.ERROR -> log.error(format, arguments)
            Level.WARN -> log.warn(format, arguments)
            Level.INFO -> log.info(format, arguments)
            Level.DEBUG -> log.debug(format, arguments)
            Level.TRACE -> log.trace(format, arguments)
        }

    }

}

enum class LogLevel {

    /**
     * 没有日志
     * */
    NONE,

    /**
     * 记录请求和响应行。
     */
    BASIC,

    /**
     * 记录请求和响应行及其各自的标头
     */
    HEADERS,

    /**
     * 记录请求和响应行及其各自的标头和正文（如果存在）。
     */
    BODY
}

