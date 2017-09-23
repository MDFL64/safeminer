@file:JvmName("Main")

package edu.uwyo.cs.safemine

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
@ComponentScan("edu.uwyo.cs.safemine")
@EnableAutoConfiguration
open class SafemineApplication

fun main(args: Array<String>) {
    SpringApplication.run(SafemineApplication::class.java, *args)
}
