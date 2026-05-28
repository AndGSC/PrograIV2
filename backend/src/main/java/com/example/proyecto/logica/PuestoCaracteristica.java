package com.example.proyecto.logica;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "puesto_caracteristica")
@IdClass(PuestoCaracteristicaId.class)
public class PuestoCaracteristica {

    @Id
    @Column(name = "id_puesto")
    private Integer idPuesto;

    @Id
    @Column(name = "id_caract")
    private Integer idCaracteristica;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_puesto", insertable = false, updatable = false)
    private Puesto puesto;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_caract", insertable = false, updatable = false)
    private Caracteristica caracteristica;

    @Column(name = "nivel_requerido", nullable = false)
    private Integer nivelRequerido;
}
