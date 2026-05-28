package com.example.proyecto.logica;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "oferentes")
public class Oferente {
    @Id
    @Column(name = "id_oferente", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_oferente", nullable = false)
    private Usuario usuarios;

    @Column(name = "identificacion", nullable = false)
    private Integer identificacion;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 50)
    private String apellido;

    @Column(name = "nacionalidad", length = 50)
    private String nacionalidad;

    @Column(name = "telefono")
    private Integer telefono;

    @Column(name = "residencia", length = 100)
    private String residencia;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "curriculum_pdf", columnDefinition = "LONGBLOB")
    private byte[] curriculumPdf;

}