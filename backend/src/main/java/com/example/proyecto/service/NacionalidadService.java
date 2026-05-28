package com.example.proyecto.service;

import com.example.proyecto.data.NacionalidadRepository;
import com.example.proyecto.logica.Nacionalidad;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

@Service
public class NacionalidadService {

    private static final Logger logger = LoggerFactory.getLogger(NacionalidadService.class);
    private static final String NACIONALIDADES_FILE = "docs/nacionalidades.xlsx";

    private static final int COL_ISO = 0;
    private static final int COL_NOMBRE = 1;
    private static final int COL_ISO3 = 3;

    private final DataFormatter dataFormatter = new DataFormatter();

    private volatile List<String> nombresNacionalidadesEnMemoria = Collections.emptyList();

    @Autowired
    private NacionalidadRepository nacionalidadRepository;


    public void cargarNacionalidades() {
        try {
            logger.info("Cargando nacionalidades desde Excel: {}", NACIONALIDADES_FILE);

            List<Nacionalidad> nacionalidades = leerExcel();
            refrescarNombresEnMemoria(nacionalidades);

            if (nacionalidades.isEmpty()) {
                throw new IllegalStateException("No se encontraron nacionalidades validas en el archivo Excel.");
            }

            int creadas = 0;
            int actualizadas = 0;
            int omitidas = 0;

            for (Nacionalidad nacionalidadExcel : nacionalidades) {
                try {
                    Optional<Nacionalidad> existente = nacionalidadRepository.findByCodigo(nacionalidadExcel.getCodigo());
                    if (existente.isEmpty()) {
                        existente = nacionalidadRepository.findByNombre(nacionalidadExcel.getNombre());
                    }

                    if (existente.isPresent()) {
                        Nacionalidad actual = existente.get();
                        boolean cambio = false;

                        String codigoNuevo = limpiarTexto(nacionalidadExcel.getCodigo()).toUpperCase(Locale.ROOT);
                        if (esCodigoValido(codigoNuevo) && !Objects.equals(actual.getCodigo(), codigoNuevo)) {
                            Optional<Nacionalidad> conflictoCodigo = nacionalidadRepository.findByCodigo(codigoNuevo);
                            if (conflictoCodigo.isEmpty() || Objects.equals(conflictoCodigo.get().getId(), actual.getId())) {
                                actual.setCodigo(codigoNuevo);
                                cambio = true;
                            } else {
                                logger.warn("Se omite actualizacion de codigo para '{}' por conflicto con codigo '{}'", actual.getNombre(), codigoNuevo);
                            }
                        }

                        if (!Objects.equals(actual.getNombre(), nacionalidadExcel.getNombre())) {
                            Optional<Nacionalidad> conflictoNombre = nacionalidadRepository.findByNombre(nacionalidadExcel.getNombre());
                            if (conflictoNombre.isEmpty() || Objects.equals(conflictoNombre.get().getId(), actual.getId())) {
                                actual.setNombre(nacionalidadExcel.getNombre());
                                cambio = true;
                            } else {
                                logger.warn("Se omite actualizacion de nombre para codigo '{}' por conflicto de nombre '{}'", actual.getCodigo(), nacionalidadExcel.getNombre());
                            }
                        }

                        if (!Boolean.TRUE.equals(actual.getActivo())) {
                            actual.setActivo(true);
                            cambio = true;
                        }

                        if (cambio) {
                            nacionalidadRepository.save(actual);
                            actualizadas++;
                        }
                    } else {
                        nacionalidadExcel.setActivo(true);
                        nacionalidadRepository.save(nacionalidadExcel);
                        creadas++;
                    }
                } catch (DataIntegrityViolationException e) {
                    omitidas++;
                    logger.warn("Se omite nacionalidad '{}' (codigo '{}') por restriccion de datos: {}",
                            nacionalidadExcel.getNombre(),
                            nacionalidadExcel.getCodigo(),
                            e.getMostSpecificCause() != null ? e.getMostSpecificCause().getMessage() : e.getMessage());
                }
            }

            logger.info("Nacionalidades sincronizadas. Leidas: {}, creadas: {}, actualizadas: {}, omitidas: {}",
                    nacionalidades.size(), creadas, actualizadas, omitidas);
        } catch (Exception e) {
            logger.error("Error al cargar nacionalidades desde Excel: {}", e.getMessage(), e);
            throw new IllegalStateException("No se pudieron cargar las nacionalidades desde el Excel.", e);
        }
    }

    public void forzarCargaInmediata() {
        cargarNacionalidades();
    }

