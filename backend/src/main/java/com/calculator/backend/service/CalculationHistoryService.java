package com.calculator.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.calculator.backend.entity.CalculationHistory;
import com.calculator.backend.repository.CalculationHistoryRepository;

@Service
public class CalculationHistoryService {

    private final CalculationHistoryRepository repository;

    public CalculationHistoryService(CalculationHistoryRepository repository) {
        this.repository = repository;
    }

    // Get all calculation history
    public List<CalculationHistory> getAllCalculations() {
        return repository.findAll();
    }

    // Save a new calculation
    public CalculationHistory saveCalculation(CalculationHistory calculation) {
        return repository.save(calculation);
    }

    // Delete all calculation history
    public void deleteAllCalculations() {
        repository.deleteAll();
    }

    // Delete one calculation by ID
    public void deleteCalculation(Long id) {
        repository.deleteById(id);
    }
}
