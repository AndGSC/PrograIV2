package com.example.proyecto.logica;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "oferente_caracteristica")
@IdClass(OferenteCaracteristicaId.class)
public class OferenteCaracteristica {

    @Id
    @Column(name = "id_oferente")
    private Integer idOferente;

    @Id
    @Column(name = "id_caract")
    private Integer idCaracteristica;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_oferente", insertable = false, updatable = false)
    private Oferente oferente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_caract", insertable = false, updatable = false)
    private Caracteristica caracteristica;

    @Column(name = "nivel", nullable = false)
    private Integer nivel;
}
