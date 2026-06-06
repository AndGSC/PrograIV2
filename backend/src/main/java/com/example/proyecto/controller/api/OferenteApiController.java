package com.example.proyecto.controller.api;

import com.example.proyecto.data.CaracteristicaRepository;
import com.example.proyecto.logica.Caracteristica;
import com.example.proyecto.logica.Oferente;
import com.example.proyecto.logica.OferenteCaracteristica;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.service.CaracteristicaService;
import com.example.proyecto.service.CVService;
import com.example.proyecto.service.OferenteService;
import com.example.proyecto.service.UsuarioService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/oferente")
public class OferenteApiController {

    private final UsuarioService usuarioService;
    private final OferenteService oferenteService;
    private final CaracteristicaService caracteristicaService;
    private final CaracteristicaRepository caracteristicaRepository;
    private final CVService cvService;

    private final String baseUrl;

    public OferenteApiController(
            UsuarioService usuarioService,
            OferenteService oferenteService,
            CaracteristicaService caracteristicaService,
            CaracteristicaRepository caracteristicaRepository,
            CVService cvService,
            @Value("${app.cv.base-url:http://localhost:8080}") String baseUrl
    ) {
        this.usuarioService = usuarioService;
        this.oferenteService = oferenteService;
        this.caracteristicaService = caracteristicaService;
        this.caracteristicaRepository = caracteristicaRepository;
        this.cvService = cvService;
        this.baseUrl = baseUrl;
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

    @GetMapping("/perfil")
    public ResponseEntity<PerfilOferenteResponse> obtenerPerfil(Authentication authentication) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Oferente oferente = oferenteService.obtenerPorId(usuario.getId()).orElse(null);
        if (oferente == null) {
            return ResponseEntity.notFound().build();
        }

        String estado = Boolean.TRUE.equals(usuario.getAprobado()) ? "APROBADO" : "PENDIENTE";
        PerfilOferenteResponse response = new PerfilOferenteResponse(
                oferente.getIdentificacion() != null ? String.valueOf(oferente.getIdentificacion()) : null,
                oferente.getNombre(),
                oferente.getApellido(),
                oferente.getNacionalidad(),
                oferente.getTelefono() != null ? String.valueOf(oferente.getTelefono()) : null,
                usuario.getCorreo(),
                oferente.getResidencia(),
                estado,
                cvService.tieneCV(oferente.getId())
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/habilidades")
    public ResponseEntity<List<HabilidadResponse>> obtenerHabilidades(Authentication authentication) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<HabilidadResponse> habilidades = oferenteService.obtenerHabilidades(usuario.getId()).stream()
                .map(this::mapearHabilidad)
                .toList();
        return ResponseEntity.ok(habilidades);
    }

    @PostMapping("/habilidades")
    public ResponseEntity<HabilidadResponse> agregarHabilidad(
            Authentication authentication,
            @RequestBody HabilidadRequest request
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (request == null || request.caracteristica() == null || request.nivel() == null) {
            return ResponseEntity.badRequest().build();
        }

        Integer idCaracteristica = buscarCaracteristicaId(request.caracteristica());
        if (idCaracteristica == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        int nivel = nivelTextoANumero(request.nivel());
        if (nivel <= 0) {
            return ResponseEntity.badRequest().build();
        }

        oferenteService.guardarOActualizarHabilidad(usuario.getId(), idCaracteristica, nivel);
        OferenteCaracteristica guardada = oferenteService.obtenerHabilidades(usuario.getId()).stream()
                .filter(h -> h.getIdCaracteristica() != null && h.getIdCaracteristica().equals(idCaracteristica))
                .findFirst()
                .orElse(null);

        if (guardada == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok(mapearHabilidad(guardada));
    }

    @DeleteMapping("/habilidades/{id}")
    public ResponseEntity<Void> eliminarHabilidad(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        oferenteService.eliminarHabilidad(usuario.getId(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cv")
    public ResponseEntity<CvResponse> obtenerInfoCv(Authentication authentication) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean existe = cvService.tieneCV(usuario.getId());
        String nombreArchivo = existe ? "cv_" + usuario.getId() + ".pdf" : null;
        String url = existe ? construirUrlArchivo() : null;
        return ResponseEntity.ok(new CvResponse(nombreArchivo, url));
    }

    @PostMapping("/cv")
    public ResponseEntity<CvResponse> subirCv(
            Authentication authentication,
            @RequestParam("archivo") MultipartFile archivo
    ) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        cvService.guardarCV(usuario.getId(), archivo);
        return ResponseEntity.ok(new CvResponse("cv_" + usuario.getId() + ".pdf", construirUrlArchivo()));
    }

    @GetMapping("/cv/archivo")
    public ResponseEntity<byte[]> descargarCv(Authentication authentication) {
        Usuario usuario = obtenerUsuario(authentication);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        byte[] cv = cvService.obtenerCV(usuario.getId());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentLength(cv.length);
        headers.setContentDispositionFormData("attachment", "cv_" + usuario.getId() + ".pdf");
        headers.setCacheControl("no-store, no-cache, must-revalidate, max-age=0");
        return new ResponseEntity<>(cv, headers, HttpStatus.OK);
    }

    private Usuario obtenerUsuario(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return usuarioService.obtenerPorCorreo(authentication.getName()).orElse(null);
    }

    private HabilidadResponse mapearHabilidad(OferenteCaracteristica habilidad) {
        String nombre = habilidad.getCaracteristica() != null ? habilidad.getCaracteristica().getNombre() : null;
        String nivel = nivelNumeroATexto(habilidad.getNivel());
        return new HabilidadResponse(habilidad.getIdCaracteristica(), nombre, nivel);
    }

    private Integer buscarCaracteristicaId(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return null;
        }

        String filtro = nombre.trim().toLowerCase(Locale.ROOT);
        for (Caracteristica caracteristica : caracteristicaService.obtenerTodas()) {
            if (caracteristica.getNombre() != null
                    && caracteristica.getNombre().trim().toLowerCase(Locale.ROOT).equals(filtro)) {
                return caracteristica.getId();
            }
        }

        return null;
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

    private String construirUrlArchivo() {
        String base = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        return base + "/api/oferente/cv/archivo";
    }

    public record PerfilOferenteResponse(
            String identificacion,
            String nombre,
            String primerApellido,
            String nacionalidad,
            String telefono,
            String correo,
            String residencia,
            String estado,
            boolean cvDisponible
    ) {
    }

    public record HabilidadRequest(String caracteristica, String nivel) {
    }

    public record HabilidadResponse(Integer id, String caracteristica, String nivel) {
    }

    public record CvResponse(String nombreArchivo, String url) {
    }

    public record CaracteristicaResponse(Integer id, String nombre, String categoria) {
    }
}

