package cc.shacocloud.greatwall.controller.exception

import cc.shacocloud.greatwall.utils.MessageSourceHolder
import cc.shacocloud.greatwall.controller.specification.ResponseBusinessMessage
import cc.shacocloud.greatwall.controller.specification.StrRespMsg
import org.springframework.http.HttpStatus

/**
 * 指定状态码异常
 *
 * @author 思追(shaco)
 */
open class HttpStatusException(
    val status: HttpStatus,
    message: String? = null,
    cause: Throwable? = null,
) : RuntimeException(message, cause)

/**
 * 业务异常
 *
 * @author 思追(shaco)
 */
open class BusinessException(

    /**
     * 响应状态
     */
    status: HttpStatus,

    /**
     * 业务消息
     */
    val businessMessage: ResponseBusinessMessage,

    /**
     * 异常堆栈
     */
    cause: Throwable? = null

) : HttpStatusException(status = status, cause = cause) {

    override val message: String
        get() = businessMessage.getMessage()

}

/**
 * 未登录异常
 *
 * @author 思追(shaco)
 */
class UnauthorizedException(
    status: HttpStatus = HttpStatus.UNAUTHORIZED,
    businessMessage: ResponseBusinessMessage = ResponseBusinessMessage.UNAUTHORIZED
) : BusinessException(
    status = status,
    businessMessage = businessMessage
) {

    constructor(
        message: String
    ) : this(
        businessMessage = StrRespMsg(
            code = message,
            message = MessageSourceHolder.getMessage(message)
        )
    )

}

/**
 * 无权限异常
 *
 * @author 思追(shaco)
 */
class ForbiddenException(
    status: HttpStatus = HttpStatus.FORBIDDEN,
    businessMessage: ResponseBusinessMessage = ResponseBusinessMessage.FORBIDDEN
) : BusinessException(
    status = status,
    businessMessage = businessMessage
) {

    constructor(
        message: String
    ) : this(
        businessMessage = StrRespMsg(
            code = message,
            message = MessageSourceHolder.getMessage(message)
        )
    )

}


/**
 * 资源不存在异常
 *
 * @author 思追(shaco)
 */
class NotFoundException(
    status: HttpStatus = HttpStatus.NOT_FOUND,
    businessMessage: ResponseBusinessMessage = ResponseBusinessMessage.NOT_FOUND
) : BusinessException(
    status = status,
    businessMessage = businessMessage
) {

    constructor(
        message: String
    ) : this(
        businessMessage = StrRespMsg(
            code = message,
            message = MessageSourceHolder.getMessage(message)
        )
    )

}

/**
 * 内部服务错误
 *
 * @author 思追(shaco)
 */
class InternalServerErrorException(
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    businessMessage: ResponseBusinessMessage = ResponseBusinessMessage.INTERNAL_SERVER_ERROR
) : BusinessException(
    status = status,
    businessMessage = businessMessage
) {

    constructor(
        message: String
    ) : this(
        businessMessage = StrRespMsg(
            code = message,
            message = MessageSourceHolder.getMessage(message)
        )
    )

}

/**
 * 请求资源不满足执行条件异常
 *
 * @author 思追(shaco)
 */
class NotAcceptableException(
    status: HttpStatus = HttpStatus.NOT_ACCEPTABLE,
    businessMessage: ResponseBusinessMessage = ResponseBusinessMessage.NOT_ACCEPTABLE
) : BusinessException(
    status = status,
    businessMessage = businessMessage
) {

    constructor(
        message: String
    ) : this(
        businessMessage = StrRespMsg(
            code = message,
            message = MessageSourceHolder.getMessage(message)
        )
    )

}

/**
 * 请求资源状态存在冲突异常
 *
 * @author 思追(shaco)
 */
class ConflictException(
    status: HttpStatus = HttpStatus.CONFLICT,
    businessMessage: ResponseBusinessMessage = ResponseBusinessMessage.CONFLICT
) : BusinessException(
    status = status,
    businessMessage = businessMessage
) {

    constructor(
        message: String
    ) : this(
        businessMessage = StrRespMsg(
            code = message,
            message = MessageSourceHolder.getMessage(message)
        )
    )

}

/**
 * 请求资源已经永久过期异常
 *
 * @author 思追(shaco)
 */
class GoneException(
    status: HttpStatus = HttpStatus.GONE,
    businessMessage: ResponseBusinessMessage = ResponseBusinessMessage.GONE
) : BusinessException(
    status = status,
    businessMessage = businessMessage
) {

    constructor(
        message: String
    ) : this(
        businessMessage = StrRespMsg(
            code = message,
            message = MessageSourceHolder.getMessage(message)
        )
    )

}

/**
 * 错误请求异常
 *
 * @author 思追(shaco)
 */
class BadRequestException(
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    businessMessage: ResponseBusinessMessage = ResponseBusinessMessage.BAD_REQUEST
) : BusinessException(
    status = status,
    businessMessage = businessMessage
) {

    constructor(
        message: String
    ) : this(
        businessMessage = StrRespMsg(
            code = message,
            message = MessageSourceHolder.getMessage(message)
        )
    )

}

