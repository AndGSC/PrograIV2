package com.example.proyecto.service;

import com.example.proyecto.data.PuestoRepository;
import com.example.proyecto.logica.Empresa;
import com.example.proyecto.logica.Puesto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportePuestosPdfServiceTest {

    @Mock
    private PuestoRepository puestoRepository;

    @InjectMocks
    private ReportePuestosPdfService reportePuestosPdfService;

    @Test
    void generarReporteMensual_devuelvePdfConContenido() {
        Puesto puesto = new Puesto();
        puesto.setId(1);
        puesto.setDescripcionGeneral("Backend Java");
        puesto.setTipoPublicacion("PUBLICA");
        puesto.setActivo(true);
        puesto.setSalarioUsd(new BigDecimal("1500.00"));
        puesto.setFechaRegistro(Instant.parse("2026-03-12T10:15:30Z"));

        Empresa empresa = new Empresa();
        empresa.setNombre("Empresa Demo");
        puesto.setIdEmpresa(empresa);

        when(puestoRepository.findByFechaRegistroGreaterThanEqualAndFechaRegistroLessThan(any(), any()))
                .thenReturn(List.of(puesto));

        byte[] pdf = reportePuestosPdfService.generarReporteMensual(2026, 3);

        assertTrue(pdf.length > 0);
        verify(puestoRepository).findByFechaRegistroGreaterThanEqualAndFechaRegistroLessThan(any(), any());
    }

    @Test
    void generarReporteMensual_fallaConMesInvalido() {
        assertThrows(IllegalArgumentException.class,
                () -> reportePuestosPdfService.generarReporteMensual(2026, 13));
    }
}

