package cc.shacocloud.greatwall.service.cache

/**
 * 缓存管理器
 * @author 思追(shaco)
 */
interface CacheManager {

    /**
     * 根据缓存名称获取缓存对象
     *
     * @param name 缓存名称
     */
    fun getCache(name: String): Cache

}