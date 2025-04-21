package com.mitwpu.finditnow.controller;

import com.mitwpu.finditnow.dto.AuthRequest;
import com.mitwpu.finditnow.dto.AuthResponse;
import com.mitwpu.finditnow.dto.EmailVerificationRequest;
import com.mitwpu.finditnow.dto.RegisterRequest;
import com.mitwpu.finditnow.dto.UserDTO;
import com.mitwpu.finditnow.service.AuthService;
import com.mitwpu.finditnow.service.EmailService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody AuthRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(
        @RequestBody Map<String, String> request
    ) {
        String email = request.get("email");
        emailService.sendOtp(email);
        return ResponseEntity.ok(
            Map.of("message", "OTP sent successfully", "email", email)
        );
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Boolean>> verifyEmail(
        @RequestBody EmailVerificationRequest request
    ) {
        boolean isValid = emailService.verifyOtp(
            request.getEmail(),
            request.getOtp()
        );
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // JWT tokens are stateless, so we don't need to do anything on the server
        // The client should remove the token
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}
