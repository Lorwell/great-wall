package cc.shacocloud.greatwall.utils.json

/**
 * @author 思追(shaco)
 */
class DecodeException : RuntimeException {
    constructor()

    constructor(message: String?) : super(message)

    constructor(message: String?, cause: Throwable?) : super(message, cause)
}

/**
 * @author 思追(shaco)
 */
class EncodeException : RuntimeException {
    constructor(message: String?) : super(message)

    constructor(message: String?, cause: Throwable?) : super(message, cause)

    constructor()
}
