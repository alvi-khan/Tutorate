package com.example.tutorate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig {
    @Value("${server.origin}")
    private String origin;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
       return new WebMvcConfigurer() {
           @Override
           public void addCorsMappings(CorsRegistry registry) {
               registry.addMapping("/**")
                       .allowedOrigins(origin)
                       .allowedMethods("*")
                       .allowedHeaders("*")
                       .allowCredentials(true)
                       .maxAge(3600);
           }
       };
    }
}
