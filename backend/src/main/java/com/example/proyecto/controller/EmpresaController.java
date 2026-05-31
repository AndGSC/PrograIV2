package com.example.proyecto.controller;

import com.example.proyecto.data.OferenteCaracteristicaRepository;
import com.example.proyecto.data.PuestoCaracteristicaRepository;
import com.example.proyecto.logica.CalculadoraCoincidencia;
import com.example.proyecto.logica.Empresa;
import com.example.proyecto.logica.Oferente;
import com.example.proyecto.logica.OferenteCaracteristica;
import com.example.proyecto.logica.Puesto;
import com.example.proyecto.logica.PuestoCaracteristica;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.service.CaracteristicaService;
import com.example.proyecto.service.CVService;
import com.example.proyecto.service.EmpresaService;
import com.example.proyecto.service.OferenteService;
import com.example.proyecto.service.PuestoCaracteristicaService;
import com.example.proyecto.service.PuestoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Controller
@Profile("legacy")
@RequestMapping("/empresa")
public class EmpresaController {

    private final EmpresaService empresaService;
    private final PuestoService puestoService;
    private final OferenteService oferenteService;
    private final CVService cvService;
    private final CalculadoraCoincidencia calculadoraCoincidencia;
    private final OferenteCaracteristicaRepository oferenteCaracteristicaRepository;
    private final PuestoCaracteristicaRepository puestoCaracteristicaRepository;
    private final CaracteristicaService caracteristicaService;
    private final PuestoCaracteristicaService puestoCaracteristicaService;

    public EmpresaController(EmpresaService empresaService,
                             PuestoService puestoService,
                             OferenteService oferenteService,
                             CVService cvService,
                             CalculadoraCoincidencia calculadoraCoincidencia,
                             OferenteCaracteristicaRepository oferenteCaracteristicaRepository,
                             PuestoCaracteristicaRepository puestoCaracteristicaRepository,
                             CaracteristicaService caracteristicaService,
                             PuestoCaracteristicaService puestoCaracteristicaService) {
        this.empresaService = empresaService;
        this.puestoService = puestoService;
        this.oferenteService = oferenteService;
        this.cvService = cvService;
        this.calculadoraCoincidencia = calculadoraCoincidencia;
        this.oferenteCaracteristicaRepository = oferenteCaracteristicaRepository;
        this.puestoCaracteristicaRepository = puestoCaracteristicaRepository;
        this.caracteristicaService = caracteristicaService;
        this.puestoCaracteristicaService = puestoCaracteristicaService;
    }

    @GetMapping("/dashboard-empresa")
    public String dashboardEmpresa(HttpSession session, Model model) {
        Usuario usuario = obtenerUsuarioSesion(session);
        if (usuario == null) {
            return "redirect:/login";
        }

        Optional<Empresa> empresa = empresaService.obtenerPorId(usuario.getId());
        if (empresa.isPresent()) {
            List<Puesto> puestos = puestoService.obtenerPuestosPorEmpresa(usuario.getId());
            model.addAttribute("empresa", empresa.get());
            model.addAttribute("puestos", puestos);
            model.addAttribute("cantidadPuestos", puestos.size());
        }

        return "empresa/dashboard-empresa";
    }

    @GetMapping("/mis-puestos-empresa")
    public String misPuestosEmpresa(HttpSession session, Model model) {
        Usuario usuario = obtenerUsuarioSesion(session);
        if (usuario == null) {
            return "redirect:/login";
        }

        List<Puesto> puestos = puestoService.obtenerPuestosPorEmpresa(usuario.getId());
        model.addAttribute("puestos", puestos);

        return "empresa/mis-puestos-empresa";
    }

    @PostMapping("/crear-puesto")
    public String crearPuesto(@RequestParam String descripcion,
                              @RequestParam BigDecimal salario,
                              @RequestParam String tipo,
                              @RequestParam(required = false) List<Integer> idCaracteristicas,
                              @RequestParam Map<String, String> allParams,
                              HttpSession session,
                              RedirectAttributes redirectAttributes) {
        Usuario usuario = obtenerUsuarioSesion(session);
        if (usuario == null) {
            return "redirect:/login";
        }

        try {
            Puesto puesto = puestoService.crearPuesto(usuario.getId(), descripcion, salario, tipo);

            if (idCaracteristicas != null && !idCaracteristicas.isEmpty()) {
                Map<Integer, Integer> caracteristicasConNivel = new LinkedHashMap<>();
                for (Integer idCaract : idCaracteristicas) {
                    String nivelKey = "nivel_" + idCaract;
                    String nivelStr = allParams.get(nivelKey);
                    int nivel = (nivelStr != null && !nivelStr.isEmpty()) ? Integer.parseInt(nivelStr) : 1;
                    caracteristicasConNivel.put(idCaract, nivel);
                }
                puestoCaracteristicaService.reemplazarCaracteristicas(puesto.getId(), caracteristicasConNivel);
            }

            redirectAttributes.addFlashAttribute("success", "Puesto creado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear puesto: " + e.getMessage());
        }

        return "redirect:/empresa/mis-puestos-empresa";
    }

