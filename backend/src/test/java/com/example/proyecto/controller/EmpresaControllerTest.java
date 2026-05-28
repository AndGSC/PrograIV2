package com.example.proyecto.controller;

import com.example.proyecto.data.OferenteCaracteristicaRepository;
import com.example.proyecto.data.PuestoCaracteristicaRepository;
import com.example.proyecto.logica.CalculadoraCoincidencia;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.service.CaracteristicaService;
import com.example.proyecto.service.CVService;
import com.example.proyecto.service.EmpresaService;
import com.example.proyecto.service.OferenteService;
import com.example.proyecto.service.PuestoCaracteristicaService;
import com.example.proyecto.service.PuestoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.ui.Model;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpresaControllerTest {

    @Mock
    private EmpresaService empresaService;
    @Mock
    private PuestoService puestoService;
    @Mock
    private OferenteService oferenteService;
    @Mock
    private CVService cvService;
    @Mock
    private CalculadoraCoincidencia calculadoraCoincidencia;
    @Mock
    private OferenteCaracteristicaRepository oferenteCaracteristicaRepository;
    @Mock
    private PuestoCaracteristicaRepository puestoCaracteristicaRepository;
    @Mock
    private CaracteristicaService caracteristicaService;
    @Mock
    private PuestoCaracteristicaService puestoCaracteristicaService;

    private EmpresaController controller;

    @BeforeEach
    void setUp() {
        controller = new EmpresaController(
                empresaService,
                puestoService,
                oferenteService,
                cvService,
                calculadoraCoincidencia,
                oferenteCaracteristicaRepository,
                puestoCaracteristicaRepository,
                caracteristicaService,
                puestoCaracteristicaService
        );
    }

    @Test
    void buscarCandidatosEmpresa_debeRedirigirAPublicarPuesto() {
        Usuario usuarioSesion = new Usuario();
        usuarioSesion.setId(10);
        usuarioSesion.setTipoUsuario("EMPRESA");

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("usuario", usuarioSesion);

        Model model = org.mockito.Mockito.mock(Model.class);
        String vista = controller.buscarCandidatosEmpresa(99, null, null, session, model);

        assertEquals("redirect:/empresa/publicar-puesto", vista);
    }

    @Test
    void buscarCandidatosAlias_debeRedirigirAPublicarPuesto() {
        MockHttpSession session = new MockHttpSession();
        Model model = org.mockito.Mockito.mock(Model.class);

        String vista = controller.buscarCandidatos(99, null, null, session, model);

        assertEquals("redirect:/empresa/publicar-puesto", vista);
    }
}


