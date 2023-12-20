pluginManagement {
    repositories {
        // 改为阿里云的镜像地址
        maven { setUrl("https://maven.aliyun.com/repository/gradle-plugin") }
        gradlePluginPortal()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.5.0"
}
rootProject.name = "great-wall"
include("great-wall-server")
