package cc.shacocloud.greatwall.controller

import org.springframework.boot.actuate.autoconfigure.web.ManagementContextConfiguration
import org.springframework.boot.actuate.autoconfigure.web.ManagementContextType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 *
 * @author 思追(shaco)
 */
@RestController
@ManagementContextConfiguration(value = ManagementContextType.CHILD, proxyBeanMethods = false)
class DemoController(
) {

    @GetMapping("/test")
    suspend fun test(): String {
        return "hello world"
    }

}