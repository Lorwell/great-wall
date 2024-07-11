package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.utils.converter.BooleanConverter
import org.springframework.aot.hint.MemberCategory
import org.springframework.aot.hint.RuntimeHints
import org.springframework.aot.hint.RuntimeHintsRegistrar
import java.io.File
import java.net.URL

/**
 * 注册 native 配置
 * @author 思追(shaco)
 */
class SiteRuntimeHintsRegistrar : RuntimeHintsRegistrar {

    // 反射类型的配置
    private val reflectionMemberCategory = MemberCategory.entries.toTypedArray()

    // 注册的指定文件规则
    private val registerPatters = arrayOf(
        // sql 文件
        "sql/*.sql",
        // 静态资源
        "static/*",
    )

    // 注册的指定类型
    private val registerTypes = arrayOf<Class<*>>(
        BooleanConverter::class.java
    )

    // 扫描的指定包名
    private val scanPackages = arrayOf(
        "cc.shacocloud.greatwall.controller.specification",
        "cc.shacocloud.greatwall.model",
        "cc.shacocloud.greatwall.service.client.dto",
    )


    override fun registerHints(hints: RuntimeHints, classLoader: ClassLoader?) {
        requireNotNull(classLoader)

        // sql 文件
        registerPatters.forEach { hints.resources().registerPattern(it) }

        // 注册指定的类
        registerTypes.forEach { registerType(hints, it) }

        // 指定要扫描的包下的所有文件
        // 用于解决 springboot 3.2.x 中针对 kotlin 反射的bug，同时也可以批量扫描指定目录下的所有文件，将它们标识为可反射的
        scanBasePackage(
            hints,
            classLoader,
            scanPackages
        )
    }


    // ---------------------------------

    /**
     * 注册类型
     */
    private fun registerType(hints: RuntimeHints, clazz: Class<*>) {
        println("============== add hints: $clazz")

        hints.reflection().registerType(clazz, *reflectionMemberCategory)
    }

    /**
     * 扫描指定包路径下的类型
     */
    private fun scanBasePackage(
        hints: RuntimeHints,
        classLoader: ClassLoader,
        basePackages: Array<String>
    ) {
        for (basePackage in basePackages) {
            val resources = classLoader.getResources(basePackage.replace('.', '/'))

            resources.toList()
                .mapNotNull { resource ->
                    getFilePath(resource)?.let {
                        getFromDirectory(File(it), basePackage, classLoader)
                    }
                }
                .flatMap { it.toList() }
                .forEach { registerType(hints, it) }
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
        if (!clazz.isAnonymousClass && !clazz.isAnnotation && !clazz.isSynthetic) {
            classes.add(clazz)
        }
    }

}

