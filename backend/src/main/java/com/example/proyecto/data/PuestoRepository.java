package com.example.proyecto.data;

import com.example.proyecto.logica.Puesto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.Instant;

@Repository
public interface PuestoRepository extends CrudRepository<Puesto, Integer> {
  
    List<Puesto> findByIdEmpresaId(Integer empresaId);

    List<Puesto> findByActivoTrue();

    Optional<Puesto> findByIdAndIdEmpresaId(Integer idPuesto, Integer idEmpresa);

    List<Puesto> findBySalarioUsdBetween(BigDecimal min, BigDecimal max);

    List<Puesto> findBySalarioUsdBetweenAndActivoTrue(BigDecimal min, BigDecimal max);

    List<Puesto> findByDescripcionGeneralContainingIgnoreCaseAndTipoPublicacion(String descripcion, String tipo);

    List<Puesto> findByDescripcionGeneralContainingIgnoreCaseAndTipoPublicacionAndActivoTrue(String descripcion, String tipo);

    List<Puesto> findByTipoPublicacion(String tipo);

    List<Puesto> findByTipoPublicacionAndActivoTrue(String tipo);

    List<Puesto> findTop5ByTipoPublicacionOrderByFechaRegistroDesc(String tipo);

    List<Puesto> findTop5ByTipoPublicacionAndActivoTrueOrderByFechaRegistroDesc(String tipo);

    List<Puesto> findByFechaRegistroGreaterThanEqualAndFechaRegistroLessThan(Instant inicio, Instant fin);
}
