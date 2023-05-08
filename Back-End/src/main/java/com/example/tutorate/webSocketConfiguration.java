package com.example.tutorate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class webSocketConfiguration implements WebSocketMessageBrokerConfigurer {
    @Value("${server.origin}")
    private String origin;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
     registry.setApplicationDestinationPrefixes("/chat");
     registry.enableSimpleBroker("/user");
     registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins(origin).withSockJS();
    }
}
