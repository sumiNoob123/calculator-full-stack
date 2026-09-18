package com.calculator.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.calculator.backend.entity.CalculationHistory;
import com.calculator.backend.service.CalculationHistoryService;

@RestController
@RequestMapping("/api/calculations")
@CrossOrigin(origins = "*")
public class CalculationHistoryController {

    private final CalculationHistoryService service;

    public CalculationHistoryController(CalculationHistoryService service) {
        this.service = service;
    }

    // GET - get all calculation history
    @GetMapping
    public List<CalculationHistory> getAllCalculations() {
        return service.getAllCalculations();
    }

    // POST - save a new calculation
    @PostMapping
    public CalculationHistory saveCalculation(
            @RequestBody CalculationHistory calculation) {

        return service.saveCalculation(calculation);
    }

    // DELETE - delete all history
    @DeleteMapping
    public void deleteAllCalculations() {
        service.deleteAllCalculations();
    }

    // DELETE - delete one calculation by ID
    @DeleteMapping("/{id}")
    public void deleteCalculation(@PathVariable Long id) {
        service.deleteCalculation(id);
    }
}