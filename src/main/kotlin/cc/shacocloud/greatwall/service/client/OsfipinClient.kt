package cc.shacocloud.greatwall.service.client

import java.io.File

/**
 * @author 思追(shaco)
 */
interface OsfipinClient {

    /**
     * 下载证书《为一个zip文件
     * @param autoId 自动验证id
     */
    fun download(autoId: String): File

}