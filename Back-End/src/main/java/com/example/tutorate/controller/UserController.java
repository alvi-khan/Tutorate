package com.example.tutorate.controller;

import com.example.tutorate.model.User;
import com.example.tutorate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:3000", "https://tutorate.onrender.com", "https://tutorate-private-production.up.railway.app", "https://8080-73c1790e07624f5090a7f3d032810880.onpatr.cloud"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id){
        return userRepository.findById(id);
    }
}
