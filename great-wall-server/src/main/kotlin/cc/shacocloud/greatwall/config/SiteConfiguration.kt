package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.repository.CacheRepository
import cc.shacocloud.greatwall.service.cache.CacheManager
import cc.shacocloud.greatwall.service.cache.DBCacheManager
import org.springframework.boot.autoconfigure.context.MessageSourceAutoConfiguration
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.ImportRuntimeHints

/**
 * @author 思追(shaco)
// */
@Configuration
@EnableConfigurationProperties(OsfipinProperties::class, AdminAuthProperties::class)
@ImportRuntimeHints(SiteRuntimeHintsRegistrar::class)
@Import(MessageSourceAutoConfiguration::class)
class SiteConfiguration {

    /**
     * 缓存管理器
     */
    @Bean
    fun cacheManager(cacheRepository: CacheRepository): CacheManager {
        return DBCacheManager(cacheRepository)
    }
}
