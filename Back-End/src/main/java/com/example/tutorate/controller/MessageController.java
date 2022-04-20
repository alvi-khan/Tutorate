package com.example.tutorate.controller;

import com.example.tutorate.model.Message;
import com.example.tutorate.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/message")
public class MessageController{
    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/prefetch")
    List<Message> getMessage( String name){
        System.out.println("huzzah");

        System.out.println(messageRepository.getPrefetchMessages(name));
        return messageRepository.getPrefetchMessages(name);
    }


}
