package com.example.proyecto.logica;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario", nullable = false)
    private Integer id;

    @Column(name = "correo", nullable = false, length = 100)
    private String correo;

    @Column(name = "clave", nullable = false, length = 255)
    private String clave;

    @Column(name = "tipo_usuario", nullable = false, length = 20)
    private String tipoUsuario;

    @ColumnDefault("0")
    @Column(name = "aprobado")
    private Boolean aprobado;

    @OneToOne(mappedBy = "usuarios", fetch = FetchType.LAZY)
    private Empresa empresa;

    @OneToOne(mappedBy = "usuarios", fetch = FetchType.LAZY)
    private Oferente oferente;

}