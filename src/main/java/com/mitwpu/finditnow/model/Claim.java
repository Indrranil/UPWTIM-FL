package com.mitwpu.finditnow.model;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "claims")
public class Claim {

    @Id
    private String id;

    private String itemId;
    private String claimantId;
    private String claimantName; // Add this for frontend display
    private String status; // pending, approved, rejected
    private String description; // Original description field
    private String justification; // Added for compatibility with frontend
    private String proofUrl;
    private String proofImageUrl; // Added for compatibility with frontend
    private String notes; // Admin notes or rejection reasons
    private String answer; // Answer to secret question if any

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Add explicit getters and setters for the new fields
    public String getJustification() {
        return this.description; // Map justification to description for backward compatibility
    }

    public void setJustification(String justification) {
        this.description = justification;
    }

    public String getProofImageUrl() {
        return this.proofUrl; // Map proofImageUrl to proofUrl for backward compatibility
    }

    public void setProofImageUrl(String proofImageUrl) {
        this.proofUrl = proofImageUrl;
    }

    public String getAnswer() {
        return this.answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
