package com.example.proyecto.modelo;

import java.math.BigDecimal;


public class ModeloSalarioConversion {
    
    private BigDecimal salarioDolares;
    private BigDecimal salarioColones;
    private Double tipoCambio;
    private String fechaTipoCambio;

    public ModeloSalarioConversion() {}

    public ModeloSalarioConversion(BigDecimal salarioDolares, BigDecimal salarioColones, Double tipoCambio) {
        this.salarioDolares = salarioDolares;
        this.salarioColones = salarioColones;
        this.tipoCambio = tipoCambio;
    }

    public ModeloSalarioConversion(BigDecimal salarioDolares, BigDecimal salarioColones, Double tipoCambio, String fechaTipoCambio) {
        this.salarioDolares = salarioDolares;
        this.salarioColones = salarioColones;
        this.tipoCambio = tipoCambio;
        this.fechaTipoCambio = fechaTipoCambio;
    }

    public BigDecimal getSalarioDolares() {
        return salarioDolares;
    }

    public void setSalarioDolares(BigDecimal salarioDolares) {
        this.salarioDolares = salarioDolares;
    }

    public BigDecimal getSalarioColones() {
        return salarioColones;
    }

    public void setSalarioColones(BigDecimal salarioColones) {
        this.salarioColones = salarioColones;
    }

    public Double getTipoCambio() {
        return tipoCambio;
    }

    public void setTipoCambio(Double tipoCambio) {
        this.tipoCambio = tipoCambio;
    }

    public String getFechaTipoCambio() {
        return fechaTipoCambio;
    }

    public void setFechaTipoCambio(String fechaTipoCambio) {
        this.fechaTipoCambio = fechaTipoCambio;
    }

    @Override
    public String toString() {
        return "ModeloSalarioConversion{" +
                "salarioDolares=" + salarioDolares +
                ", salarioColones=" + salarioColones +
                ", tipoCambio=" + tipoCambio +
                ", fechaTipoCambio='" + fechaTipoCambio + '\'' +
                '}';
    }
}
