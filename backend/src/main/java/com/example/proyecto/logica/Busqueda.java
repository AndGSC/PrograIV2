package com.example.proyecto.logica;

import com.example.proyecto.data.OferenteRepository;
import com.example.proyecto.data.PuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class Busqueda {

    private final PuestoRepository puestoRepository;
    private final OferenteRepository oferenteRepository;
    private final CalculadoraCoincidencia calculadoraCoincidencia;

    @Autowired
    public Busqueda(
            PuestoRepository puestoRepository,
            OferenteRepository oferenteRepository,
            CalculadoraCoincidencia calculadoraCoincidencia) {
        this.puestoRepository = puestoRepository;
        this.oferenteRepository = oferenteRepository;
        this.calculadoraCoincidencia = calculadoraCoincidencia;
    }

    public List<Puesto> buscarPuestosParaOferente(Oferente oferente) {
        if (oferente == null || oferente.getId() == null) {
            return new ArrayList<>();
        }

        List<Puesto> puestosActivos = puestoRepository.findByActivoTrue();

        return puestosActivos.stream()
                .map(puesto -> new PuestoConCoincidencia(
                        puesto,
                        calculadoraCoincidencia.calcularCoincidencia(oferente, puesto)))
                .sorted(Comparator.comparingDouble(PuestoConCoincidencia::getCoincidencia).reversed())
                .map(PuestoConCoincidencia::getPuesto)
                .collect(Collectors.toList());
    }

    public List<Oferente> buscarOferentesParaEmpresa(Empresa empresa) {
        if (empresa == null || empresa.getId() == null) {
            return new ArrayList<>();
        }

        List<Puesto> puestosEmpresa = puestoRepository.findByIdEmpresaId(empresa.getId());
        List<Oferente> oferentes = new ArrayList<>();
        oferenteRepository.findAll().forEach(oferentes::add);

        Map<Oferente, Double> coincidencias = new HashMap<>();

        for (Oferente oferente : oferentes) {
            double coincidenciaPromedio = calcularCoincidenciaPromedioPaEmpresa(oferente, puestosEmpresa);
            coincidencias.put(oferente, coincidenciaPromedio);
        }

        return coincidencias.entrySet().stream()
                .sorted((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private double calcularCoincidenciaPromedioPaEmpresa(Oferente oferente, List<Puesto> puestos) {
        if (puestos.isEmpty()) {
            return 0.0;
        }

        double coincidenciaTotal = puestos.stream()
                .mapToDouble(puesto -> calculadoraCoincidencia.calcularCoincidencia(oferente, puesto))
                .sum();

        return coincidenciaTotal / puestos.size();
    }

    private static class PuestoConCoincidencia {
        private final Puesto puesto;
        private final double coincidencia;

        public PuestoConCoincidencia(Puesto puesto, double coincidencia) {
            this.puesto = puesto;
            this.coincidencia = coincidencia;
        }

        public Puesto getPuesto() {
            return puesto;
        }

        public double getCoincidencia() {
            return coincidencia;
        }
    }
}