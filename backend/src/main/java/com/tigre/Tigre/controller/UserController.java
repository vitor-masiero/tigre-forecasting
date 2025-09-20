package com.tigre.Tigre.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @GetMapping("/health")
    public String healthCheck() {
        return String.format("I am ok");
    }
}
