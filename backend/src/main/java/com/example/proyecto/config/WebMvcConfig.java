package com.example.proyecto.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("legacy")
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private AuthSessionInterceptor authSessionInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authSessionInterceptor)
                .addPathPatterns(
                        "/administrador/**",
                        "/oferente/**",
                        "/empresa/dashboard-empresa",
                        "/empresa/mis-puestos-empresa",
                        "/empresa/publicar-puesto",
                        "/empresa/crear-puesto",
                        "/empresa/desactivar-puesto/**",
                        "/empresa/ver-detalles-candidato-empresa",
                        "/empresa/cv-candidato/**"
                );
    }
}

