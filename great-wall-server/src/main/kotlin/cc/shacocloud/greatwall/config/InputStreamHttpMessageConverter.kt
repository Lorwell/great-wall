package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import org.springframework.http.HttpInputMessage
import org.springframework.http.HttpOutputMessage
import org.springframework.http.MediaType
import org.springframework.http.converter.AbstractHttpMessageConverter
import org.springframework.util.StreamUtils
import java.io.File
import java.io.FileInputStream
import java.io.InputStream

/**
 * [InputStream] 消息转换器
 * @author 思追(shaco)
 */
class InputStreamHttpMessageConverter : AbstractHttpMessageConverter<InputStream>(
    MediaType.parseMediaType("application/zip;charset=utf-8")
) {


    override fun supports(clazz: Class<*>): Boolean {
        return clazz.isAssignableFrom(InputStream::class.java)
    }

    override fun writeInternal(input: InputStream, message: HttpOutputMessage) {
        StreamUtils.copy(input, message.body)
    }

    override fun readInternal(clazz: Class<out InputStream>, message: HttpInputMessage): InputStream {
        val tempFile = kotlin.io.path.createTempFile().toFile()

        message.body.use {
            tempFile.outputStream().use { outputStream ->
                message.body.copyTo(outputStream)
            }
        }

        return HttpInputSteam(tempFile)
    }


    class HttpInputSteam(private val file: File) : FileInputStream(file) {

        override fun close() {
            try {
                super.close()
            } finally {
                try {
                    file.delete()
                } catch (e: Exception) {
                    if (log.isWarnEnabled) {
                        log.warn("关闭流时，删除临时文件发生例外！", e)
                    }
                    file.deleteOnExit()
                }
            }
        }
    }
}