pluginManagement {
    repositories {
        // 是否为 github ci 环境
        val githubCiEnable = providers.environmentVariable("GITHUB_CI")
            .getOrElse("false")
            .toBoolean()

        if (!githubCiEnable) {
            // 改为阿里云的镜像地址
            maven {
                isAllowInsecureProtocol = true
                setUrl("https://maven.aliyun.com/repository/gradle-plugin")
            }
        }
    
        gradlePluginPortal()
    }
}

rootProject.name = "great-wall"
include("great-wall-server")