    @PostMapping("/desactivar-puesto/{idPuesto}")
    public String desactivarPuesto(@PathVariable Integer idPuesto,
                                   HttpSession session,
                                   RedirectAttributes redirectAttributes) {
        Usuario usuario = obtenerUsuarioSesion(session);
        if (usuario == null) {
            redirectAttributes.addFlashAttribute("error", "Debe iniciar sesión para gestionar puestos");
            return "redirect:/login";
        }

        if (!esEmpresa(usuario)) {
            redirectAttributes.addFlashAttribute("error", "No tiene permisos para desactivar puestos");
            return "redirect:/empresa/mis-puestos-empresa";
        }

        try {
            puestoService.desactivarPuestoEmpresa(idPuesto, usuario.getId());
            redirectAttributes.addFlashAttribute("success", "Puesto desactivado exitosamente");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al desactivar el puesto: " + e.getMessage());
        }

        return "redirect:/empresa/mis-puestos-empresa";
    }

    @GetMapping("/buscar-candidatos-empresa")
    public String buscarCandidatosEmpresa(@RequestParam(required = false) Integer idPuesto,
                                          @RequestParam(required = false) String nombre,
                                          @RequestParam(required = false) String nacionalidad,
                                          HttpSession session,
                                          Model model) {
        return "redirect:/empresa/publicar-puesto";
    }

    @GetMapping("/buscar-candidatos")
    public String buscarCandidatos(@RequestParam(required = false) Integer idPuesto,
                                   @RequestParam(required = false) String nombre,
                                   @RequestParam(required = false) String nacionalidad,
                                   HttpSession session,
                                   Model model) {
        return "redirect:/empresa/publicar-puesto";
    }

    @GetMapping("/candidatos/buscar")
    public String buscarCandidatosPorPuesto(@RequestParam(required = false) Integer puestoId,
                                            @RequestParam(required = false) String nombre,
                                            @RequestParam(required = false) String nacionalidad,
                                            HttpSession session,
                                            Model model,
                                            RedirectAttributes redirectAttributes) {
        Usuario usuario = obtenerUsuarioSesion(session);
        if (usuario == null) {
            return "redirect:/login";
        }

        if (!esEmpresa(usuario)) {
            redirectAttributes.addFlashAttribute("error", "No tiene permisos para buscar candidatos");
            return "redirect:/empresa/mis-puestos-empresa";
        }

        if (puestoId == null) {
            redirectAttributes.addFlashAttribute("error", "Debe seleccionar un puesto");
            return "redirect:/empresa/mis-puestos-empresa";
        }

        Optional<Puesto> puestoOpt = puestoService.obtenerPorId(puestoId);
        if (puestoOpt.isEmpty() || !perteneceAEmpresa(puestoOpt.get(), usuario.getId())) {
            redirectAttributes.addFlashAttribute("error", "El puesto indicado no existe o no pertenece a su empresa");
            return "redirect:/empresa/mis-puestos-empresa";
        }

        Puesto puesto = puestoOpt.get();
        List<PuestoCaracteristica> requisitosPuesto = puestoCaracteristicaRepository.findByIdPuesto(puestoId);

        if (requisitosPuesto == null || requisitosPuesto.isEmpty()) {
            model.addAttribute("puestoSeleccionado", puesto);
            model.addAttribute("idPuesto", puestoId);
            model.addAttribute("nombre", nombre);
            model.addAttribute("nacionalidad", nacionalidad);
            model.addAttribute("candidatos", new ArrayList<>());
            model.addAttribute("error", "El puesto seleccionado no tiene características requeridas registradas.");
            return "empresa/buscar-candidatos-empresa";
        }

        List<Oferente> oferentes = oferenteService.obtenerOfertesAprobados();
        List<CandidatoBusquedaVista> candidatos = new ArrayList<>();
        int totalRequisitos = requisitosPuesto.size();

        for (Oferente oferente : oferentes) {
            if (!coincideNombre(oferente, nombre)) {
                continue;
            }

            if (!coincideNacionalidad(oferente, nacionalidad)) {
                continue;
            }

            int requisitosCumplidos = contarRequisitosCumplidos(oferente, requisitosPuesto);
            double porcentajeCoincidencia = calculadoraCoincidencia.calcularPorcentajeCoincidencia(oferente, puesto);

            if (totalRequisitos > 0 && requisitosCumplidos == 0) {
                continue;
            }

            candidatos.add(new CandidatoBusquedaVista(
                    oferente.getId(),
                    construirNombreCompleto(oferente),
                    requisitosCumplidos,
                    totalRequisitos,
                    porcentajeCoincidencia,
                    formatearPorcentaje(porcentajeCoincidencia)
            ));
        }

        candidatos.sort(
                Comparator.comparing(CandidatoBusquedaVista::getPorcentajeCoincidencia).reversed()
                        .thenComparing(CandidatoBusquedaVista::getNombreOferente, String.CASE_INSENSITIVE_ORDER)
        );

        model.addAttribute("puestoSeleccionado", puesto);
        model.addAttribute("idPuesto", puestoId);
        model.addAttribute("nombre", nombre);
        model.addAttribute("nacionalidad", nacionalidad);
        model.addAttribute("candidatos", candidatos);

        return "empresa/buscar-candidatos-empresa";
    }

