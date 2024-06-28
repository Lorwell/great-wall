package cc.shacocloud.greatwall.config.web.websocket

import cc.shacocloud.greatwall.utils.Slf4j
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.HandlerMapping


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
    fun websocketHandlerMapping(): HandlerMapping {
        return WebsocketHandlerMapping()
    }

}