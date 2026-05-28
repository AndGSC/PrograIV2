package com.example.proyecto.logica;

public class TipoCambio {
    private double venta;
    private double compra;
    private String moneda;
    private String fechaOperacion;

    public TipoCambio() {}

    public TipoCambio(double venta, double compra, String moneda) {
        this.venta = venta;
        this.compra = compra;
        this.moneda = moneda;
    }

    public TipoCambio(double venta, double compra, String moneda, String fechaOperacion) {
        this.venta = venta;
        this.compra = compra;
        this.moneda = moneda;
        this.fechaOperacion = fechaOperacion;
    }

    public double getVenta() {
        return venta;
    }

    public void setVenta(double venta) {
        this.venta = venta;
    }

    public double getCompra() {
        return compra;
    }

    public void setCompra(double compra) {
        this.compra = compra;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public String getFechaOperacion() {
        return fechaOperacion;
    }

    public void setFechaOperacion(String fechaOperacion) {
        this.fechaOperacion = fechaOperacion;
    }

    /**
     * Convierte un monto en dólares a colones usando el tipo de cambio de venta
     * @param montoDolares monto en dólares
     * @return monto en colones
     */
    public double convertirDolaresAColones(double montoDolares) {
        return montoDolares * this.venta;
    }

    /**
     * Convierte un monto en colones a dólares usando el tipo de cambio de compra
     * @param montoColones monto en colones
     * @return monto en dólares
     */
    public double convertirColonesToDolares(double montoColones) {
        return montoColones / this.compra;
    }

    @Override
    public String toString() {
        return "TipoCambio{" +
                "venta=" + venta +
                ", compra=" + compra +
                ", moneda='" + moneda + '\'' +
                ", fechaOperacion='" + fechaOperacion + '\'' +
                '}';
    }
}

