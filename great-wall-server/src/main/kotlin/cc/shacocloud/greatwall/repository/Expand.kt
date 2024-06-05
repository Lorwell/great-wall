package cc.shacocloud.greatwall.repository

import com.infobip.spring.data.r2dbc.QuerydslR2dbcRepository
import com.querydsl.core.types.Predicate
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.NoRepositoryBean
import reactor.core.publisher.Flux

/**
 * 通用的 [R2dbcRepository]，便于封装一些拓展函数
 */
@NoRepositoryBean
interface R2dbcRepository<T, ID> : QuerydslR2dbcRepository<T, ID> {

    fun findAllBy(predicate: Predicate, pageable: Pageable): Flux<T>

}

/**
 * 封装的分页查询拓展函数
 *
 * @author 思追(shaco)
 */
suspend fun <T : Any, ID : Any> R2dbcRepository<T, ID>.queryPage(predicate: Predicate, pageable: Pageable): Page<T> {
    val total = count(predicate).awaitSingle()
    if (total == 0.toLong()) {
        return PageImpl(emptyList(), pageable, total)
    }

    val contents = findAllBy(predicate, pageable).collectList().awaitSingle()
    return PageImpl(contents, pageable, total)
}