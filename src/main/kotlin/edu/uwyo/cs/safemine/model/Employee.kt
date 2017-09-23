package edu.uwyo.cs.safemine.model

import org.springframework.data.annotation.Id

data class Employee(
        @Id val id: String,
        val name: String,
        val department: String?
)