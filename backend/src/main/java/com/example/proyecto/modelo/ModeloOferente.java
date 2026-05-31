package com.example.proyecto.modelo;

public class ModeloOferente {

    private Integer id;
    private String identificacion;
    private String nombre;
    private String apellido;

    private String nacionalidad;

    private String telefono;
    private String email;
    private String residencia;
    private String clave;

    private Boolean aprobado = false;

    public ModeloOferente() {
        // Requerido para data binding (Thymeleaf/Spring MVC)
    }

    public ModeloOferente(String identificacion,
                          String nombre,
                          String apellido,
                          String nacionalidad,
                          String telefono,
                          String email,
                          String residencia) {
        this.identificacion = identificacion;
        this.nombre = nombre;
        this.apellido = apellido;
        this.nacionalidad = nacionalidad;
        this.telefono = telefono;
        this.email = email;
        this.residencia = residencia;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIdentificacion() {
        return identificacion;
    }

    public void setIdentificacion(String identificacion) {
        this.identificacion = identificacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }

    public String getCodigoNacionalidad() {
        return nacionalidad;
    }

    public void setCodigoNacionalidad(String codigoNacionalidad) {
        this.nacionalidad = codigoNacionalidad;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getResidencia() {
        return residencia;
    }

    public void setResidencia(String residencia) {
        this.residencia = residencia;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public Boolean getAprobado() {
        return aprobado;
    }

    public void setAprobado(Boolean aprobado) {
        this.aprobado = aprobado;
    }
}