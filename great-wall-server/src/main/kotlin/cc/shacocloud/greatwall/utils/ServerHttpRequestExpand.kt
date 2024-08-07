package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.config.web.TrafficStatisticsHttpRequestDecorator
import cc.shacocloud.greatwall.config.web.TrafficStatisticsHttpResponseDecorator
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse

const val UNKNOWN = "unknown"

/**
 * 获取请求的真实ip，如果无法获取则返回 [UNKNOWN]
 * @author 思追(shaco)
 */
fun ServerHttpRequest.getRealIp(): String {
    var ip = headers.getFirst("X-Real-IP")

    if (ip.isNullOrBlank() || UNKNOWN.equals(ip, true)) {
        ip = headers.getFirst("X-Forwarded-For")
    }
    if (ip.isNullOrBlank() || UNKNOWN.equals(ip, true)) {
        ip = headers.getFirst("Proxy-Client-IP")
    }
    if (ip.isNullOrBlank() || UNKNOWN.equals(ip, true)) {
        ip = headers.getFirst("WL-Proxy-Client-IP")
    }
    if (ip.isNullOrBlank() || UNKNOWN.equals(ip, true)) {
        ip = remoteAddress?.address?.hostAddress
    }

    return ip?.let { it.split(",")[0].trim() } ?: UNKNOWN
}

/**
 * 获取请求的 Host
 * @author 思追(shaco)
 */
fun ServerHttpRequest.getHost(): String {
    return headers.host?.hostString ?: UNKNOWN
}

/**
 * 获取请求内容长度
 */
fun ServerHttpRequest.getContentLength(): Long {
    if (this is TrafficStatisticsHttpRequestDecorator) {
        return requestBodySize.get()
    }

    val contentLength = headers.contentLength
    return contentLength.coerceAtLeast(0)
}

/**
 * 获取响应内容长度
 */
fun ServerHttpResponse.getContentLength(): Long {
    if (this is TrafficStatisticsHttpResponseDecorator) {
        return responseBodySize.get()
    }

    val contentLength = headers.contentLength
    return contentLength.coerceAtLeast(0)
}