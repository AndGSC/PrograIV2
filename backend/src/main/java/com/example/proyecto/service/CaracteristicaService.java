package com.example.proyecto.service;

import com.example.proyecto.data.CaracteristicaRepository;
import com.example.proyecto.logica.Caracteristica;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import java.util.stream.StreamSupport;

@Service
public class CaracteristicaService {

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    public List<Caracteristica> obtenerCaracteristicasPrincipales() {
        return caracteristicaRepository.findByIdPadreIsNull();
    }

    public List<Caracteristica> obtenerHijos(Integer idPadre) {
        return caracteristicaRepository.findByIdPadre_Id(idPadre);
    }

    public Optional<Caracteristica> obtenerPorId(Integer id) {
        return caracteristicaRepository.findById(id);
    }


    public Caracteristica crearCaracteristica(String nombre, Integer idPadre) {
        Caracteristica caracteristica = new Caracteristica();
        caracteristica.setNombre(nombre);

        if (idPadre != null) {
            caracteristicaRepository.findById(idPadre).ifPresent(caracteristica::setIdPadre);
        }

        return caracteristicaRepository.save(caracteristica);
    }

    public Caracteristica actualizarCaracteristica(Caracteristica caracteristica) {
        return caracteristicaRepository.save(caracteristica);
    }

    public void eliminarCaracteristica(Integer id) {
        caracteristicaRepository.deleteById(id);
    }

    public List<Caracteristica> obtenerTodas() {
        return caracteristicaRepository.findAll();
    }

    public List<Caracteristica> buscarPorNombre(String nombre) {
        return obtenerTodas().stream()
                .filter(c -> c.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Set<Caracteristica> obtenerSubcaracteristicas(Integer idPadre) {
        return caracteristicaRepository.findById(idPadre)
                .map(Caracteristica::getCaracteristicas)
                .orElse(Set.of());
    }

    public Optional<Caracteristica> obtenerPadre(Integer idCaracteristica) {
        return caracteristicaRepository.findById(idCaracteristica)
                .map(Caracteristica::getIdPadre);
    }

    public boolean esCaracteristicaPrincipal(Integer id) {
        return caracteristicaRepository.findById(id)
                .map(c -> c.getIdPadre() == null)
                .orElse(false);
    }

    public int contar() {
        return (int) caracteristicaRepository.count();
    }
}
