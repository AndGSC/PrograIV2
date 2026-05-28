package com.example.proyecto.service;

import com.example.proyecto.data.OferenteRepository;
import com.example.proyecto.logica.Oferente;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class CVService {

    private static final Logger logger = LoggerFactory.getLogger(CVService.class);
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final List<String> ALLOWED_EXTENSIONS = Collections.singletonList("pdf");
    private static final String PDF_MIME_TYPE = "application/pdf";
    private static final byte[] PDF_SIGNATURE = "%PDF-".getBytes(StandardCharsets.US_ASCII);

    @Autowired
    private OferenteRepository oferenteRepository;

    @Value("${app.cv.base-url:http://localhost:8080}")
    private String baseUrl;

    public String guardarCV(Integer idOferente, MultipartFile archivo) {
        Oferente oferente = oferenteRepository.findById(idOferente)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado: " + idOferente));

        validarArchivo(archivo);

        try {
            oferente.setCurriculumPdf(archivo.getBytes());
        } catch (IOException e) {
            logger.error("No se pudo leer el archivo PDF para oferente {}", idOferente, e);
            throw new RuntimeException("No se pudo leer el archivo PDF", e);
        }

        oferenteRepository.save(oferente);
        logger.info("CV guardado para oferente: {}", idOferente);
        return generarURLPublicaCV(idOferente);
    }


    public byte[] obtenerCV(Integer idOferente) {
        Oferente oferente = oferenteRepository.findById(idOferente)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado: " + idOferente));

        byte[] cv = oferente.getCurriculumPdf();
        if (cv == null || cv.length == 0) {
            throw new IllegalArgumentException("El oferente no tiene CV registrado");
        }

        logger.info("CV obtenido para oferente: {}", idOferente);
        return cv;
    }

    public boolean tieneCV(Integer idOferente) {
        try {
            Optional<Oferente> oferente = oferenteRepository.findById(idOferente);
            if (oferente.isEmpty()) {
                return false;
            }
            byte[] cv = oferente.get().getCurriculumPdf();
            return cv != null && cv.length > 0;
        } catch (Exception e) {
            logger.error("Error al verificar CV para oferente {}: {}", idOferente, e.getMessage());
            return false;
        }
    }


    public void eliminarCV(Integer idOferente) {
        Oferente oferente = oferenteRepository.findById(idOferente)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado: " + idOferente));

        oferente.setCurriculumPdf(null);
        oferenteRepository.save(oferente);
        logger.info("CV eliminado para oferente: {}", idOferente);
    }


    public String obtenerURLVisualizador(Integer idOferente) {
        String urlPublica = generarURLPublicaCV(idOferente);
        return "https://docs.google.com/gview?url=" + urlPublica + "&embedded=true";
    }

    public String obtenerURLIframe(Integer idOferente) {
        return obtenerURLVisualizador(idOferente);
    }

    private String generarURLPublicaCV(Integer idOferente) {
        return baseUrl + "/api/cv/descargar/" + idOferente;
    }

    private void validarArchivo(MultipartFile archivo) {
        if (archivo == null) {
            throw new IllegalArgumentException("Debe seleccionar un archivo PDF");
        }

        if (archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        if (archivo.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("El archivo excede el tamaño máximo permitido (10 MB)");
        }

        String nombreArchivo = archivo.getOriginalFilename();
        if (nombreArchivo == null) {
            throw new IllegalArgumentException("No se puede determinar el nombre del archivo");
        }

        String extension = obtenerExtension(nombreArchivo).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Tipo de archivo no permitido. Solo se admite PDF");
        }

        String mimeType = archivo.getContentType();
        if (!PDF_MIME_TYPE.equalsIgnoreCase(mimeType)) {
            throw new IllegalArgumentException("Tipo MIME inválido. Debe subir un archivo PDF");
        }

        if (!tieneFirmaPDF(archivo)) {
            throw new IllegalArgumentException("El archivo no tiene una firma PDF válida");
        }
    }

    private boolean tieneFirmaPDF(MultipartFile archivo) {
        try (InputStream inputStream = archivo.getInputStream()) {
            byte[] encabezado = new byte[PDF_SIGNATURE.length];
            int bytesLeidos = inputStream.read(encabezado);
            if (bytesLeidos < PDF_SIGNATURE.length) {
                return false;
            }
            return Arrays.equals(encabezado, PDF_SIGNATURE);
        } catch (IOException e) {
            logger.error("No se pudo validar la firma PDF", e);
            throw new RuntimeException("No se pudo validar el archivo PDF", e);
        }
    }

    private String obtenerExtension(String nombreArchivo) {
        int ultimoPunto = nombreArchivo.lastIndexOf(".");
        if (ultimoPunto > 0) {
            return nombreArchivo.substring(ultimoPunto + 1);
        }
        return "";
    }

    public Map<String, Object> obtenerInfoCV(Integer idOferente) {
        try {
            byte[] cv = obtenerCV(idOferente);
            Map<String, Object> info = new HashMap<>();
            info.put("tamanio", cv.length);
            info.put("tamanioKB", cv.length / 1024);
            info.put("existe", true);
            info.put("urlVisualizador", obtenerURLVisualizador(idOferente));
            return info;
        } catch (Exception e) {
            Map<String, Object> info = new HashMap<>();
            info.put("existe", false);
            info.put("error", e.getMessage());
            return info;
        }
    }
}
