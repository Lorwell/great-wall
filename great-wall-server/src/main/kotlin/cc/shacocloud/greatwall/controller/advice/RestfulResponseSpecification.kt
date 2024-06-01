package cc.shacocloud.greatwall.controller.advice

import cc.shacocloud.greatwall.controller.specification.*
import cc.shacocloud.greatwall.utils.MessageSourceHolder
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.mono
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.core.ReactiveAdapterRegistry
import org.springframework.core.annotation.AnnotatedElementUtils
import org.springframework.data.domain.Page
import org.springframework.http.HttpMethod.*
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ProblemDetail
import org.springframework.http.codec.ServerCodecConfigurer
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.reactive.HandlerResult
import org.springframework.web.reactive.accept.RequestedContentTypeResolver
import org.springframework.web.reactive.result.method.annotation.ResponseBodyResultHandler
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.net.URI

/**
 * restful 响应规范
 *
 * @author 思追(shaco)
 */
@RestControllerAdvice
class RestfulResponseSpecification(
    @Qualifier("webFluxAdapterRegistry") reactiveAdapterRegistry: ReactiveAdapterRegistry,
    serverCodecConfigurer: ServerCodecConfigurer,
    @Qualifier("webFluxContentTypeResolver") contentTypeResolver: RequestedContentTypeResolver
) : ResponseBodyResultHandler(serverCodecConfigurer.writers, contentTypeResolver, reactiveAdapterRegistry) {

    override fun supports(result: HandlerResult): Boolean {
        if (super.supports(result)) {
            // 判断是否使用注解排除 OriginalControllerReturnValue
            val returnType = result.returnTypeSource
            val containingClass = returnType.containingClass
            return !(AnnotatedElementUtils.hasAnnotation(containingClass, OriginalControllerReturnValue::class.java) ||
                    returnType.hasMethodAnnotation(OriginalControllerReturnValue::class.java))
        }
        return false
    }

    /**
     * 处理结果
     */
    override fun handleResult(exchange: ServerWebExchange, result: HandlerResult): Mono<Void> = mono {
        val returnValue = result.returnValue
        val bodyTypeParameter = result.returnTypeSource

        var result = if (returnValue is Mono<*>) {
            returnValue.awaitSingle()
        } else if (returnValue is Flux<*>) {
            returnValue.collectList().awaitFirst()
        } else {
            returnValue
        }

        restfulStatusSpecification(exchange, result)

        result = when (result) {
            null -> null

            // RFC 7807 问题详细信息的表示形式
            is ProblemDetail -> {
                exchange.response.setStatusCode(HttpStatusCode.valueOf(result.status))
                if (result.instance == null) {
                    val path = URI.create(exchange.request.path.value())
                    result.instance = path
                }
                result
            }

            // 字符串结果
            is String -> {
                val message = MessageSourceHolder.getMessage(
                    result, null, result, LocaleContextHolder.getLocale()
                )
                StrRespMsg(message = message ?: ResponseBusinessMessage.SUCCESS_MESSAGE)
            }

            //  封装 spring data 分页结果
            is Page<*> -> {
                val respPage = RespPage(
                    current = result.number,
                    size = result.size,
                    total = result.totalElements
                )
                PageRespMsg(result.content, respPage)
            }

            // 业务消息
            is ResponseBusinessMessage -> result

            // 可迭代对象
            is Iterable<*> -> RespMsg<Any>(records = result)

            else -> result
        }

          writeBody(result, bodyTypeParameter, exchange).awaitSingle()
    }

    /**
     * restful状态规范
     *
     * 对于成功的请求，返回相应的 20x 状态码。
     * 成功的 GET 请求，返回 200 OK。
     * 成功的 POST 请求，返回 201 Created，并返回创建的资源。
     * 成功的 PATCH/PUT 请求，返回 200 OK，并返回更新后的资源。
     * 成功的 DELETE 请求，返回 204 No Content，响应 body 应没有内容。
     * 对于成功的 POST/PATCH/PUT 请求，无法直接返回新的资源时（如使用异步操作），返回 202 Accepted，响应 body 没有内容。
     */
    private fun restfulStatusSpecification(
        exchange: ServerWebExchange,
        returnValue: Any?
    ) {
        val request = exchange.request
        val response = exchange.response
        if (response.statusCode?.is2xxSuccessful == true) return

        when (request.method) {
            GET -> response.statusCode = HttpStatus.OK
            POST -> response.statusCode = if (returnValue == null) HttpStatus.ACCEPTED else HttpStatus.CREATED
            PATCH, PUT -> response.statusCode = if (returnValue == null) HttpStatus.ACCEPTED else HttpStatus.OK
            DELETE -> response.statusCode = HttpStatus.NO_CONTENT
        }
    }


}