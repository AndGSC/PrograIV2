package com.example.proyecto.logica;

import com.example.proyecto.data.OferenteCaracteristicaRepository;
import com.example.proyecto.data.PuestoCaracteristicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.TreeSet;

@Component
public class CalculadoraCoincidencia {

    private final OferenteCaracteristicaRepository oferenteCaracteristicaRepository;
    private final PuestoCaracteristicaRepository puestoCaracteristicaRepository;

    @Autowired
    public CalculadoraCoincidencia(OferenteCaracteristicaRepository oferenteCaracteristicaRepository,
                                   PuestoCaracteristicaRepository puestoCaracteristicaRepository) {
        this.oferenteCaracteristicaRepository = oferenteCaracteristicaRepository;
        this.puestoCaracteristicaRepository = puestoCaracteristicaRepository;
    }

    public double calcularCoincidencia(Oferente oferente, Puesto puesto) {
        Map<Integer, Integer> mapaOferente = obtenerMapaCaracteristicasOferente(oferente);
        Map<Integer, Integer> mapaPuesto = obtenerMapaCaracteristicasPuesto(puesto);

        List<Integer> dimensiones = obtenerDimensionesComunes(mapaOferente, mapaPuesto);
        double[] vectorOferente = construirVector(mapaOferente, dimensiones);
        double[] vectorPuesto = construirVector(mapaPuesto, dimensiones);

        return calcularSimilitudCoseno(vectorOferente, vectorPuesto);
    }

    public double calcularPorcentajeCoincidencia(Oferente oferente, Puesto puesto) {
        return calcularCoincidencia(oferente, puesto) * 100.0;
    }

    public double calcularDistanciaCoseno(Oferente oferente, Puesto puesto) {
        return 1.0 - calcularCoincidencia(oferente, puesto);
    }

    private double[] construirVector(Map<Integer, Integer> mapa, List<Integer> dimensiones) {
        double[] vector = new double[dimensiones.size()];

        for (int i = 0; i < dimensiones.size(); i++) {
            Integer idCaracteristica = dimensiones.get(i);
            Integer nivel = mapa.get(idCaracteristica);
            vector[i] = nivel != null ? nivel.doubleValue() : 0.0;
        }

        return vector;
    }

    private List<Integer> obtenerDimensionesComunes(Map<Integer, Integer> mapaOferente,
                                                    Map<Integer, Integer> mapaPuesto) {
        TreeSet<Integer> ids = new TreeSet<>();
        ids.addAll(mapaOferente.keySet());
        ids.addAll(mapaPuesto.keySet());
        return new ArrayList<>(ids);
    }

    private Map<Integer, Integer> obtenerMapaCaracteristicasOferente(Oferente oferente) {
        Map<Integer, Integer> mapa = new TreeMap<>();

        if (oferente == null || oferente.getId() == null) {
            return mapa;
        }

        List<OferenteCaracteristica> caracteristicas =
                oferenteCaracteristicaRepository.findByIdOferente(oferente.getId());

        for (OferenteCaracteristica oc : caracteristicas) {
            if (oc == null
                    || oc.getIdCaracteristica() == null
                    || oc.getNivel() == null) {
                continue;
            }

            mapa.put(oc.getIdCaracteristica(), oc.getNivel());
        }

        return mapa;
    }

    private Map<Integer, Integer> obtenerMapaCaracteristicasPuesto(Puesto puesto) {
        Map<Integer, Integer> mapa = new TreeMap<>();

        if (puesto == null || puesto.getId() == null) {
            return mapa;
        }

        List<PuestoCaracteristica> caracteristicas =
                puestoCaracteristicaRepository.findByIdPuesto(puesto.getId());

        for (PuestoCaracteristica pc : caracteristicas) {
            if (pc == null
                    || pc.getIdCaracteristica() == null
                    || pc.getNivelRequerido() == null) {
                continue;
            }

            mapa.put(pc.getIdCaracteristica(), pc.getNivelRequerido());
        }

        return mapa;
    }

    private double calcularSimilitudCoseno(double[] vector1, double[] vector2) {
        if (vector1 == null || vector2 == null || vector1.length == 0 || vector2.length == 0) {
            return 0.0;
        }

        if (vector1.length != vector2.length) {
            throw new IllegalArgumentException("Los vectores deben tener la misma dimensión.");
        }

        double numerador = 0.0;
        double sumaCuadradosV1 = 0.0;
        double sumaCuadradosV2 = 0.0;

        for (int j = 0; j < vector1.length; j++) {
            numerador += vector1[j] * vector2[j];
            sumaCuadradosV1 += vector1[j] * vector1[j];
            sumaCuadradosV2 += vector2[j] * vector2[j];
        }

        double denominador = Math.sqrt(sumaCuadradosV1 * sumaCuadradosV2);

        if (denominador == 0.0) {
            return 0.0;
        }

        double similitud = numerador / denominador;

        if (similitud < 0.0) {
            return 0.0;
        }
        if (similitud > 1.0) {
            return 1.0;
        }

        return similitud;
    }
}