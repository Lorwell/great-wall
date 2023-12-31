package cc.shacocloud.greatwall.service.client.dto.output

import com.fasterxml.jackson.annotation.JsonAlias
import com.fasterxml.jackson.annotation.JsonFormat
import org.springframework.format.annotation.DateTimeFormat
import java.util.*

/**
 * 证书详情接口的输出
 *
 * [文档](https://www.yuque.com/osfipin/letsencrypt/hengow)
 */
data class CertificateDetailOutput(

    val c: Int,

    val m: String,

    val v: CertificateDetailVOutput
)

data class CertificateDetailVOutput(

    /**
     * 自动模式使用的ID
     */
    @JsonAlias("auto_id")
    val autoId: String,

    /**
     * 自动状态
     */
    @JsonAlias("auto_status")
    val autoStatus: String,

    /**
     * 是否可以设置自动模式
     */
    @JsonAlias("can_auto")
    val canAuto: Boolean,

    /**
     * 是否可以清除秘钥
     */
    @JsonAlias("can_clean")
    val canClean: Boolean,

    /**
     * 是否可以删除
     */
    @JsonAlias("can_delete")
    val canDelete: Boolean,

    /**
     * 删除是否扣除积分
     */
    @JsonAlias("can_delete_coin")
    val canDeleteCoin: Boolean,

    /**
     * 是否可以下载
     */
    @JsonAlias("can_download")
    val canDownload: Boolean,

    /**
     * 是否可以重新申请
     */
    @JsonAlias("can_renew")
    val canRenew: Boolean,

    /**
     * 域名清单,数组
     */
    val domains: List<String>,
    val id: String,
    val mark: String,

    /**
     * 是否使用独立通道,bool
     */
    val quicker: Boolean,

    /**
     * 证书状态
     */
    val status: String,

    /**
     * 创建时间
     */
    @JsonAlias("time_add")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    val timeAdd: Date,

    /**
     * 到期时间,或截至验证时间
     */
    @JsonAlias("time_end")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    val timeEnd: Date
)