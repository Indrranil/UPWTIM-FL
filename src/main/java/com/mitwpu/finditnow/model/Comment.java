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
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String itemId;
    private String userId;
    private String userName;
    private String text;
    private String content; // Added for compatibility with frontend
    private String imageUrl;

    private LocalDateTime createdAt;

    // Add explicit getters and setters for the content field
    public String getContent() {
        return this.text; // Map content to text for backward compatibility
    }

    public void setContent(String content) {
        this.text = content;
    }
}
