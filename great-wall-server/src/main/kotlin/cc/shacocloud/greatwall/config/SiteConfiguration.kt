package cc.shacocloud.greatwall.config

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.ImportRuntimeHints

/**
 * @author 思追(shaco)
// */
@Configuration
@EnableConfigurationProperties(OsfipinProperties::class)
@ImportRuntimeHints(FixBugRuntimeHintsRegistrar::class)
class SiteConfiguration
