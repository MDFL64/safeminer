package edu.uwyo.cs.safemine.model

import java.time.LocalDateTime

data class SafetyCard(
        val employeeId: CharSequence,
        val date: LocalDateTime,
        val jobDescription: CharSequence,
        val jobNumber: CharSequence,
        val risks: Map<Risk, CharSequence>
)