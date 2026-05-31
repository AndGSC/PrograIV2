package com.example.proyecto.controller.api;

import com.example.proyecto.logica.Empresa;
import com.example.proyecto.logica.Oferente;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.security.JwtService;
import com.example.proyecto.security.RoleUtils;
import com.example.proyecto.service.EmpresaService;
import com.example.proyecto.service.OferenteService;
import com.example.proyecto.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final UsuarioService usuarioService;
    private final EmpresaService empresaService;
    private final OferenteService oferenteService;
    private final JwtService jwtService;

    public AuthApiController(
            UsuarioService usuarioService,
            EmpresaService empresaService,
            OferenteService oferenteService,
            JwtService jwtService
    ) {
        this.usuarioService = usuarioService;
        this.empresaService = empresaService;
        this.oferenteService = oferenteService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request == null || request.correo() == null || request.clave() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (!usuarioService.validarCredenciales(request.correo(), request.clave())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Usuario> usuarioOpt = usuarioService.obtenerPorCorreo(request.correo());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = usuarioOpt.get();
        if (usuario.getAprobado() == null || !usuario.getAprobado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String rol = RoleUtils.crearRol(usuario);
        String token = jwtService.generarToken(usuario.getCorreo(), rol);
        return ResponseEntity.ok(new LoginResponse(token, rol, usuario.getCorreo()));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioActualResponse> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Usuario> usuarioOpt = usuarioService.obtenerPorCorreo(authentication.getName());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = usuarioOpt.get();
        String rol = RoleUtils.crearRol(usuario);
        String nombre = null;

        if ("EMPRESA".equalsIgnoreCase(usuario.getTipoUsuario())) {
            Optional<Empresa> empresa = empresaService.obtenerPorId(usuario.getId());
            nombre = empresa.map(Empresa::getNombre).orElse(null);
        } else if ("OFERENTE".equalsIgnoreCase(usuario.getTipoUsuario())) {
            Optional<Oferente> oferente = oferenteService.obtenerPorId(usuario.getId());
            if (oferente.isPresent()) {
                Oferente o = oferente.get();
                nombre = (o.getNombre() + " " + o.getApellido()).trim();
            }
        }

        return ResponseEntity.ok(new UsuarioActualResponse(usuario.getCorreo(), rol, nombre));
    }

    public record LoginRequest(String correo, String clave) {
    }

    public record LoginResponse(String token, String rol, String correo) {
    }

    public record UsuarioActualResponse(String correo, String rol, String nombre) {
    }
}

