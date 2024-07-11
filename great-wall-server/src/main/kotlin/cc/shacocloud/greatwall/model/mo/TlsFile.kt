package cc.shacocloud.greatwall.model.mo

import java.nio.file.Path

/**
 *
 * @author 思追(shaco)
 */
data class TlsFile(

    val certificatePath: Path,

    val privateKeyPath: Path
)
