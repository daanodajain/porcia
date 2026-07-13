package com.porcia.backend.notification.api;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@porcia.com}")
    private String fromEmail;

    @Value("${app.name:Porcia}")
    private String appName;

    public void sendOrderConfirmation(String to, String orderNumber, String customerName) {
        String subject = "Order Confirmation - " + orderNumber;
        String body = String.format("""
                <h2>Order Confirmed!</h2>
                <p>Hi %s,</p>
                <p>Thank you for your order. Your order number is <strong>%s</strong>.</p>
                <p>You can track your order status in your account dashboard.</p>
                <p>Best regards,<br/>%s Team</p>
                """, customerName, orderNumber, appName);
        sendHtmlEmail(to, subject, body);
    }

    public void sendShippingNotification(String to, String orderNumber, String trackingNumber, String carrier) {
        String subject = "Your Order Has Shipped - " + orderNumber;
        String body = String.format("""
                <h2>Your Order is On Its Way!</h2>
                <p>Your order <strong>%s</strong> has been shipped.</p>
                <p><strong>Carrier:</strong> %s<br/>
                <strong>Tracking Number:</strong> %s</p>
                <p>Track your shipment using the tracking number above.</p>
                <p>Best regards,<br/>%s Team</p>
                """, orderNumber, carrier, trackingNumber, appName);
        sendHtmlEmail(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Password Reset Request";
        String body = String.format("""
                <h2>Password Reset</h2>
                <p>We received a request to reset your password.</p>
                <p><a href="%s" style="background: #111827; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a></p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br/>%s Team</p>
                """, resetLink, appName);
        sendHtmlEmail(to, subject, body);
    }

    public void sendWelcomeEmail(String to, String customerName) {
        String subject = "Welcome to " + appName;
        String body = String.format("""
                <h2>Welcome to %s!</h2>
                <p>Hi %s,</p>
                <p>Thank you for creating an account with us. We're excited to have you on board!</p>
                <p>Start exploring our collection and enjoy exclusive offers.</p>
                <p>Best regards,<br/>%s Team</p>
                """, appName, customerName, appName);
        sendHtmlEmail(to, subject, body);
    }

    public void sendDeliveryConfirmation(String to, String orderNumber) {
        String subject = "Delivery Confirmed - " + orderNumber;
        String body = String.format("""
                <h2>Your Order Has Been Delivered!</h2>
                <p>Your order <strong>%s</strong> has been successfully delivered.</p>
                <p>We hope you enjoy your purchase. If you have any questions, feel free to contact us.</p>
                <p>Best regards,<br/>%s Team</p>
                """, orderNumber, appName);
        sendHtmlEmail(to, subject, body);
    }

    public void sendCancellationEmail(String to, String orderNumber) {
        String subject = "Order Cancelled - " + orderNumber;
        String body = String.format("""
                <h2>Order Cancelled</h2>
                <p>Your order <strong>%s</strong> has been cancelled.</p>
                <p>If you paid for this order, the refund will be processed within 5-7 business days.</p>
                <p>If you have any questions, please contact our support team.</p>
                <p>Best regards,<br/>%s Team</p>
                """, orderNumber, appName);
        sendHtmlEmail(to, subject, body);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    private void sendPlainEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }
}
