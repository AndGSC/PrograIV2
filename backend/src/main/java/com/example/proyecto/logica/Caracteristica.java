package com.example.proyecto.logica;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "caracteristicas")
public class Caracteristica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_caract", nullable = false)
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_padre")
    private Caracteristica idPadre;

    @OneToMany(mappedBy = "idPadre")
    private Set<Caracteristica> caracteristicas = new LinkedHashSet<>();

    @OneToMany(mappedBy = "caracteristica")
    private Set<PuestoCaracteristica> puestoCaracteristicas = new LinkedHashSet<>();

}