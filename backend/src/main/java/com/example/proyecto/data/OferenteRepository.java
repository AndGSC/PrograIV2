package com.example.proyecto.data;

import com.example.proyecto.logica.Oferente;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OferenteRepository extends CrudRepository<Oferente, Integer> {
    List<Oferente> findByNombreContainingIgnoreCase(String nombre);
    List<Oferente> findByNacionalidad(String nacionalidad);
}
