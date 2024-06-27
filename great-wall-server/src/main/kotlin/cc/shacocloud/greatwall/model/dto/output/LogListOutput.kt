package cc.shacocloud.greatwall.model.dto.output

import cc.shacocloud.greatwall.model.dto.convert.LogEnum
import java.nio.file.Path
import kotlin.io.path.fileSize
import kotlin.io.path.getLastModifiedTime
import kotlin.io.path.invariantSeparatorsPathString
import kotlin.io.path.pathString

/**
 *
 * @author 思追(shaco)
 */
data class LogListOutput(
    val name: String,
    val type: LogEnum,
    val size: Long,
    val path: String,
    val lastUpdateTime: Long
) {

    constructor(type: LogEnum, path: Path, rootDir: Path) : this(
        name = path.fileName.pathString,
        type = type,
        size = path.fileSize(),
        path = path.toAbsolutePath().normalize().invariantSeparatorsPathString
            .removePrefix(rootDir.invariantSeparatorsPathString)
            .removePrefix("/"),
        lastUpdateTime = path.getLastModifiedTime().toMillis()
    )

}
