package com.example.proyecto.service;

import com.example.proyecto.data.CaracteristicaRepository;
import com.example.proyecto.data.PuestoCaracteristicaRepository;
import com.example.proyecto.data.PuestoRepository;
import com.example.proyecto.logica.Caracteristica;
import com.example.proyecto.logica.Puesto;
import com.example.proyecto.logica.PuestoCaracteristica;
import com.example.proyecto.logica.PuestoCaracteristicaId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class PuestoCaracteristicaService {

    private final PuestoCaracteristicaRepository puestoCaracteristicaRepository;
    private final PuestoRepository puestoRepository;
    private final CaracteristicaRepository caracteristicaRepository;

    public PuestoCaracteristicaService(PuestoCaracteristicaRepository puestoCaracteristicaRepository,
                                       PuestoRepository puestoRepository,
                                       CaracteristicaRepository caracteristicaRepository) {
        this.puestoCaracteristicaRepository = puestoCaracteristicaRepository;
        this.puestoRepository = puestoRepository;
        this.caracteristicaRepository = caracteristicaRepository;
    }

    public List<PuestoCaracteristica> obtenerPorPuesto(Integer idPuesto) {
        if (idPuesto == null) {
            return List.of();
        }
        return puestoCaracteristicaRepository.findByIdPuesto(idPuesto);
    }


    public List<PuestoCaracteristica> obtenerPorCaracteristica(Integer idCaracteristica) {
        if (idCaracteristica == null) {
            return List.of();
        }
        return puestoCaracteristicaRepository.findByIdCaracteristica(idCaracteristica);
    }


    public Optional<PuestoCaracteristica> obtenerPorId(Integer idPuesto, Integer idCaracteristica) {
        if (idPuesto == null || idCaracteristica == null) {
            return Optional.empty();
        }
        return puestoCaracteristicaRepository.findById(new PuestoCaracteristicaId(idPuesto, idCaracteristica));
    }


    public boolean existeRelacion(Integer idPuesto, Integer idCaracteristica) {
        return obtenerPorId(idPuesto, idCaracteristica).isPresent();
    }


    public PuestoCaracteristica guardarCaracteristicaRequerida(Integer idPuesto,
                                                               Integer idCaracteristica,
                                                               Integer nivelRequerido) {
        validarIds(idPuesto, idCaracteristica);
        validarNivel(nivelRequerido);

        Puesto puesto = puestoRepository.findById(idPuesto)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el puesto indicado."));

        Caracteristica caracteristica = caracteristicaRepository.findById(idCaracteristica)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la característica indicada."));

        validarNodoHoja(caracteristica);

        PuestoCaracteristica relacion = obtenerPorId(idPuesto, idCaracteristica)
                .orElseGet(PuestoCaracteristica::new);

        relacion.setIdPuesto(idPuesto);
        relacion.setIdCaracteristica(idCaracteristica);
        relacion.setPuesto(puesto);
        relacion.setCaracteristica(caracteristica);
        relacion.setNivelRequerido(nivelRequerido);

        return puestoCaracteristicaRepository.save(relacion);
    }


    public List<PuestoCaracteristica> reemplazarCaracteristicas(Integer idPuesto,
                                                                Map<Integer, Integer> caracteristicasConNivel) {
        if (idPuesto == null) {
            throw new IllegalArgumentException("El ID del puesto es requerido.");
        }

        if (!puestoRepository.existsById(idPuesto)) {
            throw new IllegalArgumentException("No se encontró el puesto indicado.");
        }

        eliminarPorPuesto(idPuesto);

        if (caracteristicasConNivel == null || caracteristicasConNivel.isEmpty()) {
            return List.of();
        }

        Map<Integer, Integer> normalizadas = new LinkedHashMap<>(caracteristicasConNivel);
        List<PuestoCaracteristica> guardadas = new ArrayList<>();

        for (Map.Entry<Integer, Integer> entry : normalizadas.entrySet()) {
            Integer idCaracteristica = entry.getKey();
            Integer nivelRequerido = entry.getValue();

            if (idCaracteristica == null) {
                continue;
            }

            guardadas.add(guardarCaracteristicaRequerida(idPuesto, idCaracteristica, nivelRequerido));
        }

        return guardadas;
    }


    public boolean eliminarCaracteristicaDePuesto(Integer idPuesto, Integer idCaracteristica) {
        Optional<PuestoCaracteristica> relacion = obtenerPorId(idPuesto, idCaracteristica);
        if (relacion.isEmpty()) {
            return false;
        }

        puestoCaracteristicaRepository.delete(relacion.get());
        return true;
    }


    public void eliminarPorPuesto(Integer idPuesto) {
        List<PuestoCaracteristica> actuales = obtenerPorPuesto(idPuesto);
        if (!actuales.isEmpty()) {
            puestoCaracteristicaRepository.deleteAll(actuales);
        }
    }


    public Map<Integer, Integer> obtenerMapaRequisitos(Integer idPuesto) {
        Map<Integer, Integer> mapa = new LinkedHashMap<>();

        for (PuestoCaracteristica pc : obtenerPorPuesto(idPuesto)) {
            if (pc.getIdCaracteristica() != null && pc.getNivelRequerido() != null) {
                mapa.put(pc.getIdCaracteristica(), pc.getNivelRequerido());
            }
        }

        return mapa;
    }

    private void validarIds(Integer idPuesto, Integer idCaracteristica) {
        if (idPuesto == null) {
            throw new IllegalArgumentException("El ID del puesto es requerido.");
        }
        if (idCaracteristica == null) {
            throw new IllegalArgumentException("El ID de la característica es requerido.");
        }
    }

    private void validarNivel(Integer nivelRequerido) {
        if (nivelRequerido == null) {
            throw new IllegalArgumentException("El nivel requerido es obligatorio.");
        }

        if (nivelRequerido < 1 || nivelRequerido > 5) {
            throw new IllegalArgumentException("El nivel requerido debe estar entre 1 y 5.");
        }
    }


    private void validarNodoHoja(Caracteristica caracteristica) {
        boolean tieneHijos = !caracteristicaRepository.findByIdPadre(caracteristica).isEmpty();

        if (tieneHijos) {
            throw new IllegalArgumentException("Solo se pueden seleccionar características finales del árbol.");
        }
    }
}