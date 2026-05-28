package com.example.proyecto.controller;

import com.example.proyecto.data.PuestoCaracteristicaRepository;
import com.example.proyecto.logica.Empresa;
import com.example.proyecto.logica.Puesto;
import com.example.proyecto.logica.PuestoCaracteristica;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.service.CaracteristicaService;
import com.example.proyecto.service.EmpresaService;
import com.example.proyecto.service.PuestoService;
import com.example.proyecto.service.TipoCambioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Controller
public class PartePublicaController {

    private final PuestoService puestoService;
    private final EmpresaService empresaService;
    private final CaracteristicaService caracteristicaService;
    private final PuestoCaracteristicaRepository puestoCaracteristicaRepository;
    private final TipoCambioService tipoCambioService;

    public PartePublicaController(PuestoService puestoService,
                                  EmpresaService empresaService,
                                  CaracteristicaService caracteristicaService,
                                  PuestoCaracteristicaRepository puestoCaracteristicaRepository,
                                  TipoCambioService tipoCambioService) {
        this.puestoService = puestoService;
        this.empresaService = empresaService;
        this.caracteristicaService = caracteristicaService;
        this.puestoCaracteristicaRepository = puestoCaracteristicaRepository;
        this.tipoCambioService = tipoCambioService;
    }

    @GetMapping("/")
    public String index(HttpSession session, Model model) {
        Usuario usuarioSesion = obtenerUsuarioSesion(session);
        boolean oferenteRegistrado = esOferenteRegistrado(usuarioSesion);

        List<Puesto> puestosRecientes = puestoService.obtenerPuestosActivos().stream()
                .filter(this::esPuestoActivo)
                .filter(this::esPuestoPublico)
                .sorted(Comparator.comparing(
                        Puesto::getFechaRegistro,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ).reversed())
                .limit(5)
                .toList();

        List<Empresa> empresasDestacadas = empresaService.obtenerEmpresasAprobadas().stream()
                .limit(4)
                .toList();

        model.addAttribute("puestosRecientes", puestosRecientes);
        model.addAttribute("empresasDestacadas", empresasDestacadas);
        model.addAttribute("oferenteRegistrado", oferenteRegistrado);
        agregarSalariosConvertidosAlModelo(model, puestosRecientes);

        return "index";
    }

