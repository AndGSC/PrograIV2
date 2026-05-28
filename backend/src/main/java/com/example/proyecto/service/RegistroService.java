package com.example.proyecto.service;

import com.example.proyecto.data.EmpresaRepository;
import com.example.proyecto.data.OferenteRepository;
import com.example.proyecto.data.UsuarioRepository;
import com.example.proyecto.logica.Empresa;
import com.example.proyecto.logica.Oferente;
import com.example.proyecto.logica.PasswordEncryptor;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.modelo.ModeloEmpresa;
import com.example.proyecto.modelo.ModeloOferente;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RegistroService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final OferenteRepository oferenteRepository;
    private final PasswordEncryptor passwordEncryptor;
    private final NacionalidadService nacionalidadService;

    public RegistroService(UsuarioRepository usuarioRepository,
                           EmpresaRepository empresaRepository,
                           OferenteRepository oferenteRepository,
                           PasswordEncryptor passwordEncryptor,
                           NacionalidadService nacionalidadService) {
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.oferenteRepository = oferenteRepository;
        this.passwordEncryptor = passwordEncryptor;
        this.nacionalidadService = nacionalidadService;
    }

    /**
     * Registra una nueva empresa con su usuario asociado.
     */
    public void registrarEmpresa(ModeloEmpresa modeloEmpresa) {
        if (modeloEmpresa == null) {
            throw new IllegalArgumentException("No se recibieron datos de la empresa.");
        }

        String correo = normalizarCorreo(modeloEmpresa.getEmail());
        String clave = textoRequerido(modeloEmpresa.getClave(), "La contraseña es requerida");
        String nombre = textoRequerido(modeloEmpresa.getNombre(), "El nombre de la empresa es requerido");

        if (usuarioRepository.findByCorreo(correo).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setCorreo(correo);
        usuario.setClave(passwordEncryptor.encode(clave));
        usuario.setTipoUsuario("EMPRESA");
        usuario.setAprobado(false);
        usuario = usuarioRepository.save(usuario);

        Empresa empresa = new Empresa();
        empresa.setUsuarios(usuario);
        empresa.setNombre(nombre);
        empresa.setLocalizacion(textoOpcional(modeloEmpresa.getLocalizacion()));
        empresa.setDescripcion(textoOpcional(modeloEmpresa.getDescripcion()));
        empresa.setTelefono(parseEnteroOpcional(modeloEmpresa.getTelefono(), "El teléfono de la empresa debe ser numérico"));

        empresaRepository.save(empresa);
    }

    /**
     * Registra un nuevo oferente con su usuario asociado.
     */
    public void registrarOferente(ModeloOferente modeloOferente) {
        if (modeloOferente == null) {
            throw new IllegalArgumentException("No se recibieron datos del oferente.");
        }

        String correo = normalizarCorreo(modeloOferente.getEmail());
        String clave = textoRequerido(modeloOferente.getClave(), "La contraseña es requerida");
        String nombre = textoRequerido(modeloOferente.getNombre(), "El nombre es requerido");
        String apellido = textoRequerido(modeloOferente.getApellido(), "El apellido es requerido");
        String identificacionTexto = textoRequerido(modeloOferente.getIdentificacion(), "La identificación es requerida");
        String codigoNacionalidad = textoRequerido(modeloOferente.getNacionalidad(), "La nacionalidad es requerida");

        if (usuarioRepository.findByCorreo(correo).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        Integer identificacion = parseEnteroRequerido(identificacionTexto, "La identificación debe ser un número válido");

        boolean identificacionYaExiste = existeIdentificacionOferente(identificacion);

        if (identificacionYaExiste) {
            throw new IllegalArgumentException("La identificación ya está registrada");
        }

        String nombreNacionalidad = nacionalidadService.obtenerNombrePorCodigo(codigoNacionalidad)
                .orElseThrow(() -> new IllegalArgumentException("La nacionalidad seleccionada no es válida"));

        Usuario usuario = new Usuario();
        usuario.setCorreo(correo);
        usuario.setClave(passwordEncryptor.encode(clave));
        usuario.setTipoUsuario("OFERENTE");
        usuario.setAprobado(false);
        usuario = usuarioRepository.save(usuario);

        Oferente oferente = new Oferente();
        oferente.setUsuarios(usuario);
        oferente.setIdentificacion(identificacion);
        oferente.setNombre(nombre);
        oferente.setApellido(apellido);
        oferente.setNacionalidad(nombreNacionalidad);
        oferente.setResidencia(textoOpcional(modeloOferente.getResidencia()));
        oferente.setTelefono(parseEnteroOpcional(modeloOferente.getTelefono(), "El teléfono del oferente debe ser numérico"));

        oferenteRepository.save(oferente);
    }

    private String normalizarCorreo(String correo) {
        String valor = textoRequerido(correo, "El email es requerido");
        return valor.toLowerCase();
    }

    private String textoRequerido(String valor, String mensajeError) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException(mensajeError);
        }
        return valor.trim();
    }

    private String textoOpcional(String valor) {
        return (valor == null || valor.trim().isEmpty()) ? null : valor.trim();
    }

    private Integer parseEnteroRequerido(String valor, String mensajeError) {
        try {
            return Integer.parseInt(valor.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(mensajeError);
        }
    }

    private Integer parseEnteroOpcional(String valor, String mensajeError) {
        if (valor == null || valor.trim().isEmpty()) {
            return null;
        }

        try {
            return Integer.parseInt(valor.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(mensajeError);
        }
    }


    private boolean existeIdentificacionOferente(Integer identificacion) {
        for (Oferente oferente : oferenteRepository.findAll()) {
            if (oferente.getIdentificacion() != null && oferente.getIdentificacion().equals(identificacion)) {
                return true;
            }
        }
        return false;
    }
}