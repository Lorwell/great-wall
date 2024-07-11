package cc.shacocloud.greatwall.model.dto

import cc.shacocloud.greatwall.utils.converter.BooleanConverter
import cc.shacocloud.greatwall.utils.converter.Convert

/**
 *
 * @author 思追(shaco)
 */
data class SettingsDto(

    /**
     * 请求是否重定向到 https
     */
    @Convert(BooleanConverter::class)
    val redirectHttps: Boolean

)


