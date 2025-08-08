import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("org.springframework.boot") version "3.5.3"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.graalvm.buildtools.native") version "0.11.0"
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    kotlin("plugin.serialization") version "1.9.25"
    kotlin("kapt") version "1.9.25"
}

group = "cc.shacocloud"
version = "2.34"

java {
    sourceCompatibility = JavaVersion.VERSION_21
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    // 是否为 github ci 环境
    val githubCiEnable = providers.environmentVariable("GITHUB_CI")
        .getOrElse("false")
        .toBoolean()

    if (!githubCiEnable) {
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
    }
    mavenCentral()
    google()
}

extra["springCloudVersion"] = "2025.0.0"

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

    // 确保 Spring 插件正确配置
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
        jvmTarget = JvmTarget.JVM_21
        javaParameters = true // 保留参数名
        allWarningsAsErrors = false
    }
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.1")

    implementation("org.springframework.cloud:spring-cloud-starter-gateway-server-webflux")
    implementation("io.netty:netty-tcnative-boringssl-static:2.0.70.Final")
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


// 绑定版本号
tasks.processResources {
    filesMatching("application-greatwall.yaml") {
        filteringCharset = "UTF-8"
        expand(
            "version" to project.version
        )
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// 强制 processResources 在 copyFeBuildResultToBe 之后执行
tasks.named("processResources") {
    mustRunAfter("copyFeBuildResultToBe")
}

// 打包
tasks.register("greatWallPackage") {
    group = "build"
    dependsOn("copyFeBuildResultToBe", "bootJar")
}

// 打包
tasks.register("greatWallNativeCompile") {
    group = "build"
    dependsOn("copyFeBuildResultToBe", "nativeCompile")
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
tasks.register<Exec>("preBuildFe") {
    group = "build"
    val feDir = File(rootProject.projectDir.absoluteFile, "great-wall-fe").absoluteFile
    workingDir(feDir)
    commandLine("pnpm", "i")
}
tasks.register<Exec>("buildFe") {
    group = "build"
    dependsOn("preBuildFe")
    val feDir = File(rootProject.projectDir.absoluteFile, "great-wall-fe").absoluteFile
    workingDir(feDir)
    commandLine("pnpm", "run", "build")
}
// 拷贝前端构建结果
tasks.register<Copy>("copyFeBuildResultToBe") {
    group = "build"
    dependsOn("buildFe")
    val rootProjectDir = rootProject.projectDir.absoluteFile

    // 前端项目目录
    val feDir = File(rootProjectDir, "great-wall-fe").absoluteFile
    val distDir = File(feDir, "dist").absoluteFile

    // 后端项目目录
    val beDir = File(rootProjectDir, "great-wall-server").absoluteFile
    val targetDir = File(beDir, "src/main/resources/static").absoluteFile

    doFirst {
        targetDir.deleteRecursively()
    }

    // 复制
    from(distDir.absolutePath)
    into(targetDir.absolutePath)
}