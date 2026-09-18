package com.calculator.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calculation_history")
public class CalculationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String expression;

    private String result;

    private String operationType;

    private String angleMode;

    private LocalDateTime createdAt;

    // Default constructor
    public CalculationHistory() {
    }

    // Constructor
    public CalculationHistory(String expression, String result,
                              String operationType, String angleMode) {
        this.expression = expression;
        this.result = result;
        this.operationType = operationType;
        this.angleMode = angleMode;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public String getAngleMode() {
        return angleMode;
    }

    public void setAngleMode(String angleMode) {
        this.angleMode = angleMode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}