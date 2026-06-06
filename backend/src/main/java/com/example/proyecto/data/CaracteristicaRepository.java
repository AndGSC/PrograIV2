package com.example.proyecto.data;

import com.example.proyecto.logica.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Integer> {

    List<Caracteristica> findByIdPadre(Caracteristica padre);

    List<Caracteristica> findByIdPadreIsNull();

    List<Caracteristica> findByIdPadre_Id(Integer idPadre);

    @Query("SELECT c FROM Caracteristica c LEFT JOIN FETCH c.idPadre")
    List<Caracteristica> findAllConPadre();
}
