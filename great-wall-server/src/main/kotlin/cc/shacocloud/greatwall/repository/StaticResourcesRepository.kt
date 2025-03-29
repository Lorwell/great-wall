package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.model.po.StaticResourcesPo
import org.springframework.stereotype.Repository

/**
 * @author 思追(shaco)
 */
@Repository
interface StaticResourcesRepository : R2dbcRepository<StaticResourcesPo> {
}