    private List<Nacionalidad> leerExcel() throws Exception {
        Map<String, Nacionalidad> nacionalidadesPorCodigo = new LinkedHashMap<>();

        ClassPathResource resource = new ClassPathResource(NACIONALIDADES_FILE);
        if (!resource.exists()) {
            throw new IllegalStateException("No se encontro el archivo: " + NACIONALIDADES_FILE);
        }

        try (InputStream is = resource.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }

                String nombre = obtenerTextoCelda(row.getCell(COL_NOMBRE));
                if (nombre.isBlank()) {
                    logger.debug("Fila {} omitida: nombre vacio", i + 1);
                    continue;
                }

                String iso = obtenerTextoCelda(row.getCell(COL_ISO)).toUpperCase(Locale.ROOT);
                String iso3 = obtenerTextoCelda(row.getCell(COL_ISO3)).toUpperCase(Locale.ROOT);
                String codigo = normalizarCodigo(iso3, iso);

                if (codigo.isBlank()) {
                    logger.warn("Fila {} omitida: codigo ISO/ISO3 invalido para '{}'", i + 1, nombre);
                    continue;
                }

                nacionalidadesPorCodigo.putIfAbsent(codigo, new Nacionalidad(nombre.trim(), codigo));
            }
        }

        List<Nacionalidad> nacionalidades = new ArrayList<>(nacionalidadesPorCodigo.values());
        nacionalidades.sort(Comparator.comparing(Nacionalidad::getNombre, String.CASE_INSENSITIVE_ORDER));
        return nacionalidades;
    }

    private String obtenerTextoCelda(Cell cell) {
        if (cell == null) {
            return "";
        }
        return dataFormatter.formatCellValue(cell).trim();
    }

    private String limpiarTexto(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private String normalizarCodigo(String iso3, String iso) {
        String codigoIso3 = limpiarTexto(iso3).toUpperCase(Locale.ROOT);
        if (esCodigoValido(codigoIso3)) {
            return codigoIso3;
        }

        String codigoIso2 = limpiarTexto(iso).toUpperCase(Locale.ROOT);
        if (esCodigoValido(codigoIso2)) {
            return codigoIso2;
        }

        return "";
    }

    private boolean esCodigoValido(String codigo) {
        return codigo != null && codigo.matches("^[A-Z]{2,3}$");
    }

    private synchronized void refrescarNombresEnMemoria(List<Nacionalidad> nacionalidades) {
        Set<String> nombres = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        for (Nacionalidad nacionalidad : nacionalidades) {
            String nombre = limpiarTexto(nacionalidad.getNombre());
            if (!nombre.isEmpty()) {
                nombres.add(nombre);
            }
        }
        this.nombresNacionalidadesEnMemoria = new ArrayList<>(nombres);
        logger.info("Nombres de nacionalidades en memoria: {}", this.nombresNacionalidadesEnMemoria.size());
    }

    public List<String> obtenerNombresNacionalidadesEnMemoria() {
        if (nombresNacionalidadesEnMemoria.isEmpty()) {
            try {
                List<Nacionalidad> desdeExcel = leerExcel();
                refrescarNombresEnMemoria(desdeExcel);
            } catch (Exception e) {
                logger.error("No se pudieron cargar nombres de nacionalidades desde Excel", e);
            }
        }
        return new ArrayList<>(nombresNacionalidadesEnMemoria);
    }

    public List<Nacionalidad> obtenerNacionalidadesActivas() {
        List<Nacionalidad> activas = nacionalidadRepository.findAllByActivoTrueOrderByNombreAsc();
        if (activas.isEmpty()) {
            logger.warn("No hay nacionalidades activas en BD. Intentando carga automatica desde Excel...");
            cargarNacionalidades();
            activas = nacionalidadRepository.findAllByActivoTrueOrderByNombreAsc();
        }
        return activas;
    }

    public List<Nacionalidad> obtenerTodasNacionalidades() {
        List<Nacionalidad> todas = nacionalidadRepository.findAllByOrderByNombreAsc();
        if (todas.isEmpty()) {
            cargarNacionalidades();
            todas = nacionalidadRepository.findAllByOrderByNombreAsc();
        }
        return todas;
    }

    public Optional<Nacionalidad> obtenerPorNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            return Optional.empty();
        }
        return nacionalidadRepository.findByNombre(nombre.trim());
    }

    public Optional<Nacionalidad> obtenerPorCodigo(String codigo) {
        if (codigo == null || codigo.trim().isEmpty()) {
            return Optional.empty();
        }
        return nacionalidadRepository.findByCodigo(codigo.trim().toUpperCase(Locale.ROOT));
    }

    public boolean existeNacionalidad(String codigoNacionalidad) {
        if (codigoNacionalidad == null || codigoNacionalidad.trim().isEmpty()) {
            return false;
        }

        String valor = codigoNacionalidad.trim();
        Optional<Nacionalidad> nacionalPorCodigo = nacionalidadRepository.findByCodigo(valor.toUpperCase(Locale.ROOT));
        if (nacionalPorCodigo.isPresent() && Boolean.TRUE.equals(nacionalPorCodigo.get().getActivo())) {
            return true;
        }

        Optional<Nacionalidad> nacionalPorNombre = nacionalidadRepository.findByNombre(valor);
        if (nacionalPorNombre.isPresent() && Boolean.TRUE.equals(nacionalPorNombre.get().getActivo())) {
            return true;
        }

        return obtenerNombresNacionalidadesEnMemoria().stream().anyMatch(n -> n.equalsIgnoreCase(valor));
    }

    public Optional<String> resolverNombreNacionalidad(String valor) {
        if (valor == null || valor.trim().isEmpty()) {
            return Optional.empty();
        }

        String limpio = valor.trim();

        Optional<Nacionalidad> nacionalPorCodigo = nacionalidadRepository.findByCodigo(limpio.toUpperCase(Locale.ROOT));
        if (nacionalPorCodigo.isPresent()) {
            return Optional.ofNullable(nacionalPorCodigo.get().getNombre());
        }

        Optional<Nacionalidad> nacionalPorNombre = nacionalidadRepository.findByNombre(limpio);
        if (nacionalPorNombre.isPresent()) {
            return Optional.ofNullable(nacionalPorNombre.get().getNombre());
        }

        return obtenerNombresNacionalidadesEnMemoria().stream()
                .filter(nombre -> nombre.equalsIgnoreCase(limpio))
                .findFirst();
    }

    public Optional<Nacionalidad> obtenerActivaPorCodigo(String codigoNacionalidad) {
        return obtenerPorCodigo(codigoNacionalidad)
                .filter(Nacionalidad::getActivo);
    }

    public Optional<String> obtenerNombrePorCodigo(String codigoNacionalidad) {
        return obtenerActivaPorCodigo(codigoNacionalidad)
                .map(Nacionalidad::getNombre);
    }

    public long obtenerTotal() {
        return nacionalidadRepository.count();
    }
}
