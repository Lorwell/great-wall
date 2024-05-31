package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.model.dto.output.Demo
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 *
 * @author 思追(shaco)
 */
@RestController
@RequestMapping("/api")
class AppRouteController {

    @GetMapping("/test")
    suspend fun test(): Demo {
        return Demo("hello world")
    }

//    @GetMapping("/test")
//    suspend fun test(input: AppRouteInput): String {
//        return "hello world"
//    }

}