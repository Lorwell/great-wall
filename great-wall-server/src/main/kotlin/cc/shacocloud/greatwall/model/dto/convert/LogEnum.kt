package cc.shacocloud.greatwall.model.dto.convert

/**
 *
 * @author 思追(shaco)
 */
enum class LogEnum(
    val dirName: String
) {

    /**
     * 系统日志
     */
    ROOT("root"),

    /**
     * 访问日志
     */
    ACCESS("access_log")


}