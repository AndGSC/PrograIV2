package com.example.proyecto.data;

import com.example.proyecto.logica.OferenteCaracteristica;
import com.example.proyecto.logica.OferenteCaracteristicaId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OferenteCaracteristicaRepository extends CrudRepository<OferenteCaracteristica, OferenteCaracteristicaId> {
    List<OferenteCaracteristica> findByIdOferente(Integer idOferente);
    
    List<OferenteCaracteristica> findByIdCaracteristica(Integer idCaracteristica);

}
