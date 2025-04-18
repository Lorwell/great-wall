package cc.shacocloud.greatwall

import org.springframework.boot.Banner
import org.springframework.boot.ansi.AnsiColor
import org.springframework.boot.ansi.AnsiOutput
import org.springframework.boot.ansi.AnsiStyle
import org.springframework.core.env.Environment
import java.io.PrintStream
import kotlin.math.max

/**
 * Great Wall banner
 * @author 思追(shaco)
 */
class GreatWallBanner : Banner {

    val banner = """
_________                  _____     ___       __      ___________
__  ____/_________________ __  /_    __ |     / /_____ ___  /__  /
_  / __ __  ___/  _ \  __ `/  __/    __ | /| / /_  __ `/_  /__  / 
/ /_/ / _  /   /  __/ /_/ // /_      __ |/ |/ / / /_/ /_  / _  /  
\____/  /_/    \___/\__,_/ \__/      ____/|__/  \__,_/ /_/  /_/   
                                                                  
			""".trimIndent()

    val greatWall: String = " :: Great Wall :: "
    val strapLineSize: Int = 42
    override fun printBanner(
        environment: Environment,
        sourceClass: Class<*>,
        out: PrintStream
    ) {
        out.println()
        out.println(banner)
        val version = String.format(" (v%s)", GreatWallVersion.version)
        val padding = " ".repeat(max(0, strapLineSize - (version.length + greatWall.length)))
        out.println(
            AnsiOutput.toString(AnsiColor.GREEN, greatWall, AnsiColor.DEFAULT, padding, AnsiStyle.FAINT, version)
        )
        out.println()
    }
}
