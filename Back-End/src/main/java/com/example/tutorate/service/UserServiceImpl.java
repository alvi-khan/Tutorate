package com.example.tutorate.service;

import com.example.tutorate.model.User;
import com.example.tutorate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    UserRepository userRepository;

    public boolean userExists(String username) {
        User user = userRepository.findByUsername(username);
        return user != null;
    }

    public boolean authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        return password.equals(user.getPassword());
    }

    public User addNewUser(User user) {
        userRepository.save(user);
        return userRepository.findByUsername(user.getUsername());
    }
}
