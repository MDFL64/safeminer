package edu.uwyo.cs.safemine.database

import edu.uwyo.cs.safemine.model.Employee
import edu.uwyo.cs.safemine.model.Risk
import edu.uwyo.cs.safemine.model.SafetyCard
import org.springframework.data.mongodb.repository.MongoRepository
import java.time.LocalDateTime

interface SafetyCardRespository : MongoRepository<SafetyCard, String> {
    fun findByEmployee(employee: Employee): List<SafetyCard>
    fun findByDate(date: LocalDateTime): List<SafetyCard>
    fun findByRisk(risk: Risk): List<SafetyCard>
}