package com.calculator.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.calculator.backend.entity.CalculationHistory;

public interface CalculationHistoryRepository
        extends JpaRepository<CalculationHistory, Long> {

}