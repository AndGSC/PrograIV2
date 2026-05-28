package com.example.proyecto.service;

import com.example.proyecto.data.PuestoRepository;
import com.example.proyecto.logica.Puesto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PuestoServiceTest {

    @Mock
    private PuestoRepository puestoRepository;

    @Mock
    private TipoCambioService tipoCambioService;

    @Mock
    private EmpresaService empresaService;

    @InjectMocks
    private PuestoService puestoService;

    @Test
    void desactivarPuestoEmpresa_desactivaPuestoActivo() {
        Puesto puesto = new Puesto();
        puesto.setId(10);
        puesto.setActivo(true);

        when(puestoRepository.findByIdAndIdEmpresaId(10, 5)).thenReturn(Optional.of(puesto));

        puestoService.desactivarPuestoEmpresa(10, 5);

        assertFalse(puesto.getActivo());
        verify(puestoRepository).save(puesto);
    }

    @Test
    void desactivarPuestoEmpresa_fallaSiNoPerteneceAEmpresa() {
        when(puestoRepository.findByIdAndIdEmpresaId(10, 5)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> puestoService.desactivarPuestoEmpresa(10, 5));

        assertEquals("No existe el puesto para esta empresa", ex.getMessage());
        verify(puestoRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void desactivarPuestoEmpresa_fallaSiYaEstaDesactivado() {
        Puesto puesto = new Puesto();
        puesto.setId(10);
        puesto.setActivo(false);

        when(puestoRepository.findByIdAndIdEmpresaId(10, 5)).thenReturn(Optional.of(puesto));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> puestoService.desactivarPuestoEmpresa(10, 5));

        assertEquals("El puesto ya esta desactivado", ex.getMessage());
        verify(puestoRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }
}

