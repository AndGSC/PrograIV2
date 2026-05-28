package com.example.proyecto.logica;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
public class PuestoCaracteristicaId implements Serializable {

    private Integer idPuesto;

    private Integer idCaracteristica;

    public PuestoCaracteristicaId() {}

    public PuestoCaracteristicaId(Integer idPuesto, Integer idCaracteristica) {
        this.idPuesto = idPuesto;
        this.idCaracteristica = idCaracteristica;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PuestoCaracteristicaId that = (PuestoCaracteristicaId) o;
        return Objects.equals(idPuesto, that.idPuesto) && Objects.equals(idCaracteristica, that.idCaracteristica);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPuesto, idCaracteristica);
    }
}
