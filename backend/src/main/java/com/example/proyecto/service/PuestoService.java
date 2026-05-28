package com.example.proyecto.service;

import com.example.proyecto.data.PuestoRepository;
import com.example.proyecto.logica.Empresa;
import com.example.proyecto.logica.Puesto;
import com.example.proyecto.modelo.ModeloPuestoConSalario;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class PuestoService {

    private final PuestoRepository puestoRepository;
    private final TipoCambioService tipoCambioService;
    private final EmpresaService empresaService;

    public PuestoService(PuestoRepository puestoRepository,
                         TipoCambioService tipoCambioService,
                         EmpresaService empresaService) {
        this.puestoRepository = puestoRepository;
        this.tipoCambioService = tipoCambioService;
        this.empresaService = empresaService;
    }

    public Puesto crearPuesto(Integer empresaId, String descripcion, BigDecimal salario, String tipo) {
        if (empresaId == null) {
            throw new IllegalArgumentException("El ID de la empresa es requerido.");
        }
        if (descripcion == null || descripcion.trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción del puesto es requerida.");
        }
        if (salario == null || salario.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El salario debe ser un valor válido.");
        }

        Optional<Empresa> empresa = empresaService.obtenerPorId(empresaId);
        if (empresa.isEmpty()) {
            throw new IllegalArgumentException("Empresa no encontrada con ID: " + empresaId);
        }

        Puesto puesto = new Puesto();
        puesto.setIdEmpresa(empresa.get());
        puesto.setDescripcionGeneral(descripcion.trim());
        puesto.setSalarioUsd(salario);
        puesto.setTipoPublicacion(normalizarTipoPublicacion(tipo));
        puesto.setActivo(true);
        puesto.setFechaRegistro(Instant.now());

        return puestoRepository.save(puesto);
    }

    /**
     * 5 puestos públicos, activos y más recientes.
     */
    public List<Puesto> obtenerPuestosPublicosRecientes() {
        return obtenerPuestosActivos().stream()
                .filter(this::esPuestoPublico)
                .sorted(comparadorFechaDesc())
                .limit(5)
                .collect(Collectors.toList());
    }

    /**
     * Búsqueda pública base.
     */
    public List<Puesto> buscarPuestos(String criterio, String tipoBusqueda) {
        if (criterio == null || criterio.trim().isEmpty()) {
            return obtenerPuestosPublicosActivos();
        }

        String tipoBusquedaNormalizado = (tipoBusqueda == null) ? "" : tipoBusqueda.trim().toLowerCase(Locale.ROOT);

        switch (tipoBusquedaNormalizado) {
            case "empresa":
                return buscarPorEmpresa(criterio);
            case "descripcion":
            default:
                return buscarPorDescripcion(criterio);
        }
    }

    /**
     * Búsqueda pública por descripción.
     */
    public List<Puesto> buscarPorDescripcion(String descripcion) {
        String criterio = descripcion == null ? "" : descripcion.trim().toLowerCase(Locale.ROOT);

        return obtenerPuestosPublicosActivos().stream()
                .filter(p -> p.getDescripcionGeneral() != null
                        && p.getDescripcionGeneral().toLowerCase(Locale.ROOT).contains(criterio))
                .sorted(comparadorFechaDesc())
                .collect(Collectors.toList());
    }

    /**
     * Búsqueda pública por nombre de empresa.
     */
    private List<Puesto> buscarPorEmpresa(String nombreEmpresa) {
        String criterio = nombreEmpresa == null ? "" : nombreEmpresa.trim().toLowerCase(Locale.ROOT);

        return obtenerPuestosPublicosActivos().stream()
                .filter(p -> p.getIdEmpresa() != null
                        && p.getIdEmpresa().getNombre() != null
                        && p.getIdEmpresa().getNombre().toLowerCase(Locale.ROOT).contains(criterio))
                .sorted(comparadorFechaDesc())
                .collect(Collectors.toList());
    }

    public Puesto guardar(Puesto puesto) {
        if (puesto == null) {
            throw new IllegalArgumentException("El puesto no puede ser nulo.");
        }

        if (puesto.getFechaRegistro() == null) {
            puesto.setFechaRegistro(Instant.now());
        }

        if (puesto.getActivo() == null) {
            puesto.setActivo(true);
        }

        if (puesto.getTipoPublicacion() != null) {
            puesto.setTipoPublicacion(normalizarTipoPublicacion(puesto.getTipoPublicacion()));
        }

        return puestoRepository.save(puesto);
    }

    public List<Puesto> obtenerTodos() {
        return StreamSupport.stream(puestoRepository.findAll().spliterator(), false)
                .sorted(comparadorFechaDesc())
                .collect(Collectors.toList());
    }

    public List<Puesto> obtenerPuestosPorEmpresa(Integer empresaId) {
        return puestoRepository.findByIdEmpresaId(empresaId).stream()
                .sorted(comparadorFechaDesc())
                .collect(Collectors.toList());
    }

    public List<Puesto> obtenerPuestosActivos() {
        return puestoRepository.findByActivoTrue().stream()
                .sorted(comparadorFechaDesc())
                .collect(Collectors.toList());
    }

    public List<Puesto> obtenerPuestosPublicosActivos() {
        return obtenerPuestosActivos().stream()
                .filter(this::esPuestoPublico)
                .collect(Collectors.toList());
    }

    public Optional<Puesto> obtenerPorId(Integer id) {
        return puestoRepository.findById(id);
    }

    public List<Puesto> buscarPorTipoPublicacion(String tipo) {
        String tipoNormalizado = normalizarTipoPublicacion(tipo);

        return obtenerPuestosActivos().stream()
                .filter(p -> p.getTipoPublicacion() != null
                        && p.getTipoPublicacion().equalsIgnoreCase(tipoNormalizado))
                .sorted(comparadorFechaDesc())
                .collect(Collectors.toList());
    }

    public List<Puesto> buscarPorSalarioRango(BigDecimal salarioMin, BigDecimal salarioMax) {
        return obtenerPuestosActivos().stream()
                .filter(p -> p.getSalarioUsd() != null)
                .filter(p -> salarioMin == null || p.getSalarioUsd().compareTo(salarioMin) >= 0)
                .filter(p -> salarioMax == null || p.getSalarioUsd().compareTo(salarioMax) <= 0)
                .sorted(comparadorFechaDesc())
                .collect(Collectors.toList());
    }

    public void desactivarPuestoEmpresa(Integer idPuesto, Integer idEmpresa) {
        Puesto puesto = puestoRepository.findByIdAndIdEmpresaId(idPuesto, idEmpresa)
                .orElseThrow(() -> new IllegalArgumentException("No existe el puesto para esta empresa"));

        if (!Boolean.TRUE.equals(puesto.getActivo())) {
            throw new IllegalArgumentException("El puesto ya esta desactivado");
        }

        puesto.setActivo(false);
        puestoRepository.save(puesto);
    }

    public boolean desactivarPuesto(Integer idPuesto) {
        Optional<Puesto> puestoOpt = puestoRepository.findById(idPuesto);

        if (puestoOpt.isEmpty()) {
            return false;
        }

        Puesto puesto = puestoOpt.get();
        puesto.setActivo(false);
        puestoRepository.save(puesto);
        return true;
    }

    public List<ModeloPuestoConSalario> obtenerPuestosActivosConSalario() {
        return obtenerPuestosActivos().stream()
                .map(this::convertirAModeloConSalario)
                .collect(Collectors.toList());
    }

    public List<ModeloPuestoConSalario> obtenerPuestosPublicosActivosConSalario() {
        return obtenerPuestosPublicosActivos().stream()
                .map(this::convertirAModeloConSalario)
                .collect(Collectors.toList());
    }

    public ModeloPuestoConSalario obtenerPuestoConSalario(Integer idPuesto) {
        return obtenerPorId(idPuesto)
                .map(this::convertirAModeloConSalario)
                .orElse(null);
    }

    public List<ModeloPuestoConSalario> obtenerPuestosPorEmpresaConSalario(Integer idEmpresa) {
        return obtenerPuestosPorEmpresa(idEmpresa).stream()
                .map(this::convertirAModeloConSalario)
                .collect(Collectors.toList());
    }

    public List<ModeloPuestoConSalario> buscarPorDescripcionConSalario(String palabra) {
        return buscarPorDescripcion(palabra).stream()
                .map(this::convertirAModeloConSalario)
                .collect(Collectors.toList());
    }

    private ModeloPuestoConSalario convertirAModeloConSalario(Puesto puesto) {
        ModeloPuestoConSalario modelo = new ModeloPuestoConSalario();
        modelo.setIdPuesto(puesto.getId());
        modelo.setDescripcion(puesto.getDescripcionGeneral());
        modelo.setSalarioDolares(puesto.getSalarioUsd());

        if (puesto.getSalarioUsd() != null && tipoCambioService != null) {
            double salarioEnColones = tipoCambioService.convertirSalarioDolaresAColones(
                    puesto.getSalarioUsd().doubleValue()
            );
            modelo.setSalarioColones(BigDecimal.valueOf(salarioEnColones));
            modelo.setTipoCambio(tipoCambioService.obtenerTasaVentaActual());
        }

        if (puesto.getIdEmpresa() != null) {
            modelo.setNombreEmpresa(puesto.getIdEmpresa().getNombre());
            modelo.setLocalizacion(puesto.getIdEmpresa().getLocalizacion());
        }

        modelo.setTipoPublicacion(puesto.getTipoPublicacion());
        modelo.setActivo(Boolean.TRUE.equals(puesto.getActivo()));

        return modelo;
    }

    private String normalizarTipoPublicacion(String tipo) {
        if (tipo == null || tipo.trim().isEmpty()) {
            return "PUBLICA";
        }

        String valor = tipo.trim().toUpperCase(Locale.ROOT);

        if ("PUBLICA".equals(valor) || "PUBLICO".equals(valor)) {
            return "PUBLICA";
        }

        if ("PRIVADA".equals(valor) || "PRIVADO".equals(valor)) {
            return "PRIVADA";
        }

        return valor;
    }

    private boolean esPuestoPublico(Puesto puesto) {
        return puesto != null
                && puesto.getTipoPublicacion() != null
                && "PUBLICA".equalsIgnoreCase(puesto.getTipoPublicacion());
    }

    private Comparator<Puesto> comparadorFechaDesc() {
        return Comparator.comparing(
                Puesto::getFechaRegistro,
                Comparator.nullsLast(Comparator.naturalOrder())
        ).reversed();
    }

}

