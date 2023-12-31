package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.config.serializer.DateDeserializer
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.module.SimpleModule
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import java.util.*

/**
 * Json 工具对象
 * @author 思追(shaco)
 */
object Json {

    /**
     * 基础的 [ObjectMapper]
     */
    val mapper = Jackson2ObjectMapperBuilder.json()
        .postConfigurer { mapper ->
            val module = SimpleModule()
            module.addDeserializer(Date::class.java, DateDeserializer())
            mapper.registerModule(module)
        }
        .build<ObjectMapper>()

}