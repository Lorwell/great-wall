package cc.shacocloud.greatwall.config.web.websocket

import cc.shacocloud.greatwall.utils.Slf4j
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.core.annotation.AnnotationUtils
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.WebSocketHandler


/**
 * web socket 配置
 * @author 思追(shaco)
 */
@Slf4j
@Configuration
class WebSocketConfiguration {

    /**
     * web socket 处理器映射
     */
    @Bean
    fun websocketHandlerMapping(applicationContext: ApplicationContext): HandlerMapping {
        val urlMap = applicationContext.getBeansOfType(WebSocketHandler::class.java)
            .filter { AnnotationUtils.getAnnotation(it.value::class.java, WSHandler::class.java) != null }
            .map {
                val wsHandler = AnnotationUtils.getAnnotation(it.value::class.java, WSHandler::class.java)!!
                wsHandler.value to it.value
            }
            .toMap()
        return SimpleUrlHandlerMapping(urlMap, Ordered.HIGHEST_PRECEDENCE)

    }


}