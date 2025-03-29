package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.dto.input.StaticResourcesInput
import cc.shacocloud.greatwall.model.dto.output.FileOutput
import cc.shacocloud.greatwall.model.po.StaticResourcesPo
import cc.shacocloud.greatwall.utils.createOfNotExist
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Paths
import kotlin.io.path.invariantSeparatorsPathString

/**
 * @author 思追(shaco)
 */
interface StaticResourcesService {

    companion object {

        // 静态资源存储文件夹
        val STATIC_RESOURCES_DIR_PATH = Paths.get("${System.getProperty("user.dir")}/data/staticResources/")
            .createOfNotExist()

        val STATIC_RESOURCES_DIR = STATIC_RESOURCES_DIR_PATH.invariantSeparatorsPathString

    }

    /**
     * 根据id查询
     */
    suspend fun findById(id: Long): StaticResourcesPo?

    /**
     * 创建静态资源
     */
    suspend fun create(input: StaticResourcesInput): StaticResourcesPo

    /**
     * 更新静态资源
     */
    suspend fun update(staticResourcesPo: StaticResourcesPo, input: StaticResourcesInput): StaticResourcesPo

    /**
     * 删除静态资源
     */
    suspend fun delete(staticResourcesPo: StaticResourcesPo)

    /**
     * 文件列表
     */
    suspend fun files(staticResourcesPo: StaticResourcesPo, parentDir: String?): List<FileOutput>

    /**
     * 上传文件
     */
    suspend fun uploadFile(
        staticResourcesPo: StaticResourcesPo,
        multipartFile: MultipartFile,
        parentDir: String?
    ): FileOutput

    /**
     * 下载文件
     */
    suspend fun downloadFile(
        response: ServerHttpResponse,
        staticResourcesPo: StaticResourcesPo,
        relativePath: String
    )

    /**
     * 删除文件
     */
    suspend fun deleteFile(staticResourcesPo: StaticResourcesPo, relativePath: String)


}