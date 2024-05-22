package cc.shacocloud.greatwall.utils

import org.springframework.http.server.reactive.ServerHttpRequest

const val UNKNOWN = "unknown"

/**
 * 获取请求的真实ip，如果无法获取则返回 [UNKNOWN]
 * @author 思追(shaco)
 */
fun ServerHttpRequest.getRealIp(): String {
    var ip = headers.getFirst("X-Real-IP")

    if (ip.isNullOrBlank() || UNKNOWN.equals(ip, true)) {
        ip = headers.getFirst("x-forwarded-for")
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
    return headers.getFirst("Host") ?: UNKNOWN
}