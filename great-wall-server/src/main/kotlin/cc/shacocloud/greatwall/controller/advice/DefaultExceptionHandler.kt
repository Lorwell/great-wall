package cc.shacocloud.greatwall.controller.advice

import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.controller.specification.ResponseBusinessMessage
import kotlinx.coroutines.reactor.mono
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestControllerAdvice
import reactor.core.publisher.Mono
import java.net.URLDecoder

/**
 * @author 思追(shaco)
 */
@Slf4j
@ControllerAdvice
@Order(Ordered.LOWEST_PRECEDENCE)
class DefaultExceptionHandler {

    /**
     * 业务异常处理器
     */
    @ResponseBody
    @ExceptionHandler(Exception::class)
    suspend fun handleException(
        e: Exception,
        request: ServerHttpRequest,
        response: ServerHttpResponse
    ): Any {
        if (log.isErrorEnabled) {
            val message = URLDecoder.decode(
                "${request.path.pathWithinApplication().value()}${request.queryParams.let { "?$it" }}", Charsets.UTF_8
            )
            log.error("请求 {} 发生未知的异常！", message, e)
        }

        response.headers.contentType = MediaType.APPLICATION_JSON
        response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        return ResponseBusinessMessage.INTERNAL_SERVER_ERROR
    }

}