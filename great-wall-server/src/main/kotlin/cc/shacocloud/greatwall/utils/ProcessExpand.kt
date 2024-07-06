package cc.shacocloud.greatwall.utils

/**
 * 执行命令
 * @author 思追(shaco)
 */
fun Array<String>.exec(): Process {
    return Runtime.getRuntime().exec(this);
}