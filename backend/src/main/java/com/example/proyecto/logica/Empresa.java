package com.example.proyecto.logica;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "empresas")
public class Empresa {
    @Id
    @Column(name = "id_empresa", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Usuario usuarios;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "localizacion", length = 100)
    private String localizacion;

    @Column(name = "telefono")
    private Integer telefono;

    @Lob
    @Column(name = "descripcion")
    private String descripcion;

    @OneToMany(mappedBy = "idEmpresa")
    private Set<Puesto> puestos = new LinkedHashSet<>();

}