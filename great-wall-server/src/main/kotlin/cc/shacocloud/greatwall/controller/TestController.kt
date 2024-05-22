package cc.shacocloud.greatwall.controller

import kotlinx.coroutines.Dispatchers.Unconfined
import kotlinx.coroutines.reactor.mono
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 *
 * @author 思追(shaco)
 */
@RestController
class TestController {

    @GetMapping("/test")
    fun test() = mono(Unconfined) {
        "hello world"
    }

}