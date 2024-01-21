package cc.shacocloud.greatwall.service.client

import cc.shacocloud.greatwall.service.client.dto.output.CertificateDetailOutput
import cc.shacocloud.greatwall.service.client.dto.output.CertificateListOutput
import java.util.zip.ZipFile

/**
 * @author 思追(shaco)
 */
interface OsfipinClient {

    /**
     * 下载证书《为一个zip文件
     * @return 返回临时文件，用完可以直接删除
     */
    fun download(): ZipFile

    /**
     * 证书详情
     * @param id 证书id
     */
    fun certificateDetail(id: String): CertificateDetailOutput

    /**
     * 当前域名的证书详情
     * @param
     */
    fun currentDomainCertificateDetail(): CertificateDetailOutput

    /**
     * 证书列表
     * @param page 分页数值，默认为1
     */
    fun certificateList(page: Int = 1): CertificateListOutput


}