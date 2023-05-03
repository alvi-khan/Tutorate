package com.example.tutorate.controller;

import com.example.tutorate.model.Message;
import com.example.tutorate.model.User;
import com.example.tutorate.repository.MessageRepository;
import com.example.tutorate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    UserRepository userRepository;

    @MessageMapping("/messages")
    public Message receivePrivateMessage(@Payload Message message) {
        messageRepository.save(message);
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(message.getReceiverID()), "/", message);
        return message;
    }

    @MessageMapping("/keepAlive")
    public void keepAlive(@Payload int userID) {
        User user = userRepository.findById(userID);
        user.setKeepAliveCount(3);
        userRepository.save(user);
    }

    @Scheduled(fixedDelay = 10000, initialDelay = 10000)
    public void checkConnected() {
        List<User> users = userRepository.findAllByKeepAliveCountIsGreaterThan(0);

        for(User user : users) {
            int keepAliveCount = user.getKeepAliveCount();
            keepAliveCount -= 1;
            user.setKeepAliveCount(keepAliveCount);
            userRepository.save(user);
            if (keepAliveCount == 0) {
                notifyUserStatusUpdate(user.getId());
                continue;
            }
            simpMessagingTemplate.convertAndSendToUser(String.valueOf(user.getId()), "/keepAlive", true);
        }
    }

    public void notifyUserStatusUpdate(int userID) {
        simpMessagingTemplate.convertAndSend("/statusUpdate", userID);
    }
}


