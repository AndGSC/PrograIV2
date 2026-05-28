package com.example.proyecto.service;

import com.example.proyecto.logica.TipoCambio;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Service
public class TipoCambioService {

    private static final Logger logger = LoggerFactory.getLogger(TipoCambioService.class);
    private static final String HACIENDA_API_URL = "https://api.hacienda.go.cr/indicadores/tc/dolar";
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private TipoCambio tipoCambioEnCache;
    private LocalDate fechaUltimaActualizacion;

    public TipoCambioService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Obtiene el tipo de cambio actual del dólar desde Hacienda CR
     */
    public TipoCambio obtenerTipoCambioActual() {
        LocalDate hoy = LocalDate.now();
        
        // Si hay datos en caché y son del mismo día, devolverlos
        if (tipoCambioEnCache != null && hoy.equals(fechaUltimaActualizacion)) {
            logger.info("Retornando tipo de cambio desde caché");
            return tipoCambioEnCache;
        }

        try {
            TipoCambio tipoCambio = obtenerTipoCambioDelAPI();
            if (tipoCambio != null) {
                this.tipoCambioEnCache = tipoCambio;
                this.fechaUltimaActualizacion = hoy;
                logger.info("Tipo de cambio actualizado del API: {}", tipoCambio);
                return tipoCambio;
            }
        } catch (Exception e) {
            logger.warn("Error al obtener tipo de cambio del API: {}", e.getMessage());
            if (tipoCambioEnCache != null) {
                logger.info("Retornando tipo de cambio desde caché debido a error en API");
                return tipoCambioEnCache;
            }
        }

        // Si no hay datos disponibles, retornar tipo de cambio por defecto
        logger.warn("No hay tipo de cambio disponible, usando valor por defecto");
        return obtenerTipoCambioDefault();
    }

    /**
     * Obtiene el tipo de cambio de una fecha específica
     */
    public TipoCambio obtenerTipoCambioPorFecha(String fecha) {
        try {
            logger.info("Obteniendo tipo de cambio para fecha: {}", fecha);
            // La API de Hacienda solo da el tipo de cambio actual
            // Para obtener histórico, usamos el actual
            return obtenerTipoCambioActual();
        } catch (Exception e) {
            logger.error("Error al obtener tipo de cambio para fecha {}: {}", fecha, e.getMessage());
            return obtenerTipoCambioDefault();
        }
    }

    /**
     * Llama directamente al API de Hacienda para obtener el tipo de cambio actual
     */
    private TipoCambio obtenerTipoCambioDelAPI() {
        try {
            logger.info("Llamando API de Hacienda: {}", HACIENDA_API_URL);
            
            String response = restTemplate.getForObject(HACIENDA_API_URL, String.class);
            logger.debug("Respuesta del API: {}", response);
            
            return parsearRespuestaAPI(response);
        } catch (Exception e) {
            logger.error("Error al llamar API de Hacienda: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Parsea la respuesta del API de Hacienda
     */
    private TipoCambio parsearRespuestaAPI(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            
            logger.debug("JSON parseado: {}", root);
            
            double compra = 0;
            double venta = 0;
            String fecha = LocalDate.now().toString();

            // Parsear estructura del API de Hacienda
            if (root.has("compra")) {
                String compraStr = root.get("compra").asText();
                compra = Double.parseDouble(compraStr.replace(",", "."));
            }

            if (root.has("venta")) {
                String ventaStr = root.get("venta").asText();
                venta = Double.parseDouble(ventaStr.replace(",", "."));
            }

            if (root.has("fecha")) {
                fecha = root.get("fecha").asText();
            }

            logger.info("Tipo de cambio parseado - Compra: {}, Venta: {}", compra, venta);

            if (venta > 0 && compra > 0) {
                return new TipoCambio(venta, compra, "CRC", fecha);
            }

            logger.warn("No se pudo extraer el tipo de cambio del API");
            return null;
        } catch (Exception e) {
            logger.error("Error al parsear respuesta del API: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Retorna un tipo de cambio por defecto (aproximado)
     */
    private TipoCambio obtenerTipoCambioDefault() {
        logger.warn("Usando tipo de cambio por defecto");
        return new TipoCambio(550.00, 550.00, "CRC", "default");
    }

    /**
     * Convierte un salario en dólares a colones
     */
    public double convertirSalarioDolaresAColones(double salarioDolares) {
        TipoCambio tipoCambio = obtenerTipoCambioActual();
        double resultado = tipoCambio.convertirDolaresAColones(salarioDolares);
        logger.debug("Conversión: $ {} USD = ₡ {} CRC", salarioDolares, resultado);
        return resultado;
    }

    /**
     * Convierte un salario en USD (BigDecimal) a CRC con 2 decimales.
     */
    public BigDecimal convertirSalarioDolaresAColones(BigDecimal salarioDolares) {
        if (salarioDolares == null) {
            return null;
        }

        double montoColones = convertirSalarioDolaresAColones(salarioDolares.doubleValue());
        return BigDecimal.valueOf(montoColones).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Obtiene la fecha asociada al tipo de cambio vigente.
     */
    public String obtenerFechaTipoCambioActual() {
        return obtenerTipoCambioActual().getFechaOperacion();
    }

    /**
     * Convierte un salario en colones a dólares
     */
    public double convertirSalarioColonesADolares(double salarioColones) {
        TipoCambio tipoCambio = obtenerTipoCambioActual();
        double resultado = tipoCambio.convertirColonesToDolares(salarioColones);
        logger.debug("Conversión: ₡ {} CRC = $ {} USD", salarioColones, resultado);
        return resultado;
    }

    /**
     * Obtiene el tipo de cambio de venta actual
     */
    public double obtenerTasaVentaActual() {
        TipoCambio tipoCambio = obtenerTipoCambioActual();
        return tipoCambio.getVenta();
    }

    /**
     * Obtiene el tipo de cambio de compra actual
     */
    public double obtenerTasaCompraActual() {
        TipoCambio tipoCambio = obtenerTipoCambioActual();
        return tipoCambio.getCompra();
    }
}
