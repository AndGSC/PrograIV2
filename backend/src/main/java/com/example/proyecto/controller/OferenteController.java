package com.example.proyecto.controller;

import com.example.proyecto.logica.Oferente;
import com.example.proyecto.service.CaracteristicaService;
import com.example.proyecto.service.CVService;
import com.example.proyecto.service.OferenteService;
import com.example.proyecto.logica.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.example.proyecto.logica.Caracteristica;
import com.example.proyecto.logica.OferenteCaracteristica;
import java.util.ArrayList;

@Controller
@RequestMapping("/oferente")
public class OferenteController {
    
    @Autowired
    private OferenteService oferenteService;
    
    @Autowired
    private CaracteristicaService caracteristicaService;
    
    @Autowired
    private CVService cvService;
    
    @GetMapping("/dashboard-oferente")
    public String dashboardOferente(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            Optional<Oferente> oferente = oferenteService.obtenerPorId(usuario.getId());
            if (oferente.isPresent()) {
                model.addAttribute("oferente", oferente.get());
                model.addAttribute("nombre", oferente.get().getNombre() + " " + oferente.get().getApellido());
            }
        }
        return "oferente/dashboard-oferente";
    }
    
    @GetMapping("/mi-cv-oferente")
    public String miCvOferente(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            Optional<Oferente> oferente = oferenteService.obtenerPorId(usuario.getId());
            if (oferente.isPresent()) {
                model.addAttribute("oferente", oferente.get());
                boolean tieneCv = cvService.tieneCV(usuario.getId());
                model.addAttribute("tieneCv", tieneCv);
                model.addAttribute("urlDescargaCv", "/api/cv/descargar/" + usuario.getId());
            }
        }
        return "oferente/mi-cv-oferente";
    }
    
    @PostMapping("/subir-curriculum")
    public String subirCurriculum(
            @RequestParam("curriculum") MultipartFile curriculum,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            redirectAttributes.addFlashAttribute("error", "Debe iniciar sesion para subir su CV");
            return "redirect:/login";
        }

        try {
            cvService.guardarCV(usuario.getId(), curriculum);
            redirectAttributes.addFlashAttribute("success", "Curriculum PDF subido exitosamente");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al subir curriculum: " + e.getMessage());
        }

        return "redirect:/oferente/mi-cv-oferente";
    }
    
    @GetMapping("/mis-habilidades-oferente")
    public String misHabilidadesOferente(
            @RequestParam(value = "actualId", required = false) Integer actualId,
            HttpSession session,
            Model model) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        Optional<Oferente> oferenteOpt = oferenteService.obtenerPorId(usuario.getId());
        if (oferenteOpt.isPresent()) {
            Oferente oferente = oferenteOpt.get();

            List<OferenteCaracteristica> habilidades = oferenteService.obtenerHabilidades(oferente.getId());

            List<Caracteristica> ruta = new ArrayList<>();
            List<Caracteristica> subcategorias;
            Caracteristica nodoActual = null;

            if (actualId != null) {
                nodoActual = caracteristicaService.obtenerPorId(actualId).orElse(null);
                if (nodoActual != null) {
                    subcategorias = caracteristicaService.obtenerHijos(actualId);
                    Caracteristica temp = nodoActual;
                    while (temp != null) {
                        ruta.add(0, temp);
                        temp = temp.getIdPadre();
                    }
                } else {
                    subcategorias = caracteristicaService.obtenerCaracteristicasPrincipales();
                }
            } else {
                subcategorias = caracteristicaService.obtenerCaracteristicasPrincipales();
            }

            List<Integer> idsRegistrados = habilidades.stream()
                    .map(OferenteCaracteristica::getIdCaracteristica)
                    .collect(java.util.stream.Collectors.toList());

            model.addAttribute("oferente", oferente);
            model.addAttribute("habilidades", habilidades);
            model.addAttribute("ruta", ruta);
            model.addAttribute("nodoActual", nodoActual);
            model.addAttribute("subcategorias", subcategorias);
            model.addAttribute("todasCaracteristicas", caracteristicaService.obtenerTodas());
            model.addAttribute("idsRegistrados", idsRegistrados);
        }

        return "oferente/mis-habilidades-oferente";
    }

    @PostMapping("/guardar-habilidad")
    public String guardarHabilidad(
            @RequestParam("idCaracteristica") Integer idCaracteristica,
            @RequestParam("nivel") Integer nivel,
            @RequestParam(value = "actualId", required = false) Integer actualId,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        try {
            oferenteService.guardarOActualizarHabilidad(usuario.getId(), idCaracteristica, nivel);
            redirectAttributes.addFlashAttribute("success", "Habilidad guardada correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al guardar: " + e.getMessage());
        }

        return "redirect:/oferente/mis-habilidades-oferente" + (actualId != null ? "?actualId=" + actualId : "");
    }

    @PostMapping("/eliminar-habilidad")
    public String eliminarHabilidad(
            @RequestParam("idCaracteristica") Integer idCaracteristica,
            @RequestParam(value = "actualId", required = false) Integer actualId,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/login";

        try {
            oferenteService.eliminarHabilidad(usuario.getId(), idCaracteristica);
            redirectAttributes.addFlashAttribute("success", "Habilidad eliminada correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar: " + e.getMessage());
        }

        return "redirect:/oferente/mis-habilidades-oferente" + (actualId != null ? "?actualId=" + actualId : "");
    }

    
    @GetMapping("/puestos-disponibles")
    public String puestosDisponibles() {
        return "redirect:/puestos";
    }
    
    @GetMapping("/actualizar-perfil")
    public String actualizarPerfil() {
        return "redirect:/oferente/dashboard-oferente";
    }

    @PostMapping("/subir-cv")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> subirCVRest(
            @RequestParam("archivo") MultipartFile archivo,
            HttpSession session) {
        try {
            Usuario usuario = (Usuario) session.getAttribute("usuario");
            if (usuario == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "mensaje", "No autenticado"
                ));
            }

            String urlPublica = cvService.guardarCV(usuario.getId(), archivo);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "mensaje", "CV subido exitosamente",
                    "urlPublica", urlPublica,
                    "urlVisualizador", cvService.obtenerURLVisualizador(usuario.getId())
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "mensaje", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "mensaje", "Error al subir CV: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/info-cv")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> obtenerInfoCV(HttpSession session) {
        try {
            Usuario usuario = (Usuario) session.getAttribute("usuario");
            if (usuario == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "mensaje", "No autenticado"
                ));
            }

            Map<String, Object> info = cvService.obtenerInfoCV(usuario.getId());
            return ResponseEntity.ok(info);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Error al obtener información del CV"
            ));
        }
    }
}