    @GetMapping("/puestos")
    public String puestos(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) BigDecimal salarioMin,
            @RequestParam(required = false) BigDecimal salarioMax,
            @RequestParam(required = false) List<Integer> caracteristicas,
            HttpSession session,
            Model model
    ) {
        Usuario usuarioSesion = obtenerUsuarioSesion(session);
        boolean autenticado = usuarioSesion != null;
        boolean oferenteRegistrado = esOferenteRegistrado(usuarioSesion);

        model.addAttribute("autenticado", autenticado);
        model.addAttribute("oferenteRegistrado", oferenteRegistrado);
        model.addAttribute("busqueda", busqueda);
        model.addAttribute("tipo", tipo);
        model.addAttribute("salarioMin", salarioMin);
        model.addAttribute("salarioMax", salarioMax);
        model.addAttribute("caracteristicasSeleccionadas", caracteristicas != null ? caracteristicas : List.of());
        model.addAttribute("categorias", caracteristicaService.obtenerCaracteristicasPrincipales());

        if ("PRIVADA".equalsIgnoreCase(tipo) && !oferenteRegistrado) {
            model.addAttribute("errorAcceso", "Debes iniciar sesión como oferente para ver puestos privados.");
            model.addAttribute("puestos", List.of());
            return "parte-publica/puestos";
        }

        List<Puesto> resultado = puestoService.obtenerPuestosActivos().stream()
                .filter(this::esPuestoActivo)
                .filter(puesto -> puedeVerPuesto(puesto, oferenteRegistrado))
                .filter(puesto -> coincideTipo(puesto, tipo))
                .filter(puesto -> coincideBusqueda(puesto, busqueda))
                .filter(puesto -> coincideSalarioMinimo(puesto, salarioMin))
                .filter(puesto -> coincideSalarioMaximo(puesto, salarioMax))
                .filter(puesto -> coincideCaracteristicas(puesto, caracteristicas))
                .sorted(Comparator.comparing(
                        Puesto::getFechaRegistro,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ).reversed())
                .toList();

        model.addAttribute("puestos", resultado);
        agregarSalariosConvertidosAlModelo(model, resultado);

        return "parte-publica/puestos";
    }

    @GetMapping("/puesto/{id}")
    public String detallePuesto(@PathVariable Integer id, HttpSession session, Model model) {
        Optional<Puesto> puestoOpt = puestoService.obtenerPorId(id);

        if (puestoOpt.isEmpty()) {
            model.addAttribute("error", "Puesto no encontrado");
            return "detalle-puesto";
        }

        Puesto puesto = puestoOpt.get();
        Usuario usuarioSesion = obtenerUsuarioSesion(session);
        boolean oferenteRegistrado = esOferenteRegistrado(usuarioSesion);

        if (!esPuestoActivo(puesto)) {
            model.addAttribute("error", "El puesto no está disponible.");
            return "detalle-puesto";
        }

        if (!puedeVerPuesto(puesto, oferenteRegistrado)) {
            model.addAttribute("errorAcceso", "Debes iniciar sesión como oferente para ver este puesto privado.");
            return "detalle-puesto";
        }

        model.addAttribute("puesto", puesto);
        model.addAttribute("empresa", puesto.getIdEmpresa());
        model.addAttribute("autenticado", usuarioSesion != null);
        model.addAttribute("oferenteRegistrado", oferenteRegistrado);
        agregarSalarioConvertidoDetalleAlModelo(model, puesto);

        return "detalle-puesto";
    }

    private void agregarSalariosConvertidosAlModelo(Model model, List<Puesto> puestos) {
        Map<Integer, BigDecimal> salariosColonesPorId = new HashMap<>();

        for (Puesto puesto : puestos) {
            if (puesto != null && puesto.getId() != null && puesto.getSalarioUsd() != null) {
                BigDecimal salarioColones = tipoCambioService.convertirSalarioDolaresAColones(puesto.getSalarioUsd());
                salariosColonesPorId.put(puesto.getId(), salarioColones);
            }
        }

        model.addAttribute("salariosColonesPorId", salariosColonesPorId);
        model.addAttribute("tasaVentaActual", BigDecimal.valueOf(tipoCambioService.obtenerTasaVentaActual()).setScale(2, java.math.RoundingMode.HALF_UP));
        model.addAttribute("fechaTipoCambioActual", tipoCambioService.obtenerFechaTipoCambioActual());
    }

    private void agregarSalarioConvertidoDetalleAlModelo(Model model, Puesto puesto) {
        if (puesto.getSalarioUsd() != null) {
            BigDecimal salarioColones = tipoCambioService.convertirSalarioDolaresAColones(puesto.getSalarioUsd());
            model.addAttribute("salarioColones", salarioColones);
        }

        model.addAttribute("tasaVentaActual", BigDecimal.valueOf(tipoCambioService.obtenerTasaVentaActual()).setScale(2, java.math.RoundingMode.HALF_UP));
        model.addAttribute("fechaTipoCambioActual", tipoCambioService.obtenerFechaTipoCambioActual());
    }

    private Usuario obtenerUsuarioSesion(HttpSession session) {
        Object usuario = session.getAttribute("usuario");
        return (usuario instanceof Usuario) ? (Usuario) usuario : null;
    }

    private boolean esOferenteRegistrado(Usuario usuario) {
        return usuario != null
                && usuario.getTipoUsuario() != null
                && "OFERENTE".equalsIgnoreCase(usuario.getTipoUsuario());
    }

    private boolean puedeVerPuesto(Puesto puesto, boolean oferenteRegistrado) {
        if (esPuestoPublico(puesto)) {
            return true;
        }
        return esPuestoPrivado(puesto) && oferenteRegistrado;
    }

    private boolean esPuestoActivo(Puesto puesto) {
        return puesto != null && Boolean.TRUE.equals(puesto.getActivo());
    }

    private boolean esPuestoPublico(Puesto puesto) {
        return puesto != null
                && puesto.getTipoPublicacion() != null
                && "PUBLICA".equalsIgnoreCase(puesto.getTipoPublicacion());
    }

    private boolean esPuestoPrivado(Puesto puesto) {
        return puesto != null
                && puesto.getTipoPublicacion() != null
                && "PRIVADA".equalsIgnoreCase(puesto.getTipoPublicacion());
    }

    private boolean coincideTipo(Puesto puesto, String tipo) {
        if (tipo == null || tipo.trim().isEmpty()) {
            return true;
        }

        return puesto.getTipoPublicacion() != null
                && puesto.getTipoPublicacion().equalsIgnoreCase(tipo.trim());
    }

    private boolean coincideBusqueda(Puesto puesto, String busqueda) {
        if (busqueda == null || busqueda.trim().isEmpty()) {
            return true;
        }

        String criterio = busqueda.trim().toLowerCase(Locale.ROOT);

        String descripcion = puesto.getDescripcionGeneral() != null
                ? puesto.getDescripcionGeneral().toLowerCase(Locale.ROOT)
                : "";

        String nombreEmpresa = (puesto.getIdEmpresa() != null && puesto.getIdEmpresa().getNombre() != null)
                ? puesto.getIdEmpresa().getNombre().toLowerCase(Locale.ROOT)
                : "";

        return descripcion.contains(criterio) || nombreEmpresa.contains(criterio);
    }

    private boolean coincideSalarioMinimo(Puesto puesto, BigDecimal salarioMin) {
        if (salarioMin == null) {
            return true;
        }
        return puesto.getSalarioUsd() != null && puesto.getSalarioUsd().compareTo(salarioMin) >= 0;
    }

    private boolean coincideSalarioMaximo(Puesto puesto, BigDecimal salarioMax) {
        if (salarioMax == null) {
            return true;
        }
        return puesto.getSalarioUsd() != null && puesto.getSalarioUsd().compareTo(salarioMax) <= 0;
    }

    private boolean coincideCaracteristicas(Puesto puesto, List<Integer> caracteristicas) {
        if (caracteristicas == null || caracteristicas.isEmpty()) {
            return true;
        }
        Set<Integer> idsPuesto = puestoCaracteristicaRepository.findByIdPuesto(puesto.getId())
                .stream()
                .map(PuestoCaracteristica::getIdCaracteristica)
                .collect(java.util.stream.Collectors.toSet());
        return idsPuesto.containsAll(caracteristicas);
    }
}