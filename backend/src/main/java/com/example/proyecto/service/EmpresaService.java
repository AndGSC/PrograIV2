package com.example.proyecto.service;

import com.example.proyecto.data.EmpresaRepository;
import com.example.proyecto.logica.Empresa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;

    public void guardar(Empresa empresa) {
        empresaRepository.save(empresa);
    }

    public List<Empresa> obtenerTodas() {
        return StreamSupport.stream(empresaRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public List<Empresa> obtenerEmpresasAprobadas() {
        return obtenerTodas().stream()
                .filter(e -> e.getUsuarios() != null && Boolean.TRUE.equals(e.getUsuarios().getAprobado()))
                .collect(Collectors.toList());
    }

    public void aprobarEmpresa(Integer id) {
        empresaRepository.findById(id).ifPresent(empresa -> {
            if (empresa.getUsuarios() != null) {
                empresa.getUsuarios().setAprobado(true);
                empresaRepository.save(empresa);
            }
        });
    }

    public void eliminarEmpresa(Integer id) {
        empresaRepository.deleteById(id);
    }

    public Optional<Empresa> obtenerPorId(Integer id) {
        return empresaRepository.findById(id);
    }

    public List<Empresa> buscarPorNombre(String nombre) {

        return obtenerEmpresasAprobadas().stream()
                .filter(e -> e.getNombre() != null && e.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Empresa> buscarPorLocalizacion(String localizacion) {
        return empresaRepository.findByLocalizacionContainingIgnoreCase(localizacion);
    }
}
