package cc.shacocloud.greatwall.config.web.websocket

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.HandlerMapping


/**
 * web socket 配置
 * @author 思追(shaco)
 */
@Configuration
class WebSocketConfiguration {

    /**
     * web socket 处理器映射
     */
    @Bean
    fun websocketHandlerMapping(): HandlerMapping {
        return WebsocketHandlerMapping()
    }

}