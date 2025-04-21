pluginManagement {
    repositories {
        // 改为阿里云的镜像地址
        maven {
            isAllowInsecureProtocol = true
            setUrl("https://maven.aliyun.com/repository/gradle-plugin")
        }
        gradlePluginPortal()
    }
}

rootProject.name = "great-wall"
include("great-wall-server")
