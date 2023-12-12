package cc.shacocloud.greatwall.service.client

import java.io.File

/**
 * @author 思追(shaco)
 */
interface OsfipinClient {

    /**
     * 下载证书《为一个zip文件
     * @param autoId 自动验证id
     * @return 返回临时文件，用完可以直接删除
     */
    fun download(autoId: String): File

}