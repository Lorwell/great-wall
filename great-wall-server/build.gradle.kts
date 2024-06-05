import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("java")
    id("org.springframework.boot") version "3.2.5"
    id("io.spring.dependency-management") version "1.1.5"
    id("org.graalvm.buildtools.native") version "0.10.2"
    kotlin("jvm") version "2.0.0"
    kotlin("kapt") version "2.0.0"
    kotlin("plugin.spring") version "2.0.0"
}

group = "cc.shacocloud"
version = "1.0"

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

dependencies {
    implementation("org.springframework.cloud:spring-cloud-starter-gateway")
    implementation("org.springframework.boot:spring-boot-starter-json")

    implementation("com.infobip:infobip-spring-data-r2dbc-querydsl-boot-starter:9.0.7")
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("io.r2dbc:r2dbc-h2")
    implementation("com.querydsl:querydsl-kotlin:5.1.0")
    implementation("com.querydsl:querydsl-apt:5.1.0")
    implementation("com.infobip:infobip-spring-data-r2dbc-querydsl-boot-starter:9.0.7")
    kapt("com.querydsl:querydsl-apt:5.1.0:general")

    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    // quest db 时序数据库
    implementation("org.questdb:questdb:8.0.0")


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
