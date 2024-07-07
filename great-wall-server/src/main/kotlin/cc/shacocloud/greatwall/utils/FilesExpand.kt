package cc.shacocloud.greatwall.utils

import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import kotlin.io.path.name


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

/**
 * 递归删除所有文件
 */
fun Path.deleteAll() {
    Files.walk(this)
        .sorted(Comparator.reverseOrder())
        .map(Path::toFile)
        .forEach(File::delete);
}

/**
 * 添加zip文件
 */
fun Path.putZipEntry(zos: ZipOutputStream) {
    val zipEntry = ZipEntry(name)
    zos.putNextEntry(zipEntry)
    Files.copy(this, zos)
    zos.closeEntry()
}