package cc.shacocloud.greatwall.controller.advice

import cc.shacocloud.greatwall.utils.Slf4j
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.util.ResourceUtils
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.reactive.resource.NoResourceFoundException
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

/**
 * 资源异常处理器
 * @author 思追(shaco)
 */
@Slf4j
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
class ResourceExceptionHandler {

    /**
     * 资源文件不存在则返回默认页面
     */
    @ExceptionHandler(NoResourceFoundException::class)
    fun handleException(
        e: NoResourceFoundException,
        response: ServerHttpResponse
    ): Mono<Void> {
        // 设置媒体类型
        response.headers.contentType = MediaType.TEXT_HTML

        // 写出数据流
        val url = ResourceUtils.getURL("classpath:static/index.html")
        val dataBuffer: DataBuffer = response.bufferFactory().wrap(url.readBytes())
        return response.writeWith(Flux.just(dataBuffer))
    }

}