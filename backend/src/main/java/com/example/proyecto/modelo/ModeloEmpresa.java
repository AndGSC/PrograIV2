
package com.example.proyecto.modelo;

public class ModeloEmpresa {

    private Integer id;

    private String nombre;

    private String localizacion;

    private String email;

    private String telefono;

    private String descripcion;

    private String clave;

    private Boolean aprobado = false;

    public ModeloEmpresa() {}

    public ModeloEmpresa(String nombre, String localizacion, String email, String telefono, String descripcion) {
        this.nombre = nombre;
        this.localizacion = localizacion;
        this.email = email;
        this.telefono = telefono;
        this.descripcion = descripcion;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getLocalizacion() {
        return localizacion;
    }

    public void setLocalizacion(String localizacion) {
        this.localizacion = localizacion;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
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
