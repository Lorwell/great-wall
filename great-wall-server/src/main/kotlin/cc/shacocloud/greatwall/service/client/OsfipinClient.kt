package cc.shacocloud.greatwall.service.client

import cc.shacocloud.greatwall.model.mo.OsfipinTlsConfig
import cc.shacocloud.greatwall.service.client.dto.output.CertificateDetailOutput
import cc.shacocloud.greatwall.service.client.dto.output.CertificateListOutput
import java.util.zip.ZipFile

/**
 * @author 思追(shaco)
 */
interface OsfipinClient {

    /**
     * 下载证书为一个zip文件
     *
     * @return 返回临时文件，用完可以直接删除
     */
    fun download(config: OsfipinTlsConfig): ZipFile


}