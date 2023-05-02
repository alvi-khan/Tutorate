package com.example.tutorate.controller;

import com.example.tutorate.repository.UserRepository;
import com.example.tutorate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import com.example.tutorate.model.User;

@CrossOrigin(origins = {"http://localhost:3000", "https://tutorate.onrender.com", "https://tutorate-private-production.up.railway.app", "https://8080-73c1790e07624f5090a7f3d032810880.onpatr.cloud"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class LoginController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/checkUser")
    public boolean checkUser(@RequestBody User user) {
        return userService.userExists(user.getUsername());
    }

    @PostMapping("/login")
    public User login (@RequestBody User user, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(userService.authenticate(user.getUsername(), user.getPassword())) {
            session.setAttribute("User", user.getUsername());
            return userRepository.findByUsername(user.getUsername());
        }
        else {
            User invalid = new User();
            invalid.setPassword("invalid");
            return invalid;
        }
    }

    @PostMapping("/register")
    public User register (@RequestBody User user, HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.setAttribute("User", user.getUsername());
        return userService.addNewUser(user);
    }
 
    @GetMapping("/logout")
    public void logout (HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.invalidate();
    }
}
 
