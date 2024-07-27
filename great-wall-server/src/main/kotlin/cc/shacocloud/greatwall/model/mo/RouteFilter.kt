package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.model.constant.RouteFilterEnum
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.constraints.NotNull

/**
 *
 * @author 思追(shaco)
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes(
)
abstract class RouteFilter(

    @field:NotNull
    val type: RouteFilterEnum,

    )