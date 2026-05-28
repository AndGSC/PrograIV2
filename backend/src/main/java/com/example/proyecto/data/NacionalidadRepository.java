package com.example.proyecto.data;

import com.example.proyecto.logica.Nacionalidad;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NacionalidadRepository extends CrudRepository<Nacionalidad, Integer> {
    Optional<Nacionalidad> findByNombre(String nombre);
    Optional<Nacionalidad> findByCodigo(String codigo);
    List<Nacionalidad> findAllByActivoTrue();
    List<Nacionalidad> findAllByActivoTrueOrderByNombreAsc();
    List<Nacionalidad> findAllByOrderByNombreAsc();
}
