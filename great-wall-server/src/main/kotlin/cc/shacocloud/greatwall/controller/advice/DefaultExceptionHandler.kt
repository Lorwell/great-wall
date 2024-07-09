package cc.shacocloud.greatwall.controller.advice

import cc.shacocloud.greatwall.controller.specification.ResponseBusinessMessage
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import java.net.URLDecoder

/**
 * @author 思追(shaco)
 */
@ControllerAdvice
@Order(Ordered.LOWEST_PRECEDENCE)
class DefaultExceptionHandler {

    companion object {
        private val log: Logger = LoggerFactory.getLogger(DefaultExceptionHandler::class.java)
    }

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