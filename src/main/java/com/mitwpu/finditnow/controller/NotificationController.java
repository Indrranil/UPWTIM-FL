package com.mitwpu.finditnow.controller;

import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.service.EmailService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @GetMapping("/preferences")
    public ResponseEntity<Map<String, Boolean>> getNotificationPreferences() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(
            emailService.getNotificationPreferences(userId)
        );
    }

    @PutMapping("/preferences")
    public ResponseEntity<Map<String, Boolean>> updateNotificationPreferences(
        @RequestBody Map<String, Boolean> preferences
    ) {
        String userId = getCurrentUserId();
        emailService.setNotificationPreferences(userId, preferences);
        return ResponseEntity.ok(preferences);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
