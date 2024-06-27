package cc.shacocloud.greatwall.config.web.websocket

import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.reactive.socket.WebSocketHandler

/**
 * 定义在 [WebSocketHandler] 的子类上，用于绑定 websocket 处理器
 * @author 思追(shaco)
 */
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Component
annotation class WSHandler(

    /**
     * ws 请求路径
     *
     * @see RequestMapping.path
     */
    val value: String

)
