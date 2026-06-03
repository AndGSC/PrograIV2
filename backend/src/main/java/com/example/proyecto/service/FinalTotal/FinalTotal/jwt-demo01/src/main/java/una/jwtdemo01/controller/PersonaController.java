package una.jwtdemo01.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import una.jwtdemo01.model.Persona;
import java.util.List;

@RestController
public class PersonaController {

    @GetMapping("/api/personas")
    public List<Persona> listar() {
        return List.of(
                new Persona(1, "403043", "Steven Brenes"),
                new Persona(2, "454355", "Pedro Sanchez")
        );
    }
}