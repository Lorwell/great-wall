package cc.shacocloud.greatwall.service.client

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

}