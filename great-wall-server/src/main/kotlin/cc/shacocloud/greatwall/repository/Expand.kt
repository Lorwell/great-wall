package cc.shacocloud.greatwall.repository

import org.springframework.data.domain.Pageable
import org.springframework.data.repository.NoRepositoryBean
import reactor.core.publisher.Flux

/**
 * 通用的 [R2dbcRepository]，便于封装一些拓展函数
 */
@NoRepositoryBean
interface R2dbcRepository<T, ID> : org.springframework.data.r2dbc.repository.R2dbcRepository<T, ID> {

    fun findAllBy(pageable: Pageable): Flux<T>

}