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
@Document(collection = "items")
public class Item {

    @Id
    private String id;

    private String userId;
    private String title;
    private String description;
    private String category;
    private String type; // Added type field - lost/found
    private String status; // lost, found, recovered
    private String location;
    private String date; // Date the item was lost/found
    private String imageUrl;

    // Security question/answer for verification
    private String secretQuestion;
    private String secretAnswer;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Add these getters and setters explicitly to ensure they're available
    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getSecretQuestion() {
        return this.secretQuestion;
    }

    public void setSecretQuestion(String secretQuestion) {
        this.secretQuestion = secretQuestion;
    }

    public String getSecretAnswer() {
        return this.secretAnswer;
    }

    public void setSecretAnswer(String secretAnswer) {
        this.secretAnswer = secretAnswer;
    }
}
