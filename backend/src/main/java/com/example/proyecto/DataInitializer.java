package com.example.proyecto;

import com.example.proyecto.service.NacionalidadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final NacionalidadService nacionalidadService;

    public DataInitializer(NacionalidadService nacionalidadService) {
        this.nacionalidadService = nacionalidadService;
    }

    @Override
    public void run(String... args) {
        logger.info("Iniciando carga de datos del sistema...");

        try {
            nacionalidadService.cargarNacionalidades();
            logger.info("Inicialización completada correctamente.");
        } catch (Exception e) {
            logger.error("No fue posible completar la inicialización de datos: {}", e.getMessage(), e);
            throw new IllegalStateException("Falló la inicialización del catálogo de nacionalidades.", e);
        }
    }
}