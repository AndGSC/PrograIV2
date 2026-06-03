package com.example.proyecto.util;

/**
 * Utilidad para mantener compatibilidad entre:
 * - La BD legacy que solo guarda un campo (descripcion_general)
 * - El frontend que espera { titulo, descripcion }
 *
 * Se persiste como: <titulo> + DELIMITADOR + <descripcion>
 *
 * Para datos antiguos (sin delimitador), titulo y descripcion serán el mismo valor.
 */
public final class PuestoDescripcionUtils {

    private PuestoDescripcionUtils() {
    }

    /**
     * Delimitador poco probable en textos normales.
     */
    public static final String DELIMITADOR = "\n---\n";

    public static String combinar(String titulo, String descripcion) {
        String t = normalizar(titulo);
        String d = normalizar(descripcion);

        // Si no hay título, usamos la descripción como valor principal.
        if (t == null || t.isBlank()) {
            return d;
        }
        if (d == null || d.isBlank()) {
            return t;
        }

        return t + DELIMITADOR + d;
    }

    public static String extraerTitulo(String valorPersistido) {
        if (valorPersistido == null) {
            return null;
        }
        int idx = valorPersistido.indexOf(DELIMITADOR);
        if (idx < 0) {
            return valorPersistido;
        }
        return valorPersistido.substring(0, idx);
    }

    public static String extraerDescripcion(String valorPersistido) {
        if (valorPersistido == null) {
            return null;
        }
        int idx = valorPersistido.indexOf(DELIMITADOR);
        if (idx < 0) {
            return valorPersistido;
        }
        return valorPersistido.substring(idx + DELIMITADOR.length());
    }

    private static String normalizar(String texto) {
        return texto == null ? null : texto.trim();
    }
}

