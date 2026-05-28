package com.example.proyecto.service;

import com.example.proyecto.data.PuestoRepository;
import com.example.proyecto.logica.Puesto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportePuestosPdfService {

    private static final DateTimeFormatter FORMATTER_MES = DateTimeFormatter.ofPattern("MM/yyyy");
    private static final DateTimeFormatter FORMATTER_FECHA = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Autowired
    private PuestoRepository puestoRepository;

    public byte[] generarReporteMensual(Integer anio, Integer mes) {
        validarPeriodo(anio, mes);

        YearMonth periodo = YearMonth.of(anio, mes);
        Instant inicio = periodo.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant fin = periodo.plusMonths(1).atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<Puesto> puestos = puestoRepository.findByFechaRegistroGreaterThanEqualAndFechaRegistroLessThan(inicio, fin);
        long activos = puestos.stream().filter(p -> Boolean.TRUE.equals(p.getActivo())).count();
        long inactivos = puestos.size() - activos;

        List<String> lineas = construirLineasReporte(periodo, puestos, activos, inactivos);
        return generarPdfSimple(lineas);
    }

    private List<String> construirLineasReporte(YearMonth periodo, List<Puesto> puestos, long activos, long inactivos) {
        List<String> lineas = new ArrayList<>();
        lineas.add("Reporte mensual de puestos solicitados");
        lineas.add("Periodo: " + periodo.format(FORMATTER_MES));
        lineas.add("Fecha de generacion: " + LocalDate.now());
        lineas.add("Total de puestos: " + puestos.size());
        lineas.add("Puestos activos: " + activos);
        lineas.add("Puestos inactivos: " + inactivos);
        lineas.add("");

        if (puestos.isEmpty()) {
            lineas.add("No se registraron puestos para el periodo seleccionado.");
            return lineas;
        }

        lineas.add("ID | Empresa | Tipo | Activo | Fecha registro | Salario USD | Descripcion");
        for (Puesto puesto : puestos) {
            String linea = String.format(
                    "%s | %s | %s | %s | %s | %s | %s",
                    valor(puesto.getId()),
                    limpiar(valor(puesto.getIdEmpresa() != null ? puesto.getIdEmpresa().getNombre() : "N/D"), 24),
                    limpiar(valor(puesto.getTipoPublicacion()), 10),
                    Boolean.TRUE.equals(puesto.getActivo()) ? "SI" : "NO",
                    formatearFecha(puesto.getFechaRegistro()),
                    formatearSalario(puesto.getSalarioUsd()),
                    limpiar(valor(puesto.getDescripcionGeneral()), 60)
            );
            lineas.add(linea);
        }
        return lineas;
    }

    private byte[] generarPdfSimple(List<String> lineas) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            List<Integer> offsets = new ArrayList<>();
            offsets.add(0);

            escribir(out, "%PDF-1.4\n");

            offsets.add(out.size());
            escribir(out, "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

            offsets.add(out.size());
            escribir(out, "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

            offsets.add(out.size());
            escribir(out, "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n");

            offsets.add(out.size());
            escribir(out, "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

            String contenido = construirContenidoPdf(lineas);
            byte[] contenidoBytes = contenido.getBytes(StandardCharsets.US_ASCII);

            offsets.add(out.size());
            escribir(out, "5 0 obj\n<< /Length " + contenidoBytes.length + " >>\nstream\n");
            out.write(contenidoBytes);
            escribir(out, "\nendstream\nendobj\n");

            int xrefPos = out.size();
            escribir(out, "xref\n0 6\n");
            escribir(out, "0000000000 65535 f \n");
            for (int i = 1; i <= 5; i++) {
                escribir(out, String.format("%010d 00000 n \n", offsets.get(i)));
            }

            escribir(out, "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xrefPos + "\n%%EOF");
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("No se pudo generar el reporte PDF", e);
        }
    }

    private void validarPeriodo(Integer anio, Integer mes) {
        if (anio == null || anio < 2000 || anio > 2100) {
            throw new IllegalArgumentException("El anio debe estar entre 2000 y 2100");
        }
        if (mes == null || mes < 1 || mes > 12) {
            throw new IllegalArgumentException("El mes debe estar entre 1 y 12");
        }
    }

    private String formatearFecha(Instant fechaRegistro) {
        if (fechaRegistro == null) {
            return "N/D";
        }
        return FORMATTER_FECHA.format(fechaRegistro.atZone(ZoneId.systemDefault()));
    }

    private String formatearSalario(BigDecimal salarioUsd) {
        if (salarioUsd == null) {
            return "0.00";
        }
        return salarioUsd.setScale(2, java.math.RoundingMode.HALF_UP).toPlainString();
    }

    private String construirContenidoPdf(List<String> lineas) {
        StringBuilder sb = new StringBuilder();
        sb.append("BT\n");
        sb.append("/F1 10 Tf\n");
        sb.append("36 560 Td\n");

        int maxLineas = Math.min(lineas.size(), 42);
        for (int i = 0; i < maxLineas; i++) {
            if (i > 0) {
                sb.append("0 -13 Td\n");
            }
            sb.append("(").append(escaparPdf(lineas.get(i))).append(") Tj\n");
        }

        if (lineas.size() > maxLineas) {
            sb.append("0 -13 Td\n");
            sb.append("(... reporte truncado por espacio de pagina ...) Tj\n");
        }

        sb.append("ET");
        return sb.toString();
    }

    private String escaparPdf(String texto) {
        return texto
                .replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)");
    }

    private void escribir(ByteArrayOutputStream out, String texto) throws IOException {
        out.write(texto.getBytes(StandardCharsets.US_ASCII));
    }

    private String limpiar(String texto, int limite) {
        if (texto == null) {
            return "";
        }
        String compacta = texto.replaceAll("\\s+", " ").trim();
        if (compacta.length() <= limite) {
            return compacta;
        }
        return compacta.substring(0, Math.max(0, limite - 3)) + "...";
    }

    private String valor(Object valor) {
        return valor == null ? "N/D" : String.valueOf(valor);
    }
}


