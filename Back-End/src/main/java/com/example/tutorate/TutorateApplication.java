package com.example.tutorate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TutorateApplication {
    public static void main(String[] args) {
        SpringApplication.run(TutorateApplication.class, args);
    }
}
