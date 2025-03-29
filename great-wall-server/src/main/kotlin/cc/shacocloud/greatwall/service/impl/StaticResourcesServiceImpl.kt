package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.controller.exception.ForbiddenException
import cc.shacocloud.greatwall.controller.exception.NotFoundException
import cc.shacocloud.greatwall.model.dto.input.StaticResourcesInput
import cc.shacocloud.greatwall.model.dto.output.FileOutput
import cc.shacocloud.greatwall.model.po.StaticResourcesPo
import cc.shacocloud.greatwall.repository.StaticResourcesRepository
import cc.shacocloud.greatwall.service.StaticResourcesService
import cc.shacocloud.greatwall.service.StaticResourcesService.Companion.STATIC_RESOURCES_DIR
import cc.shacocloud.greatwall.service.StaticResourcesService.Companion.STATIC_RESOURCES_DIR_PATH
import cc.shacocloud.greatwall.utils.ObjectId
import cc.shacocloud.greatwall.utils.createOfNotExist
import cc.shacocloud.greatwall.utils.deleteAll
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.core.io.buffer.DefaultDataBufferFactory
import org.springframework.http.MediaType
import org.springframework.http.MediaTypeFactory
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*
import kotlin.io.path.pathString

/**
 * @author 思追(shaco)
 */
@Service
@Transactional(rollbackFor = [Exception::class])
class StaticResourcesServiceImpl(
    var staticResourcesRepository: StaticResourcesRepository
) : StaticResourcesService {

    /**
     * 根据id查询
     */
    override suspend fun findById(id: Long): StaticResourcesPo? {
        return staticResourcesRepository.findById(id).awaitSingleOrNull()
    }

    /**
     * 创建静态资源
     */
    override suspend fun create(input: StaticResourcesInput): StaticResourcesPo {
        val staticResourcesPo = StaticResourcesPo(
            name = input.name,
            uniqueId = ObjectId.next(""),
            describe = input.describe,
            createTime = Date(),
            lastUpdateTime = Date()
        )

        // 创建文件夹
        Paths.get(STATIC_RESOURCES_DIR, staticResourcesPo.uniqueId).createOfNotExist()

        return staticResourcesRepository.save(staticResourcesPo).awaitSingle()
    }

    /**
     * 更新静态资源
     */
    override suspend fun update(
        staticResourcesPo: StaticResourcesPo,
        input: StaticResourcesInput
    ): StaticResourcesPo {
        staticResourcesPo.apply {
            name = input.name
            describe = input.describe
            lastUpdateTime = Date()
        }
        return staticResourcesRepository.save(staticResourcesPo).awaitSingle()
    }

    /**
     * 删除静态资源
     */
    override suspend fun delete(staticResourcesPo: StaticResourcesPo) {
        Paths.get(STATIC_RESOURCES_DIR, staticResourcesPo.uniqueId).deleteAll()
        staticResourcesRepository.delete(staticResourcesPo).awaitSingleOrNull()
    }

    /**
     * 文件列表
     */
    override suspend fun files(
        staticResourcesPo: StaticResourcesPo,
        parentDir: String?
    ): List<FileOutput> {
        val parentDirPath = getFilePath(parentDir)
        return Files.list(parentDirPath)
            .map { FileOutput(STATIC_RESOURCES_DIR_PATH, it) }
            .toList()
    }

    /**
     * 上传文件
     */
    override suspend fun uploadFile(
        staticResourcesPo: StaticResourcesPo,
        multipartFile: MultipartFile,
        parentDir: String?
    ): FileOutput {
        val parentDirPath = getFilePath(parentDir)
        val path = parentDirPath.resolve(multipartFile.originalFilename!!)

        // 安全检查
        if (!path.startsWith(STATIC_RESOURCES_DIR_PATH)) {
            throw ForbiddenException()
        }

        multipartFile.transferTo(path)

        return FileOutput(STATIC_RESOURCES_DIR_PATH, path)
    }

    /**
     * 下载文件
     */
    override suspend fun downloadFile(
        response: ServerHttpResponse,
        staticResourcesPo: StaticResourcesPo,
        relativePath: String
    ) {
        val filePath = getFilePath(relativePath)

        if (!Files.exists(filePath)) {
            throw NotFoundException()
        }

        // 设置响应类型
        response.headers.contentType = MediaTypeFactory.getMediaType(filePath.fileName.pathString)
            .orElse(MediaType.APPLICATION_OCTET_STREAM)

        // 写出文件
        val dataBufferFlux = DataBufferUtils.read(
            FileSystemResource(filePath), DefaultDataBufferFactory(true), 4096
        )

        response.writeWith(dataBufferFlux).awaitSingleOrNull()
    }

    /**
     * 删除文件
     */
    override suspend fun deleteFile(
        staticResourcesPo: StaticResourcesPo,
        relativePath: String
    ) {
        val filePath = getFilePath(relativePath)
        filePath.deleteAll()
    }

    /**
     * 获取文件路径
     */
    fun getFilePath(relativePath: String?): Path {
        val path = if (!relativePath.isNullOrBlank()) {
            STATIC_RESOURCES_DIR_PATH.resolve(Paths.get(relativePath))
        } else {
            STATIC_RESOURCES_DIR_PATH
        }

        // 安全检查
        if (!path.startsWith(STATIC_RESOURCES_DIR_PATH)) {
            throw ForbiddenException()
        }
        return path
    }

}