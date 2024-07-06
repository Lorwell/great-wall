package cc.shacocloud.greatwall.utils

import java.io.File
import java.nio.file.Files
import java.nio.file.Path


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

/**
 * 如果文件不存在则创建
 */
fun Path.createOfNotExist(): Path {
    if (!Files.exists(this)) {
        Files.createDirectories(this.parent)
        Files.createFile(this)
    }

    return this
}