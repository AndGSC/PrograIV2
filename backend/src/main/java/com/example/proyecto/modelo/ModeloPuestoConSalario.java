package com.example.proyecto.modelo;

import java.math.BigDecimal;

public class ModeloPuestoConSalario {
    
    private Integer idPuesto;
    private String nombreEmpresa;
    private String descripcion;
    private BigDecimal salarioDolares;
    private BigDecimal salarioColones;
    private Double tipoCambio;
    private String tipoPublicacion;
    private String localizacion;
    private boolean activo;

    public ModeloPuestoConSalario() {}

    public ModeloPuestoConSalario(Integer idPuesto, String nombreEmpresa, String descripcion,
                                   BigDecimal salarioDolares, BigDecimal salarioColones,
                                   Double tipoCambio, String tipoPublicacion,
                                   String localizacion, boolean activo) {
        this.idPuesto = idPuesto;
        this.nombreEmpresa = nombreEmpresa;
        this.descripcion = descripcion;
        this.salarioDolares = salarioDolares;
        this.salarioColones = salarioColones;
        this.tipoCambio = tipoCambio;
        this.tipoPublicacion = tipoPublicacion;
        this.localizacion = localizacion;
        this.activo = activo;
    }

    public Integer getIdPuesto() {
        return idPuesto;
    }

    public void setIdPuesto(Integer idPuesto) {
        this.idPuesto = idPuesto;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
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

    public String getTipoPublicacion() {
        return tipoPublicacion;
    }

    public void setTipoPublicacion(String tipoPublicacion) {
        this.tipoPublicacion = tipoPublicacion;
    }

    public String getLocalizacion() {
        return localizacion;
    }

    public void setLocalizacion(String localizacion) {
        this.localizacion = localizacion;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    @Override
    public String toString() {
        return "ModeloPuestoConSalario{" +
                "idPuesto=" + idPuesto +
                ", nombreEmpresa='" + nombreEmpresa + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", salarioDolares=" + salarioDolares +
                ", salarioColones=" + salarioColones +
                ", tipoCambio=" + tipoCambio +
                ", tipoPublicacion='" + tipoPublicacion + '\'' +
                ", localizacion='" + localizacion + '\'' +
                ", activo=" + activo +
                '}';
    }
}
