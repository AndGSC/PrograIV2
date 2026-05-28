package com.example.proyecto.service;

import com.example.proyecto.data.OferenteRepository;
import com.example.proyecto.data.OferenteCaracteristicaRepository;
import com.example.proyecto.data.CaracteristicaRepository;
import com.example.proyecto.logica.Oferente;
import com.example.proyecto.logica.OferenteCaracteristica;
import com.example.proyecto.logica.OferenteCaracteristicaId;
import com.example.proyecto.logica.PasswordEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class OferenteService {

    @Autowired
    private OferenteRepository oferenteRepository;

    @Autowired
    private OferenteCaracteristicaRepository oferenteCaracteristicaRepository;

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    @Autowired
    private PasswordEncryptor passwordEncryptor;

    public List<OferenteCaracteristica> obtenerHabilidades(Integer idOferente) {
        return oferenteCaracteristicaRepository.findByIdOferente(idOferente);
    }

    public void guardarOActualizarHabilidad(Integer idOferente, Integer idCaracteristica, Integer nivel) {
        OferenteCaracteristicaId idCompuesto = new OferenteCaracteristicaId();
        idCompuesto.setIdOferente(idOferente);
        idCompuesto.setIdCaracteristica(idCaracteristica);

        OferenteCaracteristica habilidad = oferenteCaracteristicaRepository.findById(idCompuesto)
                .orElse(new OferenteCaracteristica());

        if (habilidad.getIdOferente() == null) {
            habilidad.setIdOferente(idOferente);
            habilidad.setIdCaracteristica(idCaracteristica);

            habilidad.setOferente(oferenteRepository.findById(idOferente).orElse(null));
            habilidad.setCaracteristica(caracteristicaRepository.findById(idCaracteristica).orElse(null));
        }

        habilidad.setNivel(nivel);
        oferenteCaracteristicaRepository.save(habilidad);
    }

    public void eliminarHabilidad(Integer idOferente, Integer idCaracteristica) {
        OferenteCaracteristicaId id = new OferenteCaracteristicaId();
        id.setIdOferente(idOferente);
        id.setIdCaracteristica(idCaracteristica);
        oferenteCaracteristicaRepository.deleteById(id);
    }

    public void registrarOferente(Oferente oferente) {
        String claveHash = passwordEncryptor.encode(oferente.getUsuarios().getClave());
        oferente.getUsuarios().setClave(claveHash);
        oferenteRepository.save(oferente);
    }

    public List<Oferente> obtenerTodos() {
        return StreamSupport.stream(oferenteRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public Optional<Oferente> obtenerPorId(Integer id) {
        return oferenteRepository.findById(id);
    }

    public List<Oferente> buscarPorNombre(String nombre) {
        return oferenteRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Oferente> buscarPorNacionalidad(String nacionalidad) {
        return oferenteRepository.findByNacionalidad(nacionalidad);
    }

    public List<Oferente> obtenerOfertesAprobados() {
        return obtenerTodos().stream()
                .filter(o -> o.getUsuarios() != null && Boolean.TRUE.equals(o.getUsuarios().getAprobado()))
                .collect(Collectors.toList());
    }

    public void aprobarOferente(Integer id) {
        oferenteRepository.findById(id).ifPresent(o -> {
            o.getUsuarios().setAprobado(true);
            oferenteRepository.save(o);
        });
    }

    public void eliminarOferente(Integer id) {
        oferenteRepository.deleteById(id);
    }

    public void subirCurriculum(Integer id, byte[] contenido) throws Exception {
        Oferente oferente = oferenteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado: " + id));

        if (contenido == null || contenido.length == 0) {
            throw new IllegalArgumentException("El contenido del CV no puede estar vacío");
        }

        oferente.setCurriculumPdf(contenido);
        oferenteRepository.save(oferente);
    }
}

