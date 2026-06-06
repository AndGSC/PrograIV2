package com.example.proyecto.controller.api;

import com.example.proyecto.logica.Puesto;
import com.example.proyecto.logica.PuestoCaracteristica;
import com.example.proyecto.modelo.ModeloEmpresa;
import com.example.proyecto.modelo.ModeloOferente;
import com.example.proyecto.service.PuestoService;
import com.example.proyecto.service.RegistroService;
import com.example.proyecto.service.TipoCambioService;
import com.example.proyecto.data.PuestoCaracteristicaRepository;
import com.example.proyecto.util.PuestoDescripcionUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    private final RegistroService registroService;
    private final PuestoService puestoService;
    private final PuestoCaracteristicaRepository puestoCaracteristicaRepository;
    private final TipoCambioService tipoCambioService;

    public PublicApiController(
            RegistroService registroService,
            PuestoService puestoService,
            PuestoCaracteristicaRepository puestoCaracteristicaRepository,
            TipoCambioService tipoCambioService
    ) {
        this.registroService = registroService;
        this.puestoService = puestoService;
        this.puestoCaracteristicaRepository = puestoCaracteristicaRepository;
        this.tipoCambioService = tipoCambioService;
    }

    @PostMapping("/empresas/registro")
    public ResponseEntity<?> registrarEmpresa(@RequestBody RegistroEmpresaRequest request) {
        try {
            ModeloEmpresa modelo = new ModeloEmpresa();
            modelo.setNombre(request.nombre());
            modelo.setLocalizacion(request.localizacion());
            modelo.setEmail(request.correo());
            modelo.setTelefono(request.telefono());
            modelo.setDescripcion(request.descripcion());
            modelo.setClave(request.clave());
            registroService.registrarEmpresa(modelo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/oferentes/registro")
    public ResponseEntity<?> registrarOferente(@RequestBody RegistroOferenteRequest request) {
        try {
            ModeloOferente modelo = new ModeloOferente(
                    request.identificacion(),
                    request.nombre(),
                    request.primerApellido(),
                    request.nacionalidad(),
                    request.telefono(),
                    request.correo(),
                    request.residencia()
            );
            modelo.setClave(request.clave());
            registroService.registrarOferente(modelo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/puestos")
    public ResponseEntity<List<PuestoPublicoResponse>> obtenerPuestosPublicos() {
        List<PuestoPublicoResponse> puestos = puestoService.obtenerPuestosPublicosActivos().stream()
                .map(this::mapearPuestoPublico)
                .toList();
        return ResponseEntity.ok(puestos);
    }

    @GetMapping("/puestos/buscar")
    public ResponseEntity<List<PuestoPublicoResponse>> buscarPuestos(
            @RequestParam(required = false) String textoBusqueda,
            @RequestParam(required = false) String nivel
    ) {
        List<Puesto> puestos = puestoService.buscarPorDescripcion(textoBusqueda);
        List<PuestoPublicoResponse> respuesta = puestos.stream()
                .map(this::mapearPuestoPublico)
                .toList();
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/puestos/{id}")
    public ResponseEntity<PuestoPublicoResponse> obtenerDetallePuesto(@PathVariable Integer id) {
        return puestoService.obtenerPorId(id)
                .filter(p -> Boolean.TRUE.equals(p.getActivo()))
                .map(this::mapearPuestoPublico)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private PuestoPublicoResponse mapearPuestoPublico(Puesto puesto) {
        String empresa = puesto.getIdEmpresa() != null ? puesto.getIdEmpresa().getNombre() : null;
        String salarioDolares = puesto.getSalarioUsd() != null ? puesto.getSalarioUsd().toPlainString() : null;
        
        // Convertir USD a CRC usando el tipo de cambio actual
        String salarioColones = null;
        if (salarioDolares != null && !salarioDolares.isEmpty()) {
            try {
                BigDecimal salarioUsd = new BigDecimal(salarioDolares);
                BigDecimal salarioCrc = tipoCambioService.convertirSalarioDolaresAColones(salarioUsd);
                salarioColones = salarioCrc.toPlainString();
            } catch (Exception e) {
                // Si falla la conversión, usar el salario en dólares por defecto
                salarioColones = salarioDolares;
            }
        }
        
        String tipo = puesto.getTipoPublicacion();

        String titulo = PuestoDescripcionUtils.extraerTitulo(puesto.getDescripcionGeneral());
        String descripcion = PuestoDescripcionUtils.extraerDescripcion(puesto.getDescripcionGeneral());

        List<String> caracteristicas = puestoCaracteristicaRepository.findByIdPuesto(puesto.getId()).stream()
                .map(PuestoCaracteristica::getCaracteristica)
                .filter(c -> c != null && c.getNombre() != null)
                .map(c -> c.getNombre())
                .collect(Collectors.toList());

        return new PuestoPublicoResponse(
                puesto.getId(),
                empresa,
                titulo,
                salarioDolares,
                salarioColones,
                tipo,
                descripcion,
                caracteristicas
        );
    }

    public record RegistroEmpresaRequest(
            String nombre,
            String localizacion,
            String correo,
            String telefono,
            String descripcion,
            String clave
    ) {
    }

    public record RegistroOferenteRequest(
            String identificacion,
            String nombre,
            String primerApellido,
            String nacionalidad,
            String telefono,
            String correo,
            String residencia,
            String clave
    ) {
    }

    public record PuestoPublicoResponse(
            Integer id,
            String empresa,
            String puesto,
            String salarioDolares,
            String salarioColones,
            String tipo,
            String descripcion,
            List<String> caracteristicas
    ) {
    }

    public record ErrorResponse(String mensaje) {
    }
}

