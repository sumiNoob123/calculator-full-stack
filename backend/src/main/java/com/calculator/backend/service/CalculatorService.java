package com.calculator.backend.service;

import com.calculator.backend.entity.CalculationHistory;
import com.calculator.backend.repository.CalculationHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalculatorService {

    private final CalculationHistoryRepository repository;

    public CalculatorService(CalculationHistoryRepository repository) {
        this.repository = repository;
    }

    // Save calculation
    public CalculationHistory saveCalculation(
            String expression,
            String result,
            String operationType,
            String angleMode) {

        CalculationHistory calculation = new CalculationHistory(
                expression,
                result,
                operationType,
                angleMode
        );

        return repository.save(calculation);
    }

    // Get all calculation history
    public List<CalculationHistory> getAllHistory() {
        return repository.findAll();
    }

    // Clear all history
    public void clearHistory() {
        repository.deleteAll();
    }
}
