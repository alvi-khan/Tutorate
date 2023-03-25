package com.example.tutorate.controller;

import com.example.tutorate.model.Message;
import com.example.tutorate.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "https://tutorate.onrender.com", "https://tutorate-private-production.up.railway.app", "https://8080-73c1790e07624f5090a7f3d032810880.onpatr.cloud"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/message")
public class MessageController{
    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/prefetch")
    List<Message> getMessage(@RequestParam("name") String name) {
        return messageRepository.getPrefetchMessages(name);
    }
}
