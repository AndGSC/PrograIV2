package com.example.proyecto.logica;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "nacionalidades")
public class Nacionalidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;
    
    @Column(name = "codigo", nullable = false, unique = true, length = 3)
    private String codigo;
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    public Nacionalidad() {}
    
    public Nacionalidad(String nombre, String codigo) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.activo = true;
    }
}
