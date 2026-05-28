package com.example.proyecto.controller;

import com.example.proyecto.logica.LoginForm;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@Controller
public class SessionController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("loginForm", new LoginForm());
        return "login";
    }

    @PostMapping("/login")
    public String login(
            @ModelAttribute LoginForm form,
            HttpSession session,
            Model model
    ) {
        try {
            if (usuarioService.validarCredenciales(form.getCorreo(), form.getClave())) {
                Optional<Usuario> usuario = usuarioService.obtenerPorCorreo(form.getCorreo());
                
                if (usuario.isPresent()) {
                    Usuario u = usuario.get();
                    
                    // Verificar que el usuario esté aprobado
                    if (u.getAprobado() == null || !u.getAprobado()) {
                        model.addAttribute("error", "Usuario pendiente de aprobación");
                        return "login";
                    }
                    
                    session.setAttribute("usuario", u);
                    
                    if (u.getTipoUsuario().equalsIgnoreCase("EMPRESA")) {
                        return "redirect:/empresa/dashboard-empresa";
                    } else if (u.getTipoUsuario().equalsIgnoreCase("OFERENTE")) {
                        return "redirect:/oferente/dashboard-oferente";
                    } else if (u.getTipoUsuario().equalsIgnoreCase("ADMIN")) {
                        return "redirect:/administrador/dashboard-admin";
                    }
                    
                    return "redirect:/index";
                }
            }
            
            model.addAttribute("error", "Credenciales inválidas");
            return "login";
            
        } catch (Exception e) {
            model.addAttribute("error", "Error en el login: " + e.getMessage());
            return "login";
        }
    }

    @GetMapping("/salir")
    public String salir(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}