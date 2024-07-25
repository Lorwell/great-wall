package cc.shacocloud.greatwall.config.web

import org.springframework.core.annotation.MergedAnnotations
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.core.io.buffer.DefaultDataBufferFactory
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
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
class MainServerErrorHandler : WebExceptionHandler {

    companion object {
        val dataBufferFactory = DefaultDataBufferFactory()
    }

    /**
     * 处理异常
     */
    override fun handle(exchange: ServerWebExchange, ex: Throwable): Mono<Void> {
        val request = exchange.request
        val response = exchange.response
        val status = determineHttpStatus(ex)

        // 设置响应状态码
        response.setStatusCode(status)

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
        status: HttpStatus,
    ): Mono<Void> {

        val code = status.value()
        val reasonPhrase = status.reasonPhrase

        val content = """
             <html lang="zh">
             <head>
                 <meta charset="utf-8">
                 <title>${code}</title>
             </head>
             <body style="font-family: Arial, sans-serif;background-color: #fff;text-align: center;">
             <h1 style="font-size: 2rem;margin-bottom: 1rem;line-height: 1.5;border-bottom: 1px solid #bdbdbd;">
                 $code $reasonPhrase
             </h1>
             <span style="font-size: 1.2rem;line-height: 1;margin-bottom: 1rem;">
                 great-wall
             </span>
             </body>
             </html>
             """.trimIndent()
        return writeStringToResponse(response, content)
    }

    /**
     * 渲染为 json
     */
    private fun renderJson(
        response: ServerHttpResponse,
        status: HttpStatus,
    ): Mono<Void> {
        val content = """{"code":${status.value()},"reason":"${status.reasonPhrase}"}"""
        return writeStringToResponse(response, content)
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
    ): Mono<Void> {
        val inputStreamSupplier = Callable<InputStream> {
            ByteArrayInputStream(content.toByteArray(Charsets.UTF_8))
        }

        val dataBufferFlux = DataBufferUtils.readInputStream(inputStreamSupplier, dataBufferFactory, 1024)
        return response.writeWith(dataBufferFlux)

    }

}