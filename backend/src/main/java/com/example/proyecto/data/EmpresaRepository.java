package com.example.proyecto.data;

import com.example.proyecto.logica.Empresa;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaRepository extends CrudRepository<Empresa, Integer> {

    List<Empresa> findByNombreContainingIgnoreCase(String nombre);

    List<Empresa> findByLocalizacionContainingIgnoreCase(String localizacion);
}
