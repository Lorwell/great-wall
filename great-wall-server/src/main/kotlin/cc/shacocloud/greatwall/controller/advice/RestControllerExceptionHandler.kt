package cc.shacocloud.greatwall.controller.advice

import cc.shacocloud.greatwall.controller.exception.BusinessException
import cc.shacocloud.greatwall.controller.specification.ResponseBusinessMessage
import cc.shacocloud.greatwall.controller.specification.StrRespMsg
import cc.shacocloud.greatwall.utils.ValidationExceptionUtil.constraintViolation
import cc.shacocloud.greatwall.utils.ValidationExceptionUtil.getFieldsRespMsg
import cc.shacocloud.greatwall.utils.ValidationExceptionUtil.objectErrorViolation
import jakarta.validation.ConstraintViolationException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.InvalidMediaTypeException
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.util.InvalidMimeTypeException
import org.springframework.validation.BindException
import org.springframework.web.ErrorResponseException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.multipart.MaxUploadSizeExceededException

/**
 * 默认异常处理器
 * @author 思追(shaco)
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
class RestControllerExceptionHandler {

    companion object {
        private val log: Logger = LoggerFactory.getLogger(RestControllerExceptionHandler::class.java)
    }

    /**
     * 消息不可读
     */
    @ExceptionHandler(HttpMessageNotReadableException::class)
    suspend fun handleHttpMessageNotReadableException(
        e: HttpMessageNotReadableException,
        request: ServerHttpRequest,
        response: ServerHttpResponse
    ): Any {
        if (log.isDebugEnabled) {
            log.debug("请求 {} 无法处理！", request.path.pathWithinApplication().value(), e)
        }

        response.statusCode = HttpStatus.BAD_REQUEST
        return ResponseBusinessMessage.BAD_REQUEST
    }

    /**
     * 错误响应消息
     */
    @ExceptionHandler(ErrorResponseException::class)
    suspend fun handleErrorResponseException(
        e: ErrorResponseException,
        request: ServerHttpRequest,
        response: ServerHttpResponse
    ): Any {
        if (log.isDebugEnabled) {
            log.debug("请求 {} 处理出现错误的响应！", request.path.pathWithinApplication().value(), e)
        }

        val statusCode = e.statusCode
        response.statusCode = statusCode
        return when (statusCode) {
            HttpStatus.BAD_REQUEST -> ResponseBusinessMessage.BAD_REQUEST
            HttpStatus.UNAUTHORIZED -> ResponseBusinessMessage.UNAUTHORIZED
            HttpStatus.FORBIDDEN -> ResponseBusinessMessage.FORBIDDEN
            HttpStatus.NOT_FOUND -> ResponseBusinessMessage.NOT_FOUND
            HttpStatus.METHOD_NOT_ALLOWED -> ResponseBusinessMessage.METHOD_NOT_ALLOWED
            HttpStatus.NOT_ACCEPTABLE -> ResponseBusinessMessage.NOT_ACCEPTABLE
            HttpStatus.CONFLICT -> ResponseBusinessMessage.CONFLICT
            HttpStatus.GONE -> ResponseBusinessMessage.GONE
            HttpStatus.PAYLOAD_TOO_LARGE -> ResponseBusinessMessage.REQUEST_ENTITY_TOO_LARGE
            HttpStatus.URI_TOO_LONG -> ResponseBusinessMessage.REQUEST_URI_TOO_LONG
            HttpStatus.UNSUPPORTED_MEDIA_TYPE -> ResponseBusinessMessage.UNSUPPORTED_MEDIA_TYPE
            HttpStatus.UNPROCESSABLE_ENTITY -> ResponseBusinessMessage.UNPROCESSABLE_ENTITY
            HttpStatus.INTERNAL_SERVER_ERROR -> ResponseBusinessMessage.INTERNAL_SERVER_ERROR
            HttpStatus.SERVICE_UNAVAILABLE -> ResponseBusinessMessage.SERVICE_UNAVAILABLE
            else -> {
                val codeMsg = "http.status.${statusCode.value()}"
                if (statusCode is HttpStatus) {
                    StrRespMsg(codeMsg, statusCode.reasonPhrase)
                } else {
                    StrRespMsg(codeMsg, codeMsg)
                }
            }
        }
    }


    /**
     * 媒体类型相关的异常
     */
    @ExceptionHandler(InvalidMediaTypeException::class, InvalidMimeTypeException::class)
    suspend fun handleHttpMediaTypeException(
        e: Exception,
        request: ServerHttpRequest,
        response: ServerHttpResponse
    ): Any {
        if (log.isWarnEnabled) {
            log.warn("请求 {} 无法处理！", request.path.pathWithinApplication().value(), e)
        }

        val (status, respMsg) = when (e) {
            // 无效的媒体类型
            is InvalidMediaTypeException,
            is InvalidMimeTypeException -> HttpStatus.UNSUPPORTED_MEDIA_TYPE to ResponseBusinessMessage.UNSUPPORTED_MEDIA_TYPE

            else -> HttpStatus.BAD_REQUEST to ResponseBusinessMessage.BAD_REQUEST
        }

        response.statusCode = status
        return respMsg
    }

    /**
     * 业务异常处理器
     */
    @ExceptionHandler(BusinessException::class)
    suspend fun handleBusinessException(
        e: BusinessException,
        request: ServerHttpRequest,
        response: ServerHttpResponse
    ): Any {
        if (e.status.value() == 500 && log.isErrorEnabled) {
            log.error("请求 {} 发生未知的异常！", request.path.pathWithinApplication().value(), e)
        }

        response.statusCode = e.status
        return e.businessMessage
    }

    /**
     * restful 参数验证失败异常处理器
     */
    @ExceptionHandler(BindException::class, ConstraintViolationException::class)
    suspend fun handleBindingException(e: Exception, response: ServerHttpResponse): Any {
        response.statusCode = HttpStatus.UNPROCESSABLE_ENTITY

        return when (e) {
            is BindException -> objectErrorViolation(e.bindingResult.allErrors)
            is ConstraintViolationException -> constraintViolation(e.constraintViolations)
            else -> {
                if (log.isWarnEnabled) {
                    log.warn("参数验证失败异常未处理：{}", e.message, e)
                }

                getFieldsRespMsg(mapOf())
            }
        }
    }

    /**
     * 文件超过最大上传限制
     */
    @ExceptionHandler(MaxUploadSizeExceededException::class)
    suspend fun handleMaxUploadSizeExceededException(
        request: ServerHttpRequest,
        response: ServerHttpResponse
    ): Any {
        if (log.isDebugEnabled) {
            log.debug("文件上传请求 {} 超过最大上传大小限制！", request.path.pathWithinApplication().value())
        }
        response.statusCode = HttpStatus.BAD_REQUEST
        return ResponseBusinessMessage.BAD_REQUEST
    }

}