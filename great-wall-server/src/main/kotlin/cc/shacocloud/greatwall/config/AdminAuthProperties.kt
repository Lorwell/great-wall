package cc.shacocloud.greatwall.config

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * 管理员认证配置属性
 * @author 思追(shaco)
 */
@ConfigurationProperties("site.auth.admin")
data class AdminAuthProperties(

    /**
     * 管理源密码
     */
    val password: String

) {


    companion object {

        /**
         * 管理员的账号
         */
        const val ADMIN_USER = "admin"
    }

}