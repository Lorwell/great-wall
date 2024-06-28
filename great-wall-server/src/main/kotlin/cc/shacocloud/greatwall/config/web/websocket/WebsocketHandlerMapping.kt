package cc.shacocloud.greatwall.config.web.websocket

import org.springframework.core.Ordered
import org.springframework.core.annotation.AnnotationUtils
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.WebSocketHandler

/**
 * web socket 处理器映射
 *
 * @see WebsocketMapping
 * @author 思追(shaco)
 */
class WebsocketHandlerMapping : SimpleUrlHandlerMapping() {

    override fun initApplicationContext() {

        val urlMap = obtainApplicationContext().getBeansOfType(WebSocketHandler::class.java)
            .filter { AnnotationUtils.getAnnotation(it.value::class.java, WebsocketMapping::class.java) != null }
            .map {
                val websocketMapping =
                    AnnotationUtils.getAnnotation(it.value::class.java, WebsocketMapping::class.java)!!
                websocketMapping.value to it.value
            }
            .toMap()

        setUrlMap(urlMap)
        order = Ordered.HIGHEST_PRECEDENCE

        super.initApplicationContext()
    }
}