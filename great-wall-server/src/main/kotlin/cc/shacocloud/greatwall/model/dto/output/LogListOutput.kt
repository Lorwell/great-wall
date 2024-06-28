package cc.shacocloud.greatwall.model.dto.output

import cc.shacocloud.greatwall.model.dto.convert.LogTypeEnum
import java.nio.file.Path
import kotlin.io.path.fileSize
import kotlin.io.path.getLastModifiedTime
import kotlin.io.path.pathString

/**
 *
 * @author 思追(shaco)
 */
data class LogListOutput(
    val name: String,
    val type: LogTypeEnum,
    val size: Long,
    val lastUpdateTime: Long
) {

    constructor(type: LogTypeEnum, path: Path) : this(
        name = path.fileName.pathString,
        type = type,
        size = path.fileSize(),
        lastUpdateTime = path.getLastModifiedTime().toMillis()
    )

}
