package com.example.proyecto.controller;

import com.example.proyecto.modelo.ModeloPuestoConSalario;
import com.example.proyecto.service.PuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/puestos")
@CrossOrigin(origins = "*")
public class PuestoAPIController {

    @Autowired
    private PuestoService puestoService;


    @GetMapping("/activos-con-salario")
    public ResponseEntity<List<ModeloPuestoConSalario>> obtenerPuestosActivosConSalario() {
        try {
            List<ModeloPuestoConSalario> puestos = puestoService.obtenerPuestosActivosConSalario();
            return ResponseEntity.ok(puestos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    @GetMapping("/{idPuesto}/con-salario")
    public ResponseEntity<ModeloPuestoConSalario> obtenerPuestoConSalario(@PathVariable Integer idPuesto) {
        try {
            ModeloPuestoConSalario puesto = puestoService.obtenerPuestoConSalario(idPuesto);
            if (puesto != null) {
                return ResponseEntity.ok(puesto);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/empresa/{idEmpresa}/con-salario")
    public ResponseEntity<List<ModeloPuestoConSalario>> obtenerPuestosPorEmpresaConSalario(@PathVariable Integer idEmpresa) {
        try {
            List<ModeloPuestoConSalario> puestos = puestoService.obtenerPuestosPorEmpresaConSalario(idEmpresa);
            return ResponseEntity.ok(puestos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    @GetMapping("/buscar/con-salario")
    public ResponseEntity<List<ModeloPuestoConSalario>> buscarPorDescripcionConSalario(@RequestParam String palabra) {
        try {
            if (palabra == null || palabra.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            List<ModeloPuestoConSalario> puestos = puestoService.buscarPorDescripcionConSalario(palabra);
            return ResponseEntity.ok(puestos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
