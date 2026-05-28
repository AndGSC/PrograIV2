package com.example.proyecto.controller;

import com.example.proyecto.logica.Nacionalidad;
import com.example.proyecto.service.NacionalidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nacionalidades")
@CrossOrigin(origins = "*")
public class NacionalidadController {

    @Autowired
    private NacionalidadService nacionalidadService;


    @GetMapping("/activas")
    public ResponseEntity<List<Nacionalidad>> obtenerNacionalidadesActivas() {
        try {
            List<Nacionalidad> nacionalidades = nacionalidadService.obtenerNacionalidadesActivas();
            return ResponseEntity.ok(nacionalidades);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Nacionalidad>> obtenerTodasNacionalidades() {
        try {
            List<Nacionalidad> nacionalidades = nacionalidadService.obtenerTodasNacionalidades();
            return ResponseEntity.ok(nacionalidades);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/por-nombre/{nombre}")
    public ResponseEntity<Nacionalidad> obtenerPorNombre(@PathVariable String nombre) {
        try {
            return nacionalidadService.obtenerPorNombre(nombre)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/por-codigo/{codigo}")
    public ResponseEntity<Nacionalidad> obtenerPorCodigo(@PathVariable String codigo) {
        try {
            return nacionalidadService.obtenerPorCodigo(codigo)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }


    @GetMapping("/existe/{nombre}")
    public ResponseEntity<Map<String, Boolean>> existeNacionalidad(@PathVariable String nombre) {
        try {
            boolean existe = nacionalidadService.existeNacionalidad(nombre);
            return ResponseEntity.ok(Map.of("existe", existe));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }


    @GetMapping("/total")
    public ResponseEntity<Map<String, Long>> obtenerTotal() {
        try {
            long total = nacionalidadService.obtenerTotal();
            return ResponseEntity.ok(Map.of("total", total));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }


    @PostMapping("/cargar-desde-excel")
    public ResponseEntity<Map<String, String>> cargarDesdeExcel() {
        try {
            nacionalidadService.cargarNacionalidades();
            long total = nacionalidadService.obtenerTotal();
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Nacionalidades cargadas exitosamente",
                    "total", String.valueOf(total)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error al cargar nacionalidades: " + e.getMessage()
            ));
        }
    }
}
