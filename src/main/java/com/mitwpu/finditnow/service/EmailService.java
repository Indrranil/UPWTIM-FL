package com.mitwpu.finditnow.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Store OTPs (in a real app, this would be in Redis or a database)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    // Store notification preferences (in a real app, this would be in a database)
    private final Map<String, Map<String, Boolean>> notificationPreferences =
        new ConcurrentHashMap<>();

    public void sendOtp(String email) {
        if (email == null || !email.endsWith("@mitwpu.edu.in")) {
            throw new IllegalArgumentException(
                "Only MIT-WPU email addresses are allowed"
            );
        }

        String otp = generateOtp();
        otpStore.put(email, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("FindItNow - Your OTP for Email Verification");
        message.setText(
            "Your OTP for email verification is: " +
            otp +
            "\n\nThis code will expire in 10 minutes. If you did not request this OTP, please ignore this email."
        );

        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStore.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStore.remove(email); // Remove after successful verification
            return true;
        }
        return false;
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }

    public void setNotificationPreferences(
        String userId,
        Map<String, Boolean> preferences
    ) {
        notificationPreferences.put(userId, preferences);
    }

    public Map<String, Boolean> getNotificationPreferences(String userId) {
        return notificationPreferences.getOrDefault(
            userId,
            getDefaultPreferences()
        );
    }

    private Map<String, Boolean> getDefaultPreferences() {
        Map<String, Boolean> defaults = new HashMap<>();
        defaults.put("claimReceived", true);
        defaults.put("claimUpdated", true);
        defaults.put("matchFound", true);
        defaults.put("itemRecovered", true);
        return defaults;
    }

    // Methods for sending different types of notification emails

    public void sendClaimReceivedNotification(
        String email,
        String itemTitle,
        String claimantName
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("FindItNow - New Claim Received");
        message.setText(
            "Hello,\n\n" +
            "A new claim has been submitted for your item \"" +
            itemTitle +
            "\" by " +
            claimantName +
            ".\n\n" +
            "Please log in to your account to review the claim details and take action.\n\n" +
            "Regards,\nFindItNow Team"
        );

        mailSender.send(message);
    }

    public void sendClaimStatusNotification(
        String email,
        String itemTitle,
        String status
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("FindItNow - Claim Status Updated");
        message.setText(
            "Hello,\n\n" +
            "Your claim for the item \"" +
            itemTitle +
            "\" has been " +
            status.toLowerCase() +
            ".\n\n" +
            "Please log in to your account for more details.\n\n" +
            "Regards,\nFindItNow Team"
        );

        mailSender.send(message);
    }

    public void sendMatchFoundNotification(
        String email,
        String itemTitle,
        String matchedItemTitle
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("FindItNow - Potential Match Found");
        message.setText(
            "Hello,\n\n" +
            "We've found a potential match for your item \"" +
            itemTitle +
            "\"!\n\n" +
            "The potentially matching item is: \"" +
            matchedItemTitle +
            "\"\n\n" +
            "Please log in to your account to view the details and check if this is your item.\n\n" +
            "Regards,\nFindItNow Team"
        );

        mailSender.send(message);
    }

    public void sendItemRecoveredNotification(String email, String itemTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("FindItNow - Item Recovered");
        message.setText(
            "Hello,\n\n" +
            "Great news! Your item \"" +
            itemTitle +
            "\" has been marked as recovered.\n\n" +
            "Please log in to your account to view the details and arrange collection.\n\n" +
            "Regards,\nFindItNow Team"
        );

        mailSender.send(message);
    }
}
