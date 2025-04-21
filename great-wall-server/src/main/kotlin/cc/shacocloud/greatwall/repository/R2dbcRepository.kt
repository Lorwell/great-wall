package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Criteria
import org.springframework.data.relational.core.query.Query
import org.springframework.data.repository.NoRepositoryBean
import kotlin.reflect.jvm.jvmErasure
import kotlin.reflect.typeOf

/**
 * 通用的 [R2dbcRepository]，便于封装一些拓展函数
 *
 * @author 思追(shaco)
 */
@NoRepositoryBean
interface R2dbcRepository<T> : org.springframework.data.r2dbc.repository.R2dbcRepository<T, Long>

/**
 * 懒加载实体管理器模板
 */
val entityTemplate: R2dbcEntityTemplate by lazy {
    val context = ApplicationContextHolder.getInstance()
    context.getBean(R2dbcEntityTemplate::class.java)
}

/**
 * 分页查询
 */
@Suppress("UNCHECKED_CAST")
suspend inline fun <reified T> R2dbcRepository<T>.pageQuery(criteria: Criteria, pageable: Pageable): Page<T> {
    val clazz = typeOf<T>().jvmErasure.java as Class<T>

    // 统计总长度
    val total = entityTemplate.count(Query.query(criteria), clazz).awaitSingle()

    if (total == 0.toLong()) {
        return PageImpl(emptyList(), pageable, total)
    }

    val query = Query.query(criteria).with(pageable)
    val contents = entityTemplate.select(query, clazz).collectList().awaitSingle()
    return PageImpl(contents, pageable, total)
}

/**
 * 查询全部
 */
@Suppress("UNCHECKED_CAST")
suspend inline fun <reified T> R2dbcRepository<T>.findAllByCriteria(criteria: Criteria): List<T> {
    val clazz = typeOf<T>().jvmErasure.java as Class<T>
    return entityTemplate.select(Query.query(criteria), clazz).collectList().awaitSingle()
}