    @GetMapping("/ver-detalles-candidato-empresa")
    public String verDetallesCandidatoEmpresa(@RequestParam Integer id,
                                              @RequestParam(required = false) Integer idPuesto,
                                              HttpSession session,
                                              Model model) {
        Usuario usuario = obtenerUsuarioSesion(session);
        if (usuario == null) {
            return "redirect:/login";
        }

        Optional<Oferente> oferenteOpt = oferenteService.obtenerPorId(id);
        if (oferenteOpt.isEmpty()) {
            model.addAttribute("error", "Candidato no encontrado");
            return "empresa/ver-detalles-candidato-empresa";
        }

        Oferente oferente = oferenteOpt.get();

        model.addAttribute("oferente", oferente);
        model.addAttribute("habilidades", oferenteCaracteristicaRepository.findByIdOferente(id));

        boolean tieneCv = cvService.tieneCV(id);
        model.addAttribute("tieneCv", tieneCv);
        model.addAttribute("urlPreviewCv", "/empresa/cv-candidato/" + id + "/preview");
        model.addAttribute("idPuesto", idPuesto);

        if (idPuesto != null) {
            Optional<Puesto> puestoOpt = puestoService.obtenerPorId(idPuesto);
            if (puestoOpt.isPresent() && perteneceAEmpresa(puestoOpt.get(), usuario.getId())) {
                Puesto puesto = puestoOpt.get();
                List<PuestoCaracteristica> requisitosPuesto = puestoCaracteristicaRepository.findByIdPuesto(idPuesto);

                int requisitosCumplidos = contarRequisitosCumplidos(oferente, requisitosPuesto);
                double porcentajeCoincidencia = calculadoraCoincidencia.calcularPorcentajeCoincidencia(oferente, puesto);

                model.addAttribute("puestoSeleccionado", puesto);
                model.addAttribute("porcentajeCoincidencia", porcentajeCoincidencia);
                model.addAttribute("requisitosCumplidos", requisitosCumplidos);
                model.addAttribute("totalRequisitos", requisitosPuesto.size());
            }
        }

        return "empresa/ver-detalles-candidato-empresa";
    }

