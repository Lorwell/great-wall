package cc.shacocloud.greatwall.utils

import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import kotlin.io.path.exists
import kotlin.io.path.invariantSeparatorsPathString
import kotlin.io.path.isDirectory
import kotlin.io.path.name


/**
 * 如果文件不存在则创建
 */
fun File.createOfNotExist(): File {
    if (!exists()) {
        this.parentFile?.let {
            if (!it.exists()) {
                it.mkdirs()
            }
        }
        createNewFile()
    }

    return this
}

/**
 * 如果文件不存在则创建
 */
fun Path.createOfNotExist(): Path {
    if (!Files.exists(this)) {
        this.parent?.let {
            if (!it.exists()) {
                Files.createDirectories(it)
            }
        }
        Files.createFile(this)
    }

    return this
}

/**
 * 如果文件夹不存在则创建
 */
fun Path.createDirOfNotExist(): Path {
    if (!Files.exists(this)) {
        this.parent?.let {
            if (!it.exists()) {
                Files.createDirectories(it)
            }
        }
        Files.createDirectory(this)
    }

    return this
}

/**
 * 获取相对路径
 */
fun Path.relativePath(mainPath: Path): String {
    return invariantSeparatorsPathString
        .removePrefix(mainPath.invariantSeparatorsPathString)
        .removePrefix("/")
}

/**
 * 递归删除所有文件
 */
fun Path.deleteAll() {
    if (isDirectory()) {
        Files.walk(this)
            .sorted(Comparator.reverseOrder())
            .map(Path::toFile)
            .forEach(File::delete)
    } else {
        Files.delete(this)
    }
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