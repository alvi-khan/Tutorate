package com.example.tutorate.controller;

import com.example.tutorate.model.User;
import com.example.tutorate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
