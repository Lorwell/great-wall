package cc.shacocloud.greatwall.utils.validator

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import java.util.regex.Pattern
import kotlin.reflect.KClass

/**
 *
 * @author 思追(shaco)
 */
@Target(
    AnnotationTarget.FIELD,
    AnnotationTarget.VALUE_PARAMETER,
)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Constraint(validatedBy = [RegexpConstraintValidator::class])
annotation class Regexp(

    val message: String = "field.not-regexp",

    val groups: Array<KClass<*>> = [],

    val payload: Array<KClass<out Payload>> = []
)

class RegexpConstraintValidator : ConstraintValidator<Regexp, String> {

    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return true
        try {
            Pattern.compile(value)
        } catch (e: Exception) {
            return false
        }
        return true
    }

}

