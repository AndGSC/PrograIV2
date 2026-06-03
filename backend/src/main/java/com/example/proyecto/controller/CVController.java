package com.example.proyecto.controller;

import com.example.proyecto.service.CVService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/legacy/cv")
@CrossOrigin(origins = "*")
public class CVController {

    private static final Logger logger = LoggerFactory.getLogger(CVController.class);

    @Autowired
    private CVService cvService;

    @PostMapping("/subir/{idOferente}")
    public ResponseEntity<Map<String, Object>> subirCV(
            @PathVariable Integer idOferente,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            if (archivo.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "mensaje", "El archivo está vacío"
                ));
            }

            String urlPublica = cvService.guardarCV(idOferente, archivo);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("mensaje", "CV guardado exitosamente");
            response.put("urlPublica", urlPublica);
            response.put("urlVisualizador", cvService.obtenerURLVisualizador(idOferente));
            response.put("tamanio", archivo.getSize());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.warn("Validación fallida al subir CV: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "mensaje", e.getMessage()
            ));
        } catch (Exception e) {
            logger.error("Error al subir CV: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "mensaje", "Error al guardar el CV: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/descargar/{idOferente}")
    public ResponseEntity<byte[]> descargarCV(@PathVariable Integer idOferente) {
        try {
            byte[] cv = cvService.obtenerCV(idOferente);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(cv.length);
            headers.setContentDispositionFormData("attachment", "cv_" + idOferente + ".pdf");

            logger.info("CV descargado para oferente: {}", idOferente);

            return new ResponseEntity<>(cv, headers, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            logger.warn("CV no encontrado para oferente: {}", idOferente);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error al descargar CV para oferente {}: {}", idOferente, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/visualizador/{idOferente}")
    public ResponseEntity<Map<String, Object>> obtenerURLVisualizador(@PathVariable Integer idOferente) {
        try {
            if (!cvService.tieneCV(idOferente)) {
                return ResponseEntity.notFound().build();
            }

            String urlVisualizador = cvService.obtenerURLVisualizador(idOferente);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("urlVisualizador", urlVisualizador);
            response.put("info", cvService.obtenerInfoCV(idOferente));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error al obtener URL del visualizador: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "mensaje", "Error al obtener URL del visualizador"
            ));
        }
    }

    @GetMapping("/existe/{idOferente}")
    public ResponseEntity<Map<String, Object>> existeCV(@PathVariable Integer idOferente) {
        try {
            boolean existe = cvService.tieneCV(idOferente);

            Map<String, Object> response = new HashMap<>();
            response.put("existe", existe);

            if (existe) {
                response.put("info", cvService.obtenerInfoCV(idOferente));
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error al verificar CV: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error", "Error al verificar CV"
            ));
        }
    }

    @GetMapping("/info/{idOferente}")
    public ResponseEntity<Map<String, Object>> obtenerInfoCV(@PathVariable Integer idOferente) {
        try {
            Map<String, Object> info = cvService.obtenerInfoCV(idOferente);

            if (!(boolean) info.get("existe")) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(info);

        } catch (Exception e) {
            logger.error("Error al obtener información del CV: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error", "Error al obtener información del CV"
            ));
        }
    }


    @DeleteMapping("/eliminar/{idOferente}")
    public ResponseEntity<Map<String, Object>> eliminarCV(@PathVariable Integer idOferente) {
        try {
            cvService.eliminarCV(idOferente);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "mensaje", "CV eliminado exitosamente"
            ));

        } catch (IllegalArgumentException e) {
            logger.warn("Oferente no encontrado: {}", idOferente);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error al eliminar CV: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "mensaje", "Error al eliminar el CV"
            ));
        }
    }

    
    @GetMapping("/ver/{idOferente}")
    public ResponseEntity<String> verCV(@PathVariable Integer idOferente) {
        try {
            if (!cvService.tieneCV(idOferente)) {
                return ResponseEntity.notFound().build();
            }

            String urlVisualizador = cvService.obtenerURLVisualizador(idOferente);

            String html = "<!DOCTYPE html>\n" +
                    "<html lang=\"es\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <title>Visualización de CV</title>\n" +
                    "    <style>\n" +
                    "        body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }\n" +
                    "        .header { margin-bottom: 10px; }\n" +
                    "        .header h1 { margin: 0; font-size: 24px; }\n" +
                    "        .viewer { width: 100%; height: 90vh; border: 1px solid #ccc; }\n" +
                    "        .download-btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 10px; }\n" +
                    "        .download-btn:hover { background: #0056b3; }\n" +
                    "    </style>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "    <div class=\"header\">\n" +
                    "        <h1>Currículo del Oferente #" + idOferente + "</h1>\n" +
                    "        <a href=\"/api/legacy/cv/descargar/" + idOferente + "\" class=\"download-btn\">Descargar CV</a>\n" +
                    "    </div>\n" +
                    "    <iframe class=\"viewer\" src=\"" + urlVisualizador + "\"></iframe>\n" +
                    "</body>\n" +
                    "</html>";

            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(html);

        } catch (Exception e) {
            logger.error("Error al generar vista HTML del CV: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
