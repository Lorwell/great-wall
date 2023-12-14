package cc.shacocloud.greatwall.utils

import java.io.File


/**
 * 如果文件不存在则创建
 */
fun File.createOfNotExist(): File {
    if (!exists()) {
        parentFile?.let { it.mkdirs() }
        createNewFile()
    }

    return this
}