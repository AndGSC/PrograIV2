package com.example.proyecto.controller.api;

import com.example.proyecto.data.CaracteristicaRepository;
import com.example.proyecto.logica.Caracteristica;
import com.example.proyecto.logica.Empresa;
import com.example.proyecto.logica.Oferente;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.service.CaracteristicaService;
import com.example.proyecto.service.EmpresaService;
import com.example.proyecto.service.OferenteService;
import com.example.proyecto.service.PuestoService;
import com.example.proyecto.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

    private final EmpresaService empresaService;
    private final OferenteService oferenteService;
    private final UsuarioService usuarioService;
    private final CaracteristicaService caracteristicaService;
    private final CaracteristicaRepository caracteristicaRepository;
    private final PuestoService puestoService;

    public AdminApiController(
            EmpresaService empresaService,
            OferenteService oferenteService,
            UsuarioService usuarioService,
            CaracteristicaService caracteristicaService,
            CaracteristicaRepository caracteristicaRepository,
            PuestoService puestoService
    ) {
        this.empresaService = empresaService;
        this.oferenteService = oferenteService;
        this.usuarioService = usuarioService;
        this.caracteristicaService = caracteristicaService;
        this.caracteristicaRepository = caracteristicaRepository;
        this.puestoService = puestoService;
    }

    @GetMapping("/empresas/pendientes")
    public ResponseEntity<List<EmpresaPendienteResponse>> obtenerEmpresasPendientes() {
        List<EmpresaPendienteResponse> empresas = empresaService.obtenerTodas().stream()
                .filter(e -> e.getUsuarios() != null && !Boolean.TRUE.equals(e.getUsuarios().getAprobado()))
                .map(this::mapearEmpresaPendiente)
                .toList();
        return ResponseEntity.ok(empresas);
    }

    @PostMapping("/empresas/pendientes/{id}/aprobar")
    public ResponseEntity<Void> aprobarEmpresa(@PathVariable Integer id) {
        empresaService.aprobarEmpresa(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/empresas/pendientes/{id}/rechazar")
    public ResponseEntity<Void> rechazarEmpresa(@PathVariable Integer id) {
        empresaService.eliminarEmpresa(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/oferentes/pendientes")
    public ResponseEntity<List<OferentePendienteResponse>> obtenerOferentesPendientes() {
        List<OferentePendienteResponse> oferentes = oferenteService.obtenerTodos().stream()
                .filter(o -> o.getUsuarios() != null && !Boolean.TRUE.equals(o.getUsuarios().getAprobado()))
                .map(this::mapearOferentePendiente)
                .toList();
        return ResponseEntity.ok(oferentes);
    }

    @PostMapping("/oferentes/pendientes/{id}/aprobar")
    public ResponseEntity<Void> aprobarOferente(@PathVariable Integer id) {
        oferenteService.aprobarOferente(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/oferentes/pendientes/{id}/rechazar")
    public ResponseEntity<Void> rechazarOferente(@PathVariable Integer id) {
        oferenteService.eliminarOferente(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<List<CaracteristicaResponse>> obtenerCaracteristicas() {
        List<CaracteristicaResponse> caracteristicas = caracteristicaRepository.findAllConPadre().stream()
                .sorted(Comparator.comparing(Caracteristica::getNombre, String.CASE_INSENSITIVE_ORDER))
                .map(this::mapearCaracteristica)
                .toList();
        return ResponseEntity.ok(caracteristicas);
    }

    @PostMapping("/caracteristicas")
    public ResponseEntity<CaracteristicaResponse> crearCaracteristica(@RequestBody CrearCaracteristicaRequest request) {
        if (request == null || request.nombre() == null || request.nombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Integer idPadre = obtenerIdPadrePorNombre(request.categoria());
        Caracteristica creada = caracteristicaService.crearCaracteristica(request.nombre().trim(), idPadre);
        return ResponseEntity.ok(mapearCaracteristica(creada));
    }

    @PatchMapping("/caracteristicas/{id}/desactivar")
    public ResponseEntity<Void> desactivarCaracteristica(@PathVariable Integer id) {
        caracteristicaService.eliminarCaracteristica(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reportes")
    public ResponseEntity<ReporteAdminResponse> obtenerReportes() {
        long empresasAprobadas = empresaService.obtenerEmpresasAprobadas().size();
        long oferentesAprobados = oferenteService.obtenerOfertesAprobados().size();
        long puestosPublicos = puestoService.obtenerPuestosPublicosActivos().size();

        long empresasPendientes = empresaService.obtenerTodas().stream()
                .filter(e -> e.getUsuarios() != null && !Boolean.TRUE.equals(e.getUsuarios().getAprobado()))
                .count();
        long oferentesPendientes = oferenteService.obtenerTodos().stream()
                .filter(o -> o.getUsuarios() != null && !Boolean.TRUE.equals(o.getUsuarios().getAprobado()))
                .count();

        long caracteristicasActivas = caracteristicaService.contar();
        long caracteristicasInactivas = 0;

        return ResponseEntity.ok(new ReporteAdminResponse(
                empresasAprobadas,
                oferentesAprobados,
                puestosPublicos,
                empresasPendientes,
                oferentesPendientes,
                caracteristicasActivas,
                caracteristicasInactivas
        ));
    }

    private EmpresaPendienteResponse mapearEmpresaPendiente(Empresa empresa) {
        Usuario usuario = empresa.getUsuarios();
        return new EmpresaPendienteResponse(
                empresa.getId(),
                empresa.getNombre(),
                empresa.getLocalizacion(),
                usuario != null ? usuario.getCorreo() : null,
                empresa.getTelefono() != null ? String.valueOf(empresa.getTelefono()) : null,
                empresa.getDescripcion()
        );
    }

    private OferentePendienteResponse mapearOferentePendiente(Oferente oferente) {
        Usuario usuario = oferente.getUsuarios();
        return new OferentePendienteResponse(
                oferente.getId(),
                oferente.getIdentificacion() != null ? String.valueOf(oferente.getIdentificacion()) : null,
                oferente.getNombre(),
                oferente.getApellido(),
                oferente.getNacionalidad(),
                oferente.getTelefono() != null ? String.valueOf(oferente.getTelefono()) : null,
                usuario != null ? usuario.getCorreo() : null,
                oferente.getResidencia()
        );
    }

    private CaracteristicaResponse mapearCaracteristica(Caracteristica caracteristica) {
        String categoria = caracteristica.getIdPadre() != null ? caracteristica.getIdPadre().getNombre() : "General";
        return new CaracteristicaResponse(
                caracteristica.getId(),
                caracteristica.getNombre(),
                categoria,
                "Activa",
                null
        );
    }

    private Integer obtenerIdPadrePorNombre(String categoria) {
        if (categoria == null || categoria.trim().isEmpty()) {
            return null;
        }

        String categoriaNormalizada = categoria.trim().toLowerCase();
        for (Caracteristica caracteristica : caracteristicaService.obtenerTodas()) {
            if (caracteristica.getNombre() != null
                    && caracteristica.getNombre().trim().toLowerCase().equals(categoriaNormalizada)) {
                return caracteristica.getId();
            }
        }

        Caracteristica nueva = caracteristicaService.crearCaracteristica(categoria.trim(), null);
        return nueva.getId();
    }

    public record EmpresaPendienteResponse(
            Integer id,
            String nombre,
            String localizacion,
            String correo,
            String telefono,
            String descripcion
    ) {
    }

    public record OferentePendienteResponse(
            Integer id,
            String identificacion,
            String nombre,
            String primerApellido,
            String nacionalidad,
            String telefono,
            String correo,
            String residencia
    ) {
    }

    public record CaracteristicaResponse(
            Integer id,
            String nombre,
            String categoria,
            String estado,
            String descripcion
    ) {
    }

    public record CrearCaracteristicaRequest(
            String nombre,
            String categoria,
            String descripcion
    ) {
    }

    public record ReporteAdminResponse(
            long empresasAprobadas,
            long oferentesAprobados,
            long puestosPublicos,
            long empresasPendientes,
            long oferentesPendientes,
            long caracteristicasActivas,
            long caracteristicasInactivas
    ) {
    }
}

