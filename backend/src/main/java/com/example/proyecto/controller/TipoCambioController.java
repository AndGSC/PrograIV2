package com.example.proyecto.controller;

import com.example.proyecto.logica.TipoCambio;
import com.example.proyecto.modelo.ModeloSalarioConversion;
import com.example.proyecto.service.TipoCambioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Deprecated
@RestController
@RequestMapping("/api/legacy/tipocambio")
@CrossOrigin(origins = "*")
public class TipoCambioController {

    @Autowired
    private TipoCambioService tipoCambioService;


    @GetMapping("/actual")
    public ResponseEntity<TipoCambio> obtenerTipoCambioActual() {
        try {
            TipoCambio tipoCambio = tipoCambioService.obtenerTipoCambioActual();
            return ResponseEntity.ok(tipoCambio);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/por-fecha/{fecha}")
    public ResponseEntity<TipoCambio> obtenerTipoCambioPorFecha(@PathVariable String fecha) {
        try {
            TipoCambio tipoCambio = tipoCambioService.obtenerTipoCambioPorFecha(fecha);
            return ResponseEntity.ok(tipoCambio);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    @GetMapping("/tasa-venta")
    public ResponseEntity<Map<String, Double>> obtenerTasaVenta() {
        try {
            double tasa = tipoCambioService.obtenerTasaVentaActual();
            Map<String, Double> response = new HashMap<>();
            response.put("tasaVenta", tasa);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    @GetMapping("/tasa-compra")
    public ResponseEntity<Map<String, Double>> obtenerTasaCompra() {
        try {
            double tasa = tipoCambioService.obtenerTasaCompraActual();
            Map<String, Double> response = new HashMap<>();
            response.put("tasaCompra", tasa);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    @GetMapping("/convertir-salario/{salarioDolares}")
    public ResponseEntity<ModeloSalarioConversion> convertirSalario(@PathVariable Double salarioDolares) {
        try {
            if (salarioDolares <= 0) {
                return ResponseEntity.badRequest().body(null);
            }

            TipoCambio tipoCambio = tipoCambioService.obtenerTipoCambioActual();
            BigDecimal dolares = new BigDecimal(salarioDolares).setScale(2, RoundingMode.HALF_UP);
            double colonesDouble = tipoCambio.convertirDolaresAColones(salarioDolares);
            BigDecimal colones = new BigDecimal(colonesDouble).setScale(2, RoundingMode.HALF_UP);

            ModeloSalarioConversion conversion = new ModeloSalarioConversion(
                    dolares,
                    colones,
                    tipoCambio.getVenta(),
                    tipoCambio.getFechaOperacion()
            );

            return ResponseEntity.ok(conversion);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    @PostMapping("/convertir")
    public ResponseEntity<ModeloSalarioConversion> convertirSalarioPost(@RequestBody Map<String, Double> request) {
        try {
            Double salarioDolares = request.get("salarioDolares");
            if (salarioDolares == null || salarioDolares <= 0) {
                return ResponseEntity.badRequest().body(null);
            }

            TipoCambio tipoCambio = tipoCambioService.obtenerTipoCambioActual();
            BigDecimal dolares = new BigDecimal(salarioDolares).setScale(2, RoundingMode.HALF_UP);
            double colonesDouble = tipoCambio.convertirDolaresAColones(salarioDolares);
            BigDecimal colones = new BigDecimal(colonesDouble).setScale(2, RoundingMode.HALF_UP);

            ModeloSalarioConversion conversion = new ModeloSalarioConversion(
                    dolares,
                    colones,
                    tipoCambio.getVenta(),
                    tipoCambio.getFechaOperacion()
            );

            return ResponseEntity.ok(conversion);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    @GetMapping("/convertir-colones/{salarioColones}")
    public ResponseEntity<ModeloSalarioConversion> convertirColones(@PathVariable Double salarioColones) {
        try {
            if (salarioColones <= 0) {
                return ResponseEntity.badRequest().body(null);
            }

            TipoCambio tipoCambio = tipoCambioService.obtenerTipoCambioActual();
            double dolaresDouble = tipoCambio.convertirColonesToDolares(salarioColones);
            BigDecimal dolares = new BigDecimal(dolaresDouble).setScale(2, RoundingMode.HALF_UP);
            BigDecimal colones = new BigDecimal(salarioColones).setScale(2, RoundingMode.HALF_UP);

            ModeloSalarioConversion conversion = new ModeloSalarioConversion(
                    dolares,
                    colones,
                    tipoCambio.getVenta(),
                    tipoCambio.getFechaOperacion()
            );

            return ResponseEntity.ok(conversion);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}

