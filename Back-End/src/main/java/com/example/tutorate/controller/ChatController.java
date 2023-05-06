package com.example.tutorate.controller;

import com.example.tutorate.model.Message;
import com.example.tutorate.model.User;
import com.example.tutorate.repository.MessageRepository;
import com.example.tutorate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

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

    @EventListener
    public void onDisconnectEvent(SessionDisconnectEvent event) {
        User user = userRepository.findBySocketSessionID(event.getSessionId());
        user.setSocketSessionID(null);
        userRepository.save(user);
        notifyUserStatusUpdate(user.getId());
    }

    @EventListener
    public void onConnectEvent(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        int userID = Integer.parseInt(accessor.getNativeHeader("userID").get(0));
        String sessionID = accessor.getSessionId();

        User user = userRepository.findById(userID);
        user.setSocketSessionID(sessionID);
        userRepository.save(user);
        notifyUserStatusUpdate(userID);
    }

    public void notifyUserStatusUpdate(int userID) {
        simpMessagingTemplate.convertAndSend("/statusUpdate", userID);
    }
}


