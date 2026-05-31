package com.example.proyecto.security;

import com.example.proyecto.logica.Usuario;

import java.util.Locale;

public final class RoleUtils {

    private RoleUtils() {
    }

    public static String crearRol(Usuario usuario) {
        if (usuario == null || usuario.getTipoUsuario() == null) {
            return null;
        }
        return "rol_" + usuario.getTipoUsuario().trim().toUpperCase(Locale.ROOT);
    }
}