    @GetMapping("/cv-candidato/{id}/preview")
    @ResponseBody
    public ResponseEntity<byte[]> previsualizarCvCandidato(@PathVariable Integer id,
                                                           HttpSession session) {
        Usuario usuario = obtenerUsuarioSesion(session);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!esEmpresa(usuario)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            byte[] cv = cvService.obtenerCV(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(cv.length);
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=cv_" + id + ".pdf");
            headers.setCacheControl("no-store, no-cache, must-revalidate, max-age=0");
            headers.add("X-Content-Type-Options", "nosniff");

            return new ResponseEntity<>(cv, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private int contarRequisitosCumplidos(Oferente oferente, List<PuestoCaracteristica> requisitosPuesto) {
        if (oferente == null || oferente.getId() == null || requisitosPuesto == null || requisitosPuesto.isEmpty()) {
            return 0;
        }

        Map<Integer, Integer> nivelesOferente = obtenerMapaNivelesOferente(oferente.getId());
        int cumplidos = 0;

        for (PuestoCaracteristica requisito : requisitosPuesto) {
            if (requisito == null
                    || requisito.getIdCaracteristica() == null
                    || requisito.getNivelRequerido() == null) {
                continue;
            }

            Integer nivelOferente = nivelesOferente.get(requisito.getIdCaracteristica());
            if (nivelOferente != null && nivelOferente >= requisito.getNivelRequerido()) {
                cumplidos++;
            }
        }

        return cumplidos;
    }

    private Map<Integer, Integer> obtenerMapaNivelesOferente(Integer idOferente) {
        Map<Integer, Integer> mapa = new HashMap<>();

        List<OferenteCaracteristica> habilidades = oferenteCaracteristicaRepository.findByIdOferente(idOferente);
        for (OferenteCaracteristica habilidad : habilidades) {
            if (habilidad == null
                    || habilidad.getIdCaracteristica() == null
                    || habilidad.getNivel() == null) {
                continue;
            }

            mapa.put(habilidad.getIdCaracteristica(), habilidad.getNivel());
        }

        return mapa;
    }

    private boolean coincideNombre(Oferente oferente, String nombreFiltro) {
        if (nombreFiltro == null || nombreFiltro.trim().isEmpty()) {
            return true;
        }

        String filtro = nombreFiltro.trim().toLowerCase(Locale.ROOT);
        String nombre = oferente.getNombre() != null ? oferente.getNombre().toLowerCase(Locale.ROOT) : "";
        String apellido = oferente.getApellido() != null ? oferente.getApellido().toLowerCase(Locale.ROOT) : "";
        String nombreCompleto = (nombre + " " + apellido).trim();

        return nombre.contains(filtro) || apellido.contains(filtro) || nombreCompleto.contains(filtro);
    }

    private boolean coincideNacionalidad(Oferente oferente, String nacionalidadFiltro) {
        if (nacionalidadFiltro == null || nacionalidadFiltro.trim().isEmpty()) {
            return true;
        }

        String filtro = nacionalidadFiltro.trim().toLowerCase(Locale.ROOT);
        String nacionalidad = oferente.getNacionalidad() != null
                ? oferente.getNacionalidad().toLowerCase(Locale.ROOT)
                : "";

        return nacionalidad.contains(filtro);
    }

    private String construirNombreCompleto(Oferente oferente) {
        String nombre = oferente.getNombre() != null ? oferente.getNombre().trim() : "";
        String apellido = oferente.getApellido() != null ? oferente.getApellido().trim() : "";
        return (nombre + " " + apellido).trim();
    }

    private String formatearPorcentaje(double porcentaje) {
        return String.format(Locale.US, "%.2f", porcentaje).replace(".", ",") + "%";
    }

    private Usuario obtenerUsuarioSesion(HttpSession session) {
        Object usuario = session.getAttribute("usuario");
        return (usuario instanceof Usuario) ? (Usuario) usuario : null;
    }

    private boolean esEmpresa(Usuario usuario) {
        return usuario != null
                && usuario.getTipoUsuario() != null
                && "EMPRESA".equalsIgnoreCase(usuario.getTipoUsuario());
    }

    private boolean perteneceAEmpresa(Puesto puesto, Integer idEmpresa) {
        return puesto != null
                && puesto.getIdEmpresa() != null
                && puesto.getIdEmpresa().getId() != null
                && puesto.getIdEmpresa().getId().equals(idEmpresa);
    }

    @GetMapping("/publicar-puesto")
    public String publicarPuestoForm(HttpSession session, Model model) {
        if (obtenerUsuarioSesion(session) == null) {
            return "redirect:/login";
        }
        model.addAttribute("categorias", caracteristicaService.obtenerCaracteristicasPrincipales());
        return "empresa/publicar-puesto";
    }

    private static class CandidatoBusquedaVista {
        private final Integer idOferente;
        private final String nombreOferente;
        private final int requisitosCumplidos;
        private final int totalRequisitos;
        private final double porcentajeCoincidencia;
        private final String porcentajeCoincidenciaTexto;

        public CandidatoBusquedaVista(Integer idOferente,
                                      String nombreOferente,
                                      int requisitosCumplidos,
                                      int totalRequisitos,
                                      double porcentajeCoincidencia,
                                      String porcentajeCoincidenciaTexto) {
            this.idOferente = idOferente;
            this.nombreOferente = nombreOferente;
            this.requisitosCumplidos = requisitosCumplidos;
            this.totalRequisitos = totalRequisitos;
            this.porcentajeCoincidencia = porcentajeCoincidencia;
            this.porcentajeCoincidenciaTexto = porcentajeCoincidenciaTexto;
        }

        public Integer getIdOferente() {
            return idOferente;
        }

        public String getNombreOferente() {
            return nombreOferente;
        }

        public int getRequisitosCumplidos() {
            return requisitosCumplidos;
        }

        public int getTotalRequisitos() {
            return totalRequisitos;
        }

        public String getRequisitosCumplidosTexto() {
            return requisitosCumplidos + " / " + totalRequisitos;
        }

        public double getPorcentajeCoincidencia() {
            return porcentajeCoincidencia;
        }

        public String getPorcentajeCoincidenciaTexto() {
            return porcentajeCoincidenciaTexto;
        }
    }
}