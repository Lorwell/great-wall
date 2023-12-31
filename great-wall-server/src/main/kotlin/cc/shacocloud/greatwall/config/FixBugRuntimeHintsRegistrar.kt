package cc.shacocloud.greatwall.config

import org.springframework.aot.hint.MemberCategory
import org.springframework.aot.hint.RuntimeHints
import org.springframework.aot.hint.RuntimeHintsRegistrar
import org.springframework.aot.hint.TypeReference
import java.io.File
import java.net.URL
import java.util.*

/**
 * 用于解决 springboot 3.2.1 中针对 kotlin 反射的bug，同时也可以批量扫描指定目录下的所有文件，将它们标识为可反射的
 *
 * [github fix 地址](https://github.com/spring-projects/spring-data-commons/issues/2737)
 *
 * @author 思追(shaco)
 */
class FixBugRuntimeHintsRegistrar : RuntimeHintsRegistrar {

    override fun registerHints(hints: RuntimeHints, classLoader: ClassLoader?) {
        println("============== FixBugRuntimeHintsRegistrar start, classLoader: $classLoader")

        if (classLoader == null) {
            throw RuntimeException("类加载器为空！")
        }

        val basePackages = arrayOf(
            "cc.shacocloud.greatwall.service.client.dto.output",
        )

        for (basePackage in basePackages) {
            val resources = classLoader.getResources(basePackage.replace('.', '/'))

            resources.toList()
                .mapNotNull { resource ->
                    getFilePath(resource)?.let {
                        getFromDirectory(File(it), basePackage, classLoader)
                    }
                }.flatMap { it.toList() }
                .forEach { clazz ->

                    println("============== add hints: $clazz")

                    // 注册
                    hints.reflection().registerType(
                        clazz,
                        *MemberCategory.entries.toTypedArray()
                    )
                }
        }
    }

    /**
     * 获取 [URL] 对应的文件路径
     */
    private fun getFilePath(url: URL): String? {
        val filePath = url.file

        if (filePath != null) {
            if (filePath.indexOf("%20") > 0) {
                return filePath.replace("%20".toRegex(), " ")
            }
            return filePath
        }

        return null
    }

    /**
     * 从指定的文件目录获取
     */
    @Throws(ClassNotFoundException::class)
    private fun getFromDirectory(
        directory: File,
        packageName: String,
        classLoader: ClassLoader
    ): Set<Class<*>> {
        val classes = HashSet<Class<*>>()

        if (directory.exists()) {
            val files = directory.listFiles()

            if (!files.isNullOrEmpty()) {
                for (file in files) {
                    if (file.isDirectory) {
                        getFromDirectory(file, packageName + "." + file.name, classLoader).let {
                            classes.addAll(it)
                        }
                    } else if (file.name.endsWith(".class")) {
                        val className = packageName + '.' + file.name.removeSuffix(".${file.extension}")
                        val clazz: Class<*> = classLoader.loadClass(className)
                        addClass(clazz, classes)
                    }
                }
            }
        }

        return classes
    }

    /**
     * 添加 class 文件，如果类不是普通类则跳过
     */
    private fun addClass(clazz: Class<*>, classes: MutableSet<Class<*>>) {
        // 过滤枚举，注解，抽象类，匿名类，编译器生成的类
        if (!clazz.isAnonymousClass && !clazz.isAnnotation && !clazz.isEnum && !clazz.isSynthetic) {
            classes.add(clazz)
        }
    }


}

