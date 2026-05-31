package com.example.proyecto.controller;

import com.example.proyecto.logica.Nacionalidad;
import com.example.proyecto.modelo.ModeloEmpresa;
import com.example.proyecto.modelo.ModeloOferente;
import com.example.proyecto.service.NacionalidadService;
import com.example.proyecto.service.RegistroService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@Profile("legacy")
public class UserController {

    private final RegistroService registroService;
    private final NacionalidadService nacionalidadService;

    public UserController(RegistroService registroService, NacionalidadService nacionalidadService) {
        this.registroService = registroService;
        this.nacionalidadService = nacionalidadService;
    }

    @ModelAttribute("nacionalidades")
    public List<Nacionalidad> nacionalidades() {
        return nacionalidadService.obtenerNacionalidadesActivas();
    }


    @GetMapping("/registro-empresa")
    public String formRegistroEmpresa(Model model) {
        if (!model.containsAttribute("empresa")) {
            model.addAttribute("empresa", new ModeloEmpresa());
        }
        return "registro-empresa";
    }


    @PostMapping("/registro-empresa")
    public String registrarEmpresa(
            @ModelAttribute("empresa") ModeloEmpresa empresa,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        try {
            validarEmpresa(empresa);

            registroService.registrarEmpresa(empresa);

            redirectAttributes.addFlashAttribute(
                    "success",
                    "Registro exitoso. Por favor, espere la aprobación del administrador antes de iniciar sesión."
            );
            return "redirect:/login";

        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("empresa", empresa);
            return "registro-empresa";

        } catch (Exception e) {
            model.addAttribute("error", "Error al registrar la empresa: " + e.getMessage());
            model.addAttribute("empresa", empresa);
            return "registro-empresa";
        }
    }


    @GetMapping("/registro-oferentes")
    public String formRegistroOferente(Model model) {
        if (!model.containsAttribute("oferente")) {
            model.addAttribute("oferente", new ModeloOferente());
        }
        cargarNacionalidades(model);
        return "registro-oferentes";
    }


    @PostMapping("/registro-oferentes")
    public String registrarOferente(
            @ModelAttribute("oferente") ModeloOferente oferente,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        try {
            // Validaciones iniciales
            if (oferente.getEmail() == null || oferente.getEmail().trim().isEmpty()) {
                model.addAttribute("error", "El email es requerido");
                model.addAttribute("oferente", oferente);
                return "registro-oferentes";
            }

            if (oferente.getClave() == null || oferente.getClave().trim().isEmpty()) {
                model.addAttribute("error", "La contraseña es requerida");
                model.addAttribute("oferente", oferente);
                return "registro-oferentes";
            }

            if (oferente.getClave().length() < 6) {
                model.addAttribute("error", "La contraseña debe tener al menos 6 caracteres");
                model.addAttribute("oferente", oferente);
                return "registro-oferentes";
            }

            if (oferente.getNombre() == null || oferente.getNombre().trim().isEmpty()) {
                model.addAttribute("error", "El nombre es requerido");
                model.addAttribute("oferente", oferente);
                return "registro-oferentes";
            }

            if (oferente.getApellido() == null || oferente.getApellido().trim().isEmpty()) {
                model.addAttribute("error", "El apellido es requerido");
                model.addAttribute("oferente", oferente);
                return "registro-oferentes";
            }

            if (oferente.getIdentificacion() == null || oferente.getIdentificacion().trim().isEmpty()) {
                model.addAttribute("error", "La identificación es requerida");
                model.addAttribute("oferente", oferente);
                return "registro-oferentes";
            }

            // Validar que la identificación sea un número
            try {
                Integer.parseInt(oferente.getIdentificacion());
            } catch (NumberFormatException e) {
                model.addAttribute("error", "La identificación debe ser un número válido");
                model.addAttribute("oferente", oferente);
                return "registro-oferentes";
            }

            // Validar nacionalidad
            if (oferente.getNacionalidad() == null || oferente.getNacionalidad().trim().isEmpty()) {
                model.addAttribute("error", "La nacionalidad es requerida");
                model.addAttribute("oferente", oferente);
                return "registro-oferentes";
            }

            // Registrar el oferente
            registroService.registrarOferente(oferente);

            redirectAttributes.addFlashAttribute(
                    "success",
                    "Registro exitoso. Por favor, espere la aprobación del administrador antes de iniciar sesión."
            );
            return "redirect:/login";

        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("oferente", oferente);
            cargarNacionalidades(model);
            return "registro-oferentes";

        } catch (Exception e) {
            model.addAttribute("error", "Error al registrar el oferente: " + e.getMessage());
            model.addAttribute("oferente", oferente);
            cargarNacionalidades(model);
            return "registro-oferentes";
        }
    }

    private void cargarNacionalidades(Model model) {
        model.addAttribute("nacionalidades", nacionalidadService.obtenerNacionalidadesActivas());
    }

    private void validarEmpresa(ModeloEmpresa empresa) {
        if (empresa == null) {
            throw new IllegalArgumentException("No se recibieron datos de la empresa");
        }

        if (esVacio(empresa.getEmail())) {
            throw new IllegalArgumentException("El email es requerido");
        }

        if (esVacio(empresa.getClave())) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        if (empresa.getClave().trim().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        if (esVacio(empresa.getNombre())) {
            throw new IllegalArgumentException("El nombre de la empresa es requerido");
        }
    }

    private void validarOferente(ModeloOferente oferente) {
        if (oferente == null) {
            throw new IllegalArgumentException("No se recibieron datos del oferente");
        }

        if (esVacio(oferente.getEmail())) {
            throw new IllegalArgumentException("El email es requerido");
        }

        if (esVacio(oferente.getClave())) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        if (oferente.getClave().trim().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        if (esVacio(oferente.getNombre())) {
            throw new IllegalArgumentException("El nombre es requerido");
        }

        if (esVacio(oferente.getApellido())) {
            throw new IllegalArgumentException("El apellido es requerido");
        }

        if (esVacio(oferente.getIdentificacion())) {
            throw new IllegalArgumentException("La identificación es requerida");
        }

        try {
            Integer.parseInt(oferente.getIdentificacion().trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("La identificación debe ser un número válido");
        }

        if (esVacio(oferente.getNacionalidad())) {
            throw new IllegalArgumentException("La nacionalidad es requerida");
        }
    }

    private boolean esVacio(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}

