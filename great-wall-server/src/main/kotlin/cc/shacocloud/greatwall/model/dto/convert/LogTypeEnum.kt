package cc.shacocloud.greatwall.model.dto.convert

/**
 *
 * @author 思追(shaco)
 */
enum class LogTypeEnum(
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