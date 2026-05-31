package com.example.proyecto.config;

import com.example.proyecto.logica.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Profile("legacy")
public class AuthSessionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        Usuario usuario = session != null ? (Usuario) session.getAttribute("usuario") : null;

        if (usuario == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return false;
        }

        String path = request.getRequestURI().substring(request.getContextPath().length());
        if (path.startsWith("/administrador/") && !"ADMIN".equalsIgnoreCase(usuario.getTipoUsuario())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        if (path.startsWith("/empresa/") && !"EMPRESA".equalsIgnoreCase(usuario.getTipoUsuario())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        if (path.startsWith("/oferente/") && !"OFERENTE".equalsIgnoreCase(usuario.getTipoUsuario())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        return true;
    }
}


