package com.porcia.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    /**
     * Foundation project me email sending ke liye bean missing tha.
     * Isliye app startup fail ho raha tha.
     *
     * Agar spring.mail.* properties set nahi hain, tab bhi bean create hoga (but email actually send nahi hoga).
     */
    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        // Defaults (can be overridden via application-*.yml)
        sender.setHost(System.getProperty("spring.mail.host", "localhost"));
        sender.setPort(Integer.parseInt(System.getProperty("spring.mail.port", "25")));
        sender.setUsername(System.getProperty("spring.mail.username", ""));
        sender.setPassword(System.getProperty("spring.mail.password", ""));

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", System.getProperty("spring.mail.properties.mail.smtp.auth", "false"));
        props.put("mail.smtp.starttls.enable", System.getProperty("spring.mail.properties.mail.smtp.starttls.enable", "false"));
        props.put("mail.debug", System.getProperty("spring.mail.properties.mail.debug", "false"));

        return sender;
    }
}

