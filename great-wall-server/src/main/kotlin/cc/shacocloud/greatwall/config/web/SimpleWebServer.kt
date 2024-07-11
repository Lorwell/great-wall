package cc.shacocloud.greatwall.config.web

import org.springframework.beans.factory.DisposableBean
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.boot.web.server.WebServer
import org.springframework.context.event.EventListener

/**
 * 简单的 web server
 * @author 思追(shaco)
 */
class SimpleWebServer(
    private val webServer: WebServer
) : DisposableBean {

    @EventListener(ApplicationReadyEvent::class)
    fun start() {
        webServer.start()
    }

    fun stop() {
        webServer.stop()
    }

    override fun destroy() {
        stop()
    }

}