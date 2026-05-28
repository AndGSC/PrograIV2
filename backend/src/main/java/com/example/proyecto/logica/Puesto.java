package com.example.proyecto.logica;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "puestos")
public class Puesto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_puesto", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa idEmpresa;

    @Column(name = "descripcion_general", nullable = false, columnDefinition = "TEXT")
    private String descripcionGeneral;

    @Column(name = "salario_usd", nullable = false, precision = 10, scale = 2)
    private BigDecimal salarioUsd;

    @Column(name = "tipo_publicacion", nullable = false)
    private String tipoPublicacion;

    @ColumnDefault("1")
    @Column(name = "activo")
    private Boolean activo;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha_registro")
    private Instant fechaRegistro;

    @OneToMany(mappedBy = "puesto")
    private Set<PuestoCaracteristica> caracteristicas = new LinkedHashSet<>();

}