package com.example.proyecto.controller.api;

import com.example.proyecto.data.CaracteristicaRepository;
import com.example.proyecto.data.OferenteCaracteristicaRepository;
import com.example.proyecto.logica.CalculadoraCoincidencia;
import com.example.proyecto.logica.Caracteristica;
import com.example.proyecto.logica.Oferente;
import com.example.proyecto.logica.OferenteCaracteristica;
import com.example.proyecto.logica.Puesto;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.service.CaracteristicaService;
import com.example.proyecto.service.CVService;
import com.example.proyecto.service.OferenteService;
import com.example.proyecto.service.PuestoCaracteristicaService;
import com.example.proyecto.service.PuestoService;
import com.example.proyecto.service.UsuarioService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto.util.PuestoDescripcionUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaApiController {

    private final UsuarioService usuarioService;
    private final PuestoService puestoService;
    private final PuestoCaracteristicaService puestoCaracteristicaService;
    private final CaracteristicaService caracteristicaService;
    private final CaracteristicaRepository caracteristicaRepository;
    private final OferenteService oferenteService;
    private final OferenteCaracteristicaRepository oferenteCaracteristicaRepository;
    private final CalculadoraCoincidencia calculadoraCoincidencia;
    private final CVService cvService;

    public EmpresaApiController(
            UsuarioService usuarioService,
            PuestoService puestoService,
            PuestoCaracteristicaService puestoCaracteristicaService,
            CaracteristicaService caracteristicaService,
            CaracteristicaRepository caracteristicaRepository,
            OferenteService oferenteService,
            OferenteCaracteristicaRepository oferenteCaracteristicaRepository,
            CalculadoraCoincidencia calculadoraCoincidencia,
            CVService cvService
    ) {
        this.usuarioService = usuarioService;
        this.puestoService = puestoService;
        this.puestoCaracteristicaService = puestoCaracteristicaService;
        this.caracteristicaService = caracteristicaService;
        this.caracteristicaRepository = caracteristicaRepository;
        this.oferenteService = oferenteService;
        this.oferenteCaracteristicaRepository = oferenteCaracteristicaRepository;
        this.calculadoraCoincidencia = calculadoraCoincidencia;
        this.cvService = cvService;
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<List<CaracteristicaResponse>> obtenerCaracteristicas() {
        List<CaracteristicaResponse> lista = caracteristicaRepository.findAllConPadre().stream()
                .map(c -> new CaracteristicaResponse(
                        c.getId(),
                        c.getNombre(),
                        c.getIdPadre() != null ? c.getIdPadre().getNombre() : "General"
                ))
                .sorted(Comparator.comparing(CaracteristicaResponse::nombre, String.CASE_INSENSITIVE_ORDER))
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/puestos")
    public ResponseEntity<List<PuestoEmpresaResponse>> obtenerMisPuestos(Authentication authentication) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PuestoEmpresaResponse> puestos = puestoService.obtenerPuestosPorEmpresa(usuario.getId()).stream()
                .map(this::mapearPuestoEmpresa)
                .toList();
        return ResponseEntity.ok(puestos);
    }

    @PostMapping("/puestos")
    public ResponseEntity<PuestoEmpresaResponse> publicarPuesto(
            Authentication authentication,
            @RequestBody PublicarPuestoRequest request
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (request == null || request.salario() == null) {
            return ResponseEntity.badRequest().build();
        }

        String descripcionPersistida = PuestoDescripcionUtils.combinar(request.titulo(), request.descripcion());
        if (descripcionPersistida == null || descripcionPersistida.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        BigDecimal salario = new BigDecimal(request.salario());
        Puesto puesto = puestoService.crearPuesto(
                usuario.getId(),
                descripcionPersistida,
                salario,
                request.tipoPublicacion()
        );

        Map<Integer, Integer> requisitos = construirRequisitos(request.requisitos());
        if (!requisitos.isEmpty()) {
            puestoCaracteristicaService.reemplazarCaracteristicas(puesto.getId(), requisitos);
        }

        return ResponseEntity.ok(mapearPuestoEmpresa(puesto));
    }

    @GetMapping("/puestos/{id}")
    public ResponseEntity<PuestoEmpresaResponse> obtenerDetallePuesto(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Puesto> puestoOpt = puestoService.obtenerPorId(id);
        if (puestoOpt.isEmpty() || !perteneceAEmpresa(puestoOpt.get(), usuario.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(mapearPuestoEmpresa(puestoOpt.get()));
    }

    @PatchMapping("/puestos/{id}/desactivar")
    public ResponseEntity<Void> desactivarPuesto(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        puestoService.desactivarPuestoEmpresa(id, usuario.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/candidatos")
    public ResponseEntity<List<CandidatoResponse>> buscarCandidatos(
            Authentication authentication,
            @RequestParam(required = false) String palabraClave,
            @RequestParam(required = false) String nivel,
            @RequestParam(required = false) Integer puestoId
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Puesto puesto = null;
        if (puestoId != null) {
            Optional<Puesto> puestoOpt = puestoService.obtenerPorId(puestoId);
            if (puestoOpt.isEmpty() || !perteneceAEmpresa(puestoOpt.get(), usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            puesto = puestoOpt.get();
        }

        List<Oferente> oferentes = oferenteService.obtenerOfertesAprobados();
        int nivelMinimo = nivelTextoANumero(nivel);

        List<CandidatoResponse> respuesta = new ArrayList<>();
        for (Oferente oferente : oferentes) {
            if (!coincideFiltroHabilidad(oferente, palabraClave, nivelMinimo)) {
                continue;
            }

            double coincidencia = puesto != null
                    ? calculadoraCoincidencia.calcularPorcentajeCoincidencia(oferente, puesto)
                    : 0.0;

            respuesta.add(mapearCandidato(oferente, coincidencia));
        }

        respuesta.sort(Comparator.comparing(CandidatoResponse::coincidencia).reversed());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/candidatos/{id}")
    public ResponseEntity<CandidatoResponse> obtenerDetalleCandidato(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Oferente> oferenteOpt = oferenteService.obtenerPorId(id);
        if (oferenteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapearCandidato(oferenteOpt.get(), 0.0));
    }

    @GetMapping("/candidatos/{id}/cv")
    public ResponseEntity<byte[]> descargarCvCandidato(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        byte[] cv = cvService.obtenerCV(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentLength(cv.length);
        headers.setContentDispositionFormData("attachment", "cv_" + id + ".pdf");
        headers.setCacheControl("no-store, no-cache, must-revalidate, max-age=0");

        return new ResponseEntity<>(cv, headers, HttpStatus.OK);
    }

    private Usuario obtenerUsuario(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return usuarioService.obtenerPorCorreo(authentication.getName()).orElse(null);
    }

    private boolean perteneceAEmpresa(Puesto puesto, Integer idEmpresa) {
        return puesto != null
                && puesto.getIdEmpresa() != null
                && puesto.getIdEmpresa().getId() != null
                && puesto.getIdEmpresa().getId().equals(idEmpresa);
    }

    private PuestoEmpresaResponse mapearPuestoEmpresa(Puesto puesto) {
        String salario = puesto.getSalarioUsd() != null ? puesto.getSalarioUsd().toPlainString() : null;
        String estado = Boolean.TRUE.equals(puesto.getActivo()) ? "Activo" : "Inactivo";

        String titulo = PuestoDescripcionUtils.extraerTitulo(puesto.getDescripcionGeneral());
        String descripcion = PuestoDescripcionUtils.extraerDescripcion(puesto.getDescripcionGeneral());
        return new PuestoEmpresaResponse(
                puesto.getId(),
                titulo,
                descripcion,
                salario,
                puesto.getTipoPublicacion(),
                estado
        );
    }

    private CandidatoResponse mapearCandidato(Oferente oferente, double coincidencia) {
        List<String> habilidades = oferenteCaracteristicaRepository.findByIdOferente(oferente.getId()).stream()
                .map(this::formatearHabilidad)
                .filter(valor -> valor != null && !valor.isBlank())
                .toList();

        return new CandidatoResponse(
                oferente.getId(),
                oferente.getIdentificacion() != null ? String.valueOf(oferente.getIdentificacion()) : null,
                construirNombre(oferente),
                oferente.getNacionalidad(),
                oferente.getTelefono() != null ? String.valueOf(oferente.getTelefono()) : null,
                oferente.getUsuarios() != null ? oferente.getUsuarios().getCorreo() : null,
                oferente.getResidencia(),
                Math.round(coincidencia),
                cvService.tieneCV(oferente.getId()),
                habilidades
        );
    }

    private String construirNombre(Oferente oferente) {
        String nombre = oferente.getNombre() != null ? oferente.getNombre() : "";
        String apellido = oferente.getApellido() != null ? oferente.getApellido() : "";
        return (nombre + " " + apellido).trim();
    }

    private String formatearHabilidad(OferenteCaracteristica habilidad) {
        if (habilidad == null || habilidad.getCaracteristica() == null) {
            return null;
        }
        String nombre = habilidad.getCaracteristica().getNombre();
        String nivel = nivelNumeroATexto(habilidad.getNivel());
        if (nombre == null || nivel == null) {
            return nombre;
        }
        return nombre + " - " + nivel;
    }

    private boolean coincideFiltroHabilidad(Oferente oferente, String palabraClave, int nivelMinimo) {
        if ((palabraClave == null || palabraClave.isBlank()) && nivelMinimo <= 0) {
            return true;
        }

        String filtro = palabraClave != null ? palabraClave.trim().toLowerCase(Locale.ROOT) : null;
        for (OferenteCaracteristica habilidad : oferenteCaracteristicaRepository.findByIdOferente(oferente.getId())) {
            if (habilidad == null || habilidad.getCaracteristica() == null) {
                continue;
            }

            String nombre = habilidad.getCaracteristica().getNombre();
            if (nombre == null) {
                continue;
            }

            boolean coincideNombre = filtro == null || nombre.toLowerCase(Locale.ROOT).contains(filtro);
            boolean coincideNivel = nivelMinimo <= 0 || (habilidad.getNivel() != null && habilidad.getNivel() >= nivelMinimo);

            if (coincideNombre && coincideNivel) {
                return true;
            }
        }

        return false;
    }

    private Map<Integer, Integer> construirRequisitos(List<RequisitoPuestoRequest> requisitos) {
        Map<Integer, Integer> mapa = new LinkedHashMap<>();
        if (requisitos == null || requisitos.isEmpty()) {
            return mapa;
        }

        List<Caracteristica> catalogo = caracteristicaService.obtenerTodas();
        for (RequisitoPuestoRequest req : requisitos) {
            if (req == null || req.caracteristica() == null) {
                continue;
            }

            Integer idCaracteristica = catalogo.stream()
                    .filter(c -> c.getNombre() != null
                            && c.getNombre().equalsIgnoreCase(req.caracteristica().trim()))
                    .map(Caracteristica::getId)
                    .findFirst()
                    .orElse(null);

            if (idCaracteristica == null) {
                continue;
            }

            int nivel = nivelTextoANumero(req.nivel());
            if (nivel <= 0) {
                nivel = 1;
            }

            mapa.put(idCaracteristica, nivel);
        }

        return mapa;
    }

    private int nivelTextoANumero(String nivel) {
        if (nivel == null || nivel.isBlank()) {
            return 0;
        }

        String valor = nivel.trim().toUpperCase(Locale.ROOT);
        if (valor.matches("\\d+")) {
            return Integer.parseInt(valor);
        }

        return switch (valor) {
            case "BASICO" -> 1;
            case "INTERMEDIO" -> 3;
            case "AVANZADO" -> 5;
            default -> 0;
        };
    }

    private String nivelNumeroATexto(Integer nivel) {
        if (nivel == null) {
            return null;
        }
        if (nivel <= 2) {
            return "Basico";
        }
        if (nivel <= 4) {
            return "Intermedio";
        }
        return "Avanzado";
    }

    public record PuestoEmpresaResponse(
            Integer id,
            String titulo,
            String descripcion,
            String salario,
            String tipoPublicacion,
            String estado
    ) {
    }

    public record PublicarPuestoRequest(
            String titulo,
            String descripcion,
            String salario,
            String tipoPublicacion,
            List<RequisitoPuestoRequest> requisitos
    ) {
    }

    public record RequisitoPuestoRequest(String caracteristica, String nivel) {
    }

    public record CandidatoResponse(
            Integer id,
            String identificacion,
            String nombre,
            String nacionalidad,
            String telefono,
            String correo,
            String residencia,
            long coincidencia,
            boolean cvDisponible,
            List<String> habilidades
    ) {
    }

    public record CaracteristicaResponse(
            Integer id,
            String nombre,
            String categoria
    ) {
    }
}

