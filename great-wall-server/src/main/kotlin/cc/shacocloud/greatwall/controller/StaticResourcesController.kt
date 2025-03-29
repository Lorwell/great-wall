package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.exception.BadRequestException
import cc.shacocloud.greatwall.controller.exception.NotAcceptableException
import cc.shacocloud.greatwall.controller.exception.NotFoundException
import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.dto.input.StaticResourcesInput
import cc.shacocloud.greatwall.model.dto.output.StaticResourcesOutput.Companion.toOutput
import cc.shacocloud.greatwall.model.mo.RouteStaticResourcesTargetConfig
import cc.shacocloud.greatwall.service.AppRouteService
import cc.shacocloud.greatwall.service.StaticResourcesService
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.transaction.annotation.Transactional
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

/**
 * 静态资源控制器
 * @author 思追(shaco)
 */
@UserAuth
@Validated
@RestController
@RequestMapping("/api/static-resources")
@Transactional(rollbackFor = [Exception::class])
class StaticResourcesController(
    val staticResourcesService: StaticResourcesService,
    val appResourceService: AppRouteService
) {

    /**
     * 创建静态资源
     */
    @PostMapping
    suspend fun create(
        @RequestBody @Validated input: StaticResourcesInput
    ): Any {
        return staticResourcesService.create(input).toOutput()
    }

    /**
     * 更新静态资源
     */
    @PutMapping("/{id}")
    suspend fun update(
        @PathVariable id: Long,
        @RequestBody @Validated input: StaticResourcesInput
    ): Any {
        val staticResourcesPo = staticResourcesService.findById(id) ?: throw NotFoundException()
        return staticResourcesService.update(staticResourcesPo, input).toOutput()
    }

    /**
     * 删除静态资源
     */
    @DeleteMapping("/{id}")
    suspend fun delete(
        @PathVariable id: Long
    ) {
        val staticResourcesPo = staticResourcesService.findById(id) ?: throw NotFoundException()

        val correlation = appResourceService.findByStatus(AppRouteStatusEnum.ONLINE)
            .any {
                val targetConfig = it.targetConfig
                if (targetConfig is RouteStaticResourcesTargetConfig) {
                    targetConfig.id == staticResourcesPo.id
                } else
                    false
            }

        if (correlation) {
            throw NotAcceptableException("静态资源存在关联路由，无法删除！")
        }

        staticResourcesService.delete(staticResourcesPo)
    }

    /**
     * 文件列表
     */
    @GetMapping("/{id}/files")
    suspend fun files(
        @PathVariable id: Long,
        @RequestParam(name = "parentDir", required = false) parentDir: String?
    ): Any {
        val staticResourcesPo = staticResourcesService.findById(id) ?: throw NotFoundException()
        return staticResourcesService.files(staticResourcesPo, parentDir)
    }

    /**
     * 上传文件
     */
    @PostMapping("/{id}/files")
    suspend fun uploadFile(
        @PathVariable id: Long,
        @RequestParam("file") file: MultipartFile,
        @RequestParam(name = "parentDir", required = false) parentDir: String?,
    ): Any {
        if (file.originalFilename.isNullOrBlank()) {
            throw BadRequestException("原始文件名不得为空！")
        }

        val staticResourcesPo = staticResourcesService.findById(id) ?: throw NotFoundException()
        return staticResourcesService.uploadFile(staticResourcesPo, file, parentDir)
    }

    /**
     * 下载文件
     */
    @GetMapping("/{id}/files/download")
    suspend fun downloadFile(
        response: ServerHttpResponse,
        @PathVariable id: Long,
        @RequestParam(name = "relativePath") relativePath: String,
    ) {
        val staticResourcesPo = staticResourcesService.findById(id) ?: throw NotFoundException()
        staticResourcesService.downloadFile(response, staticResourcesPo, relativePath)
    }

    /**
     * 删除文件
     */
    @DeleteMapping("/{id}/files")
    suspend fun deleteFile(
        @PathVariable id: Long,
        @RequestParam(name = "relativePath") relativePath: String,
    ) {
        val staticResourcesPo = staticResourcesService.findById(id) ?: throw NotFoundException()
        staticResourcesService.deleteFile(staticResourcesPo, relativePath)
    }
}