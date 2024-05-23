package cc.shacocloud.greatwall.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 *
 * @author 思追(shaco)
 */
@RestController
class TestController {

    @GetMapping("/test")
    suspend fun test(): String {
        return "hello world"
    }

}