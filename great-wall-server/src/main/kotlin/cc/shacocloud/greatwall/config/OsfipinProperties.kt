package cc.shacocloud.greatwall.config

/**
 * @author 思追(shaco)
 */
data class OsfipinProperties(

    /**
     * 基础路由
     */
    val baseUrl: String,

    /**
     *  接口凭证，在后台获取
     */
    val token: String,

    /**
     * 账户名。注册的邮箱或者手机号。
     */
    val user: String,

    /**
     * 证书的自动申请id
     */
    val autoId: String

)
