package com.example.proyecto.service;

import com.example.proyecto.data.OferenteRepository;
import com.example.proyecto.logica.Oferente;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CVServiceTest {

    private static final byte[] PDF_BYTES = "%PDF-1.7\ncontenido".getBytes(StandardCharsets.US_ASCII);

    @Mock
    private OferenteRepository oferenteRepository;

    @InjectMocks
    private CVService cvService;

    private Oferente oferente;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cvService, "baseUrl", "http://localhost:8080");
        oferente = new Oferente();
        oferente.setId(1);
    }

    @Test
    void guardarCV_guardaPdfValido() {
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "cv.pdf",
                "application/pdf",
                PDF_BYTES
        );

        when(oferenteRepository.findById(1)).thenReturn(Optional.of(oferente));

        String url = cvService.guardarCV(1, archivo);

        assertEquals("http://localhost:8080/api/legacy/cv/descargar/1", url);
        assertArrayEquals(PDF_BYTES, oferente.getCurriculumPdf());
        verify(oferenteRepository).save(oferente);
    }

    @Test
    void guardarCV_rechazaExtensionNoPdf() {
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "cv.docx",
                "application/pdf",
                PDF_BYTES
        );

        when(oferenteRepository.findById(1)).thenReturn(Optional.of(oferente));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> cvService.guardarCV(1, archivo));

        assertTrue(ex.getMessage().contains("Solo se admite PDF"));
        verify(oferenteRepository, never()).save(any());
    }

    @Test
    void guardarCV_rechazaMimeInvalido() {
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "cv.pdf",
                "text/plain",
                PDF_BYTES
        );

        when(oferenteRepository.findById(1)).thenReturn(Optional.of(oferente));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> cvService.guardarCV(1, archivo));

        assertTrue(ex.getMessage().contains("Tipo MIME"));
        verify(oferenteRepository, never()).save(any());
    }

    @Test
    void guardarCV_rechazaFirmaPdfInvalida() {
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "cv.pdf",
                "application/pdf",
                "NO_ES_PDF".getBytes(StandardCharsets.US_ASCII)
        );

        when(oferenteRepository.findById(1)).thenReturn(Optional.of(oferente));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> cvService.guardarCV(1, archivo));

        assertTrue(ex.getMessage().contains("firma PDF"));
        verify(oferenteRepository, never()).save(any());
    }

    @Test
    void guardarCV_rechazaTamanoMayorPermitido() {
        byte[] contenido = new byte[(10 * 1024 * 1024) + 1];
        byte[] firma = "%PDF-".getBytes(StandardCharsets.US_ASCII);
        System.arraycopy(firma, 0, contenido, 0, firma.length);

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "cv.pdf",
                "application/pdf",
                contenido
        );

        when(oferenteRepository.findById(1)).thenReturn(Optional.of(oferente));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> cvService.guardarCV(1, archivo));

        assertTrue(ex.getMessage().contains("10 MB"));
        verify(oferenteRepository, never()).save(any());
    }
}


