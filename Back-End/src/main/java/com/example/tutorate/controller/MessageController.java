package com.example.tutorate.controller;

import com.example.tutorate.model.Message;
import com.example.tutorate.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController{
    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/getMessages")
    List<Message> getMessage(@RequestParam("userID") int userID) {
        return messageRepository.getMessages(userID);
    }
}
