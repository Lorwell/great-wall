package cc.shacocloud.greatwall.service.client.dto.output

import com.fasterxml.jackson.annotation.JsonAlias

/**
 * 证书详情接口的输出
 *
 * [文档](https://www.yuque.com/osfipin/letsencrypt/rwsy01)
 */
data class CertificateListOutput(
    val c: Int,
    val m: String,
    val v: CertificateListVOutput
)

data class CertificateListVOutput(
    val all: Int,
    val mpage: Int,
    val pnum: Int,
    val num: Int,
    val list: List<CertificateListDataOutput>,
)

data class CertificateListDataOutput(

    /**
     * 证书自动状态
     */
    @JsonAlias("auto_status")
    val autoStatus: String,

    /**
     * 域名，数组
     */
    val domains: List<String>,

    /**
     * 证书id
     */
    val id: String,

    /**
     * 证书备注
     */
    val mark: String,

    /**
     * 是否使用独立通道
     */
    val quicker: Boolean,

    /**
     * 状态
     */
    val status: String,

    /**
     * 创建时间
     */
    @JsonAlias("time_add")
    val timeAdd: String,

    /**
     * 证书到期时间(或验证截至时间)
     */
    @JsonAlias("time_end")
    val timeEnd: String

)