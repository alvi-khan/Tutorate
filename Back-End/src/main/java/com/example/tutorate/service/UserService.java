package com.example.tutorate.service;

import com.example.tutorate.model.User;

public interface UserService {
    boolean userExists (String username);
    boolean authenticate (String username, String password);
    User addNewUser (User user);
}
