package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.model.constant.TlsTypeEnum
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.constraints.NotBlank

/**
 *
 * @author 思追(shaco)
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = CustomTlsConfig::class, name = "Custom"),
    JsonSubTypes.Type(value = OsfipinTlsConfig::class, name = "Osfipin"),
)
abstract class TlsConfig(

    /**
     * 证书类型
     */
    val type: TlsTypeEnum
)

/**
 * 自定义证书
 */
data class CustomTlsConfig(

    @field:NotBlank
    val certificate: String,

    @field:NotBlank
    val privateKey: String

) : TlsConfig(TlsTypeEnum.Custom)

data class OsfipinTlsConfig(

    /**
     *  接口凭证，在后台获取
     */
    @field:NotBlank
    val token: String,

    /**
     * 账户名。注册的邮箱或者手机号。
     */
    @field:NotBlank
    val user: String,

    /**
     * 证书的自动申请id
     */
    @field:NotBlank
    val autoId: String

) : TlsConfig(TlsTypeEnum.Osfipin)