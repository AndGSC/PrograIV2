package com.example.proyecto.controller;

import com.example.proyecto.logica.Usuario;
import com.example.proyecto.logica.Empresa;
import com.example.proyecto.logica.Oferente;
import com.example.proyecto.logica.Caracteristica;
import com.example.proyecto.service.UsuarioService;
import com.example.proyecto.service.EmpresaService;
import com.example.proyecto.service.OferenteService;
import com.example.proyecto.service.CaracteristicaService;
import com.example.proyecto.service.ReportePuestosPdfService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.StreamSupport;

@Controller
@Profile("legacy")
@RequestMapping("/administrador")
public class AdministradorController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private EmpresaService empresaService;
    
    @Autowired
    private OferenteService oferenteService;
    
    @Autowired
    private CaracteristicaService caracteristicaService;

    @Autowired
    private ReportePuestosPdfService reportePuestosPdfService;

    @GetMapping("/dashboard-admin")
    public String dashboardAdmin(Model model) {
        List<Usuario> usuarios = StreamSupport.stream(usuarioService.obtenerTodos().spliterator(), false).toList();
        List<Empresa> empresasPendientes = empresaService.obtenerTodas().stream()
                .filter(e -> e.getUsuarios().getAprobado() == null || !e.getUsuarios().getAprobado())
                .toList();
        List<Oferente> oferentesPendientes = oferenteService.obtenerTodos().stream()
                .filter(o -> o.getUsuarios().getAprobado() == null || !o.getUsuarios().getAprobado())
                .toList();
        
        model.addAttribute("totalUsuarios", usuarios.size());
        model.addAttribute("empresasPendientes", empresasPendientes.size());
        model.addAttribute("oferentesPendientes", oferentesPendientes.size());
        return "administrador/dashboard-admin";
    }
    
    @GetMapping("/caracteristicas-admin")
    public String caracteristicasAdmin(Model model) {
        List<Caracteristica> caracteristicas = caracteristicaService.obtenerTodas();
        List<Caracteristica> principales = caracteristicaService.obtenerCaracteristicasPrincipales();
        model.addAttribute("caracteristicas", caracteristicas);
        model.addAttribute("principales", principales);
        return "administrador/caracteristicas-admin";
    }
    
    @PostMapping("/crear-caracteristica")
    public String crearCaracteristica(
            @RequestParam String nombre,
            @RequestParam(required = false) Integer idPadre,
            Model model
    ) {
        try {
            caracteristicaService.crearCaracteristica(nombre, idPadre);
            model.addAttribute("message", "Característica creada exitosamente");
        } catch (Exception e) {
            model.addAttribute("error", "Error al crear característica: " + e.getMessage());
        }
        return "redirect:/administrador/caracteristicas-admin";
    }
    
    @GetMapping("/empresas-pendientes-admin")
    public String empresasPendientesAdmin(Model model) {
        List<Empresa> empresasPendientes = empresaService.obtenerTodas().stream()
                .filter(e -> e.getUsuarios().getAprobado() == null || !e.getUsuarios().getAprobado())
                .toList();
        model.addAttribute("empresas", empresasPendientes);
        return "administrador/empresas-pendientes-admin";
    }
    
    @PostMapping("/aprobar-empresa")
    public String aprobarEmpresa(
            @RequestParam Integer id,
            Model model
    ) {
        try {
            empresaService.aprobarEmpresa(id);
            model.addAttribute("message", "Empresa aprobada exitosamente");
        } catch (Exception e) {
            model.addAttribute("error", "Error al aprobar empresa: " + e.getMessage());
        }
        return "redirect:/administrador/empresas-pendientes-admin";
    }
    
    @PostMapping("/rechazar-empresa")
    public String rechazarEmpresa(
            @RequestParam Integer id,
            Model model
    ) {
        try {
            empresaService.eliminarEmpresa(id);
            model.addAttribute("message", "Empresa rechazada y eliminada");
        } catch (Exception e) {
            model.addAttribute("error", "Error al rechazar empresa: " + e.getMessage());
        }
        return "redirect:/administrador/empresas-pendientes-admin";
    }
    
    @GetMapping("/oferentes-pendientes-admin")
    public String oferentesPendientesAdmin(Model model) {
        List<Oferente> oferentesPendientes = oferenteService.obtenerTodos().stream()
                .filter(o -> o.getUsuarios().getAprobado() == null || !o.getUsuarios().getAprobado())
                .toList();
        model.addAttribute("oferentes", oferentesPendientes);
        return "administrador/oferentes-pendientes-admin";
    }
    
    @PostMapping("/aprobar-oferente")
    public String aprobarOferente(
            @RequestParam Integer id,
            Model model
    ) {
        try {
            oferenteService.aprobarOferente(id);
            model.addAttribute("message", "Oferente aprobado exitosamente");
        } catch (Exception e) {
            model.addAttribute("error", "Error al aprobar oferente: " + e.getMessage());
        }
        return "redirect:/administrador/oferentes-pendientes-admin";
    }
    
    @PostMapping("/rechazar-oferente")
    public String rechazarOferente(
            @RequestParam Integer id,
            Model model
    ) {
        try {
            oferenteService.eliminarOferente(id);
            model.addAttribute("message", "Oferente rechazado y eliminado");
        } catch (Exception e) {
            model.addAttribute("error", "Error al rechazar oferente: " + e.getMessage());
        }
        return "redirect:/administrador/oferentes-pendientes-admin";
    }
    
    @GetMapping("/reportes-admin")
    public String reportesAdmin(Model model) {
        List<Usuario> usuarios = StreamSupport.stream(usuarioService.obtenerTodos().spliterator(), false).toList();
        List<Empresa> empresas = empresaService.obtenerTodas();
        List<Oferente> oferentes = oferenteService.obtenerTodos();
        YearMonth periodoActual = YearMonth.now();

        model.addAttribute("totalUsuarios", usuarios.size());
        model.addAttribute("totalEmpresas", empresas.size());
        model.addAttribute("totalOferentes", oferentes.size());
        model.addAttribute("empresasAprobadas", empresaService.obtenerEmpresasAprobadas().size());
        model.addAttribute("oferentesAprobados", oferenteService.obtenerOfertesAprobados().size());
        model.addAttribute("mesActual", periodoActual.getMonthValue());
        model.addAttribute("anioActual", periodoActual.getYear());

        return "administrador/reportes-admin";
    }

    @GetMapping(value = "/reportes-admin/puestos-mensual.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> descargarReportePuestosMensual(
            @RequestParam Integer mes,
            @RequestParam Integer anio,
            HttpSession session
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!"ADMIN".equalsIgnoreCase(usuario.getTipoUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            byte[] pdf = reportePuestosPdfService.generarReporteMensual(anio, mes);
            String nombreArchivo = String.format("reporte-puestos-%04d-%02d.pdf", anio, mes);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(pdf.length);
            headers.setContentDispositionFormData("attachment", nombreArchivo);
            headers.setCacheControl("no-store, no-cache, must-revalidate, max-age=0");

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
