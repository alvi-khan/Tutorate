package com.example.tutorate.repository;

import com.example.tutorate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
    User findByUsernameIgnoreCase(String username);
    User findById(int id);
    User findBySocketSessionID(String socketSessionID);
}
