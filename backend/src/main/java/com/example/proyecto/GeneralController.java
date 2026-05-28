package com.example.proyecto;

import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GeneralController {
    @GetMapping("index")
    public String index(Model model){
        return "index";
    }
}
