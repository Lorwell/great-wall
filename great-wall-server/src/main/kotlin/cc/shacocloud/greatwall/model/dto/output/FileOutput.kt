package cc.shacocloud.greatwall.model.dto.output

import cc.shacocloud.greatwall.model.constant.FileTypeEnum
import cc.shacocloud.greatwall.utils.relativePath
import java.nio.file.Path
import kotlin.io.path.fileSize
import kotlin.io.path.getLastModifiedTime
import kotlin.io.path.isDirectory
import kotlin.io.path.pathString

/**
 * 文件
 * @author 思追(shaco)
 */
data class FileOutput(
    val name: String,
    val type: FileTypeEnum,
    val parentDir: String?,
    val relativePath: String,
    val size: Long,
    val lastUpdateTime: Long
) {

    constructor(mainPath: Path, filePath: Path) : this(
        name = filePath.fileName.pathString,
        type = if (filePath.isDirectory()) FileTypeEnum.DIR else FileTypeEnum.FILE,
        parentDir = filePath.parent?.relativePath(mainPath),
        relativePath = filePath.relativePath(mainPath),
        size = filePath.fileSize(),
        lastUpdateTime = filePath.getLastModifiedTime().toMillis()
    )

}
