import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import java.io.RandomAccessFile
import java.nio.file.Files

plugins {
    id("java")
    id("org.springframework.boot") version "3.2.5"
    id("io.spring.dependency-management") version "1.1.5"
    id("org.graalvm.buildtools.native") version "0.10.2"
    kotlin("jvm") version "2.0.0"
    kotlin("kapt") version "2.0.0"
    kotlin("plugin.spring") version "2.0.0"
    kotlin("plugin.serialization") version "2.0.0"
}

group = "cc.shacocloud"
version = "2.14"

java {
    sourceCompatibility = JavaVersion.VERSION_21
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    // 改为阿里云的镜像地址
    maven {
        isAllowInsecureProtocol = true
        setUrl("https://maven.aliyun.com/repository/central")
    }
    maven {
        isAllowInsecureProtocol = true
        setUrl("https://maven.aliyun.com/repository/jcenter")
    }
    maven {
        isAllowInsecureProtocol = true
        setUrl("https://maven.aliyun.com/repository/google")
    }
    maven {
        isAllowInsecureProtocol = true
        setUrl("https://maven.aliyun.com/repository/public")
    }
    maven {
        isAllowInsecureProtocol = true
        setUrl("https://jitpack.io")
    }
    mavenCentral()
    google()
}

extra["springCloudVersion"] = "2023.0.1"

dependencyManagement {
    imports {
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
    }
}

kotlin {
    sourceSets.main {
        kotlin.srcDir("build/generated/ksp/main/kotlin")
    }
    sourceSets.test {
        kotlin.srcDir("build/generated/ksp/test/kotlin")
    }
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")

    implementation("org.springframework.cloud:spring-cloud-starter-gateway")
    implementation("org.springframework.boot:spring-boot-starter-json")

    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("io.r2dbc:r2dbc-h2")

    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactive")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xjsr305=strict")
        jvmTarget = JvmTarget.JVM_21
    }
}


tasks.withType<Test> {
    useJUnitPlatform()
}

// 处理资源之前先将前端资源复制到指定目录
tasks.withType<ProcessResources> {
    // 如果不想在构建时编译前端项目，可以将此行注释，在打包项目时解开注释即可
    dependsOn("copyFeBuildResultToBe")
}

graalvmNative {

    // 是否启用 g1 gc
    val glEnable = if (project.hasProperty("gl.enable")) {
        val enable = project.properties["gl.enable"]
        "true" == enable?.toString()
    } else {
        false
    }

    binaries.all {

        if (glEnable) {
            println("使用 G1GC 作为本地化镜像的垃圾回收器")
            buildArgs.add("--gc=G1")
        }

        buildArgs.add("-H:+ReportUnsupportedElementsAtRuntime")
        buildArgs.add("--initialize-at-build-time=kotlin.DeprecationLevel")
        // 配合 jni-config.json 解决 javax.naming.directory.InitialDirContext fails on windows
        // @see https://github.com/oracle/graal/issues/4304
        buildArgs.add("--initialize-at-run-time=sun.net.dns.ResolverConfigurationImpl")
    }
}

// 构建前端项目
task("buildFe") {

    doFirst {
        val rootProjectDir = rootProject.projectDir.absoluteFile
        val feDir = File(rootProjectDir, "great-wall-fe").absoluteFile
        val distDir = File(feDir, "dist").absoluteFile

        if (distDir.exists()) {
            println("构建结果已存在，跳过本次构建...")
            return@doFirst
        }

        // 执行构建命令
        val logFile = Files.createTempFile("great-wall-build-fe", "log").toFile()
        logFile.deleteOnExit()
        val process = ProcessBuilder()
            .directory(feDir)
            .command("pnpm", "run", "build")
            .redirectErrorStream(true)
            .redirectOutput(ProcessBuilder.Redirect.to(logFile))
            .start()

        println()
        println("开始构建前端项目...")
        println()

        // 打印日志
        printProcessLogFile(logFile, process)

        val exitCode = process.waitFor()

        println()
        println("构建前端项目结束，退出状态码：${exitCode}")
        println()

        if (exitCode != 0) {
            throw RuntimeException("构建前端项目失败，退出状态码为：${exitCode}！")
        }
    }
}

// 复制前端构建结果到后端项目中
task("copyFeBuildResultToBe") {

    doFirst {
        val rootProjectDir = rootProject.projectDir.absoluteFile

        // 前端项目目录
        val feDir = File(rootProjectDir, "great-wall-fe").absoluteFile
        val distDir = File(feDir, "dist").absoluteFile

        // 后端项目目录
        val beDir = File(rootProjectDir, "great-wall-server").absoluteFile
        val targetDir = File(beDir, "src/main/resources/static").absoluteFile
        targetDir.deleteRecursively()

        // 复制
        distDir.copyRecursively(targetDir, true)
    }
}.dependsOn("buildFe")


// ---------------  函数 ------------

// 打印进程日志文件
fun printProcessLogFile(
    logFile: File,
    process: Process,
) {
    RandomAccessFile(logFile, "r").use { accessFile ->
        while (true) {
            val line = accessFile.readLine()

            if (line.isNullOrEmpty()) {
                val filePointer: Long = accessFile.filePointer
                val length: Long = accessFile.length()

                // 到达尾行
                if (filePointer >= length) {

                    if (process.isAlive) {
                        Thread.sleep(1000)
                    } else {
                        break
                    }
                }
            } else {
                println(line)
            }
        }
    }
}