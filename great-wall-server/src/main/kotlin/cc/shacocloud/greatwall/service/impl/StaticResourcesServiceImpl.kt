package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.controller.exception.ForbiddenException
import cc.shacocloud.greatwall.controller.exception.NotFoundException
import cc.shacocloud.greatwall.model.dto.input.CreateFileDirInput
import cc.shacocloud.greatwall.model.dto.input.StaticResourcesDeleteFileInput
import cc.shacocloud.greatwall.model.dto.input.StaticResourcesInput
import cc.shacocloud.greatwall.model.dto.input.StaticResourcesListInput
import cc.shacocloud.greatwall.model.dto.output.FileOutput
import cc.shacocloud.greatwall.model.po.StaticResourcesPo
import cc.shacocloud.greatwall.repository.StaticResourcesRepository
import cc.shacocloud.greatwall.repository.pageQuery
import cc.shacocloud.greatwall.service.StaticResourcesService
import cc.shacocloud.greatwall.service.StaticResourcesService.Companion.STATIC_RESOURCES_DIR_PATH
import cc.shacocloud.greatwall.utils.ObjectId
import cc.shacocloud.greatwall.utils.createDirOfNotExist
import cc.shacocloud.greatwall.utils.createOfNotExist
import cc.shacocloud.greatwall.utils.deleteAll
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.core.io.buffer.DefaultDataBufferFactory
import org.springframework.data.domain.Page
import org.springframework.http.MediaType
import org.springframework.http.MediaTypeFactory
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.net.URLDecoder
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*
import kotlin.io.path.exists
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
     * 列表
     */
    override suspend fun list(input: StaticResourcesListInput): Page<StaticResourcesPo> {
        return staticResourcesRepository.pageQuery(input.toCriteria(), input.toPageable())
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
        staticResourcesPo.getFilePath().createDirOfNotExist()

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

        // 创建文件夹
        staticResourcesPo.getFilePath().createDirOfNotExist()

        return staticResourcesRepository.save(staticResourcesPo).awaitSingle()
    }

    /**
     * 删除静态资源
     */
    override suspend fun delete(staticResourcesPo: StaticResourcesPo) {
        staticResourcesPo.getFilePath().deleteAll()
        staticResourcesRepository.delete(staticResourcesPo).awaitSingleOrNull()
    }

    /**
     * 文件列表
     */
    override suspend fun files(
        staticResourcesPo: StaticResourcesPo,
        parentDir: String?
    ): List<FileOutput> {
        val rootPath = staticResourcesPo.getFilePath()
        val parentDirPath = getFilePath(rootPath, parentDir)
        if (!parentDirPath.exists()) {
            throw NotFoundException("文件地址不存在！")
        }
        return Files.list(parentDirPath)
            .map { FileOutput(rootPath, it) }
            .sorted { o1, o2 -> o1.type.compareTo(o2.type) }
            .toList()
    }

    /**
     * 上传文件
     */
    override suspend fun uploadFile(
        staticResourcesPo: StaticResourcesPo,
        filePart: FilePart,
        parentDir: String?
    ): FileOutput {
        val parentDirPath = getFilePath(staticResourcesPo.getFilePath(), parentDir)
        val path = getFilePath(parentDirPath, filePart.filename()).createOfNotExist()

        filePart.transferTo(path).awaitSingleOrNull()

        return FileOutput(parentDirPath, path)
    }

    /**
     * 下载文件
     */
    override suspend fun downloadFile(
        response: ServerHttpResponse,
        staticResourcesPo: StaticResourcesPo,
        relativePath: String
    ) {
        val filePath = getFilePath(staticResourcesPo.getFilePath(), relativePath)

        if (!Files.exists(filePath)) {
            throw NotFoundException("文件地址不存在！")
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
        input: StaticResourcesDeleteFileInput
    ) {
        val filePath = getFilePath(staticResourcesPo.getFilePath(), input.relativePath)
        filePath.deleteAll()
    }

    /**
     * 创建文件夹
     */
    override suspend fun createFileDir(
        staticResourcesPo: StaticResourcesPo,
        input: CreateFileDirInput
    ): Path {
        val parentDirPath = getFilePath(staticResourcesPo.getFilePath(), input.parentDir)
        return getFilePath(parentDirPath, input.name).createDirOfNotExist()
    }

    /**
     * 获取文件路径
     */
    fun getFilePath(
        rootPath: Path = STATIC_RESOURCES_DIR_PATH,
        relativePath: String?
    ): Path {
        if (relativePath.isNullOrBlank()) {
            return rootPath
        }

        val path = rootPath.resolve(Paths.get(URLDecoder.decode(relativePath, "UTF-8")))

        // 安全检查
        if (!path.startsWith(rootPath)) {
            throw ForbiddenException()
        }
        return path
    }

}