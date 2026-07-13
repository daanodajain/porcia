package com.porcia.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class PorciaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PorciaBackendApplication.class, args);
    }
}

