package cc.shacocloud.greatwall.utils

import org.junit.jupiter.api.Test

/**
 *
 * @author 思追(shaco)
 */
class ObjectIdTest {

    @Test
    operator fun next() {
        for (i in 0..100000) {
            val id = ObjectId.next()
            println(id)
        }
    }
}