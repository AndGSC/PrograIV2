package una.jwtdemo01.controller;

import org.springframework.web.bind.annotation.*;
import una.jwtdemo01.dto.LoginRequest;
import una.jwtdemo01.dto.LoginResponse;
import una.jwtdemo01.security.JwtService;

@RestController
@RequestMapping("/  ")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService)
    {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        if (request.getUsername().equals("admin") && request.getPassword().equals("root")) {
            return new LoginResponse(jwtService.generarToken(request.getUsername()));
        }
        throw new RuntimeException("Usuario o password inválidos");
    }
}