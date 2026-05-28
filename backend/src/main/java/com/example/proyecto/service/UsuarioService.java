package com.example.proyecto.service;

import com.example.proyecto.data.UsuarioRepository;
import com.example.proyecto.logica.Usuario;
import com.example.proyecto.logica.PasswordEncryptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncryptor passwordEncryptor;

    public List<Usuario> obtenerTodos() {
        return StreamSupport.stream(usuarioRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public void guardar(Usuario usuario) {
        usuario.setClave(passwordEncryptor.encode(usuario.getClave()));
        usuarioRepository.save(usuario);
    }

    public Optional<Usuario> obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    public boolean validarCredenciales(String correo, String clave) {
        Optional<Usuario> usuario = usuarioRepository.findByCorreo(correo);

        if (usuario.isPresent()) {
            Usuario u = usuario.get();
            System.out.println(">>> USUARIO ENCONTRADO: " + u.getCorreo());
            System.out.println(">>> CLAVE EN BD: " + u.getClave());
            System.out.println(">>> CLAVE INGRESADA: " + clave);
            boolean resultado = passwordEncryptor.matches(clave, u.getClave());
            System.out.println(">>> RESULTADO MATCHES: " + resultado);
            return resultado;
        }

        System.out.println(">>> USUARIO NO ENCONTRADO: " + correo);
        return false;
    }
}
