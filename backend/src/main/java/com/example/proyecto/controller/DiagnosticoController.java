package com.example.proyecto.controller;

import com.example.proyecto.logica.Nacionalidad;
import com.example.proyecto.service.NacionalidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/legacy/diagnostico")
@CrossOrigin(origins = "*")
public class DiagnosticoController {

    @Autowired
    private NacionalidadService nacionalidadService;

    @GetMapping("/nacionalidades")
    public Map<String, Object> diagnostico() {
        try {
            List<Nacionalidad> activas = nacionalidadService.obtenerNacionalidadesActivas();
            List<Nacionalidad> todas = nacionalidadService.obtenerTodasNacionalidades();
            long total = nacionalidadService.obtenerTotal();

            return Map.of(
                    "total_en_bd", total,
                    "activas", activas.size(),
                    "todas", todas.size(),
                    "lista_activas", activas,
                    "lista_todas", todas
            );
        } catch (Exception e) {
            return Map.of(
                    "error", e.getMessage(),
                    "tipo", e.getClass().getSimpleName()
            );
        }
    }

    @PostMapping("/forzar-carga-inmediata")
    public Map<String, Object> forzarCargaInmediata() {
        try {
            long antes = nacionalidadService.obtenerTotal();
            nacionalidadService.forzarCargaInmediata();
            long despues = nacionalidadService.obtenerTotal();

            List<Nacionalidad> activas = nacionalidadService.obtenerNacionalidadesActivas();
            
            return Map.of(
                    "antes", antes,
                    "despues", despues,
                    "activas", activas.size(),
                    "mensaje", "Carga forzada completada",
                    "status", "OK"
            );
        } catch (Exception e) {
            return Map.of(
                    "error", e.getMessage(),
                    "tipo", e.getClass().getSimpleName(),
                    "status", "ERROR"
            );
        }
    }
}



