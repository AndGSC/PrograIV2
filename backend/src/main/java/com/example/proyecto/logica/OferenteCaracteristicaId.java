package com.example.proyecto.logica;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
public class OferenteCaracteristicaId implements Serializable {

    private Integer idOferente;

    private Integer idCaracteristica;

    public OferenteCaracteristicaId() {}

    public OferenteCaracteristicaId(Integer idOferente, Integer idCaracteristica) {
        this.idOferente = idOferente;
        this.idCaracteristica = idCaracteristica;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OferenteCaracteristicaId that = (OferenteCaracteristicaId) o;
        return Objects.equals(idOferente, that.idOferente) && Objects.equals(idCaracteristica, that.idCaracteristica);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idOferente, idCaracteristica);
    }
}
