package edu.uwyo.cs.safemine.model

import java.time.LocalDateTime

data class SafetyCard(
        val employee: Employee,
        val date: LocalDateTime,
        val jobDescription: String,
        val jobNumber: String,
        val risks: Map<Risk, String>
)