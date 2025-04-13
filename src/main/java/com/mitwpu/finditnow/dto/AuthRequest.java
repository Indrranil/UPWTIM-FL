
package com.mitwpu.finditnow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Pattern(regexp = ".+@mitwpu\\.edu\\.in$", message = "Email must be a valid MIT-WPU email")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
