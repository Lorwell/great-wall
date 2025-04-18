package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.GreatWallVersion
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.annotation.MergedAnnotations
import org.springframework.core.env.Environment
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.core.io.buffer.DefaultDataBufferFactory
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.stereotype.Component
import org.springframework.util.MimeTypeUtils
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebExceptionHandler
import reactor.core.publisher.Mono
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.net.ConnectException
import java.util.concurrent.Callable

/**
 * 主服务的错误处理器
 *
 * @author 思追(shaco)
 */
@Component
class MainServerErrorHandler(
    environment: Environment,
) : WebExceptionHandler {

    companion object {
        val dataBufferFactory = DefaultDataBufferFactory()

        private val log: Logger = LoggerFactory.getLogger(MainServerErrorHandler::class.java)
    }

    private val appName = environment.getRequiredProperty("spring.application.name")

    /**
     * 处理异常
     */
    override fun handle(exchange: ServerWebExchange, ex: Throwable): Mono<Void> {
        if (log.isDebugEnabled) {
            log.debug("网关异常：{}", ex.message, ex)
        }

        val status = determineHttpStatus(ex)
        return handleErrorStatus(exchange, status)
    }

    /**
     * 处理状态异常
     */
    fun handleErrorStatus(exchange: ServerWebExchange, status: HttpStatusCode): Mono<Void> {
        val request = exchange.request
        val response = exchange.response

        // 设置响应状态码
        response.statusCode = status

        if (supportHtml(request)) {
            return renderHTML(response, status)
        }
        return renderJson(response, status)
    }

    /**
     * 渲染为 html
     */
    private fun renderHTML(
        response: ServerHttpResponse,
        status: HttpStatusCode,
    ): Mono<Void> {

        val code = status.value()
        val reasonPhrase = if (status is HttpStatus) " ${status.reasonPhrase}" else ""

        val content = """
             <html lang="zh">
             <head>
                 <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                 <title>${code}${reasonPhrase}</title>
             </head>
             <body>
             <div style="text-align:center"><h1>${code}${reasonPhrase}</h1></div>
             <hr>
             <div style="text-align:center; font-size: 16px;">
             $appName
             <span style="margin-left: 4px; font-size: 12px;">v${GreatWallVersion.version}</span>
             </div>
             </body>
             </html>
             """.trimIndent()
        return writeStringToResponse(response, content, MediaType.TEXT_HTML)
    }

    /**
     * 渲染为 json
     */
    private fun renderJson(
        response: ServerHttpResponse,
        status: HttpStatusCode,
    ): Mono<Void> {
        val code = status.value()
        val reasonPhrase = if (status is HttpStatus) " ${status.reasonPhrase}" else ""
        val content = """{"code":${code},"reason":"$reasonPhrase"}"""
        return writeStringToResponse(response, content, MediaType.APPLICATION_JSON)
    }

    /**
     * 是否支持 HTML 响应
     */
    private fun supportHtml(request: ServerHttpRequest): Boolean {
        val acceptedMediaTypes = request.headers.accept
        acceptedMediaTypes.removeIf { MediaType.ALL.equalsTypeAndSubtype(it) }
        MimeTypeUtils.sortBySpecificity(acceptedMediaTypes)
        return acceptedMediaTypes.stream().anyMatch { MediaType.TEXT_HTML.isCompatibleWith(it) }
    }

    /**
     * 获取当前响应的 http状态码
     */
    private fun determineHttpStatus(
        error: Throwable,
    ): HttpStatus {

        // 链接异常
        if (error is ConnectException) {
            return if (error.message?.contains("timed out") == true)
                HttpStatus.GATEWAY_TIMEOUT
            else
                HttpStatus.BAD_GATEWAY
        }
        // 指定状态码异常
        else if (error is ResponseStatusException) {
            val httpStatus = HttpStatus.resolve(error.statusCode.value())
            if (httpStatus != null) {
                return httpStatus
            }
        }

        return MergedAnnotations.from(error.javaClass, MergedAnnotations.SearchStrategy.TYPE_HIERARCHY)
            .get(ResponseStatus::class.java)
            .getValue("code", HttpStatus::class.java)
            .orElse(HttpStatus.INTERNAL_SERVER_ERROR)
    }

    /**
     * 将字符内容写入响应
     */
    private fun writeStringToResponse(
        response: ServerHttpResponse,
        content: String,
        contentType: MediaType,
    ): Mono<Void> {

        // 已经提交则忽略
        if (response.isCommitted) {
            return response.setComplete()
        }

        val headers = response.headers
        headers.contentLength = content.length.toLong()
        headers.contentType = contentType

        val inputStreamSupplier = Callable<InputStream> {
            ByteArrayInputStream(content.toByteArray(Charsets.UTF_8))
        }

        val dataBufferFlux = DataBufferUtils.readInputStream(inputStreamSupplier, dataBufferFactory, 1024)
        return response.writeWith(dataBufferFlux).then(Mono.defer { response.setComplete() })

    }

}