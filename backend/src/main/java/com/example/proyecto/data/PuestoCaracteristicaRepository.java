package com.example.proyecto.data;

import com.example.proyecto.logica.PuestoCaracteristica;
import com.example.proyecto.logica.PuestoCaracteristicaId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuestoCaracteristicaRepository extends CrudRepository<PuestoCaracteristica, PuestoCaracteristicaId> {
    List<PuestoCaracteristica> findByIdPuesto(Integer puestoId);
    
    List<PuestoCaracteristica> findByIdCaracteristica(Integer caracteristicaId);
}
