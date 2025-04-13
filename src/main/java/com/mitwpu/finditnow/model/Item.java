
package com.mitwpu.finditnow.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "items")
public class Item {
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    private String imageUrl;
    
    private String category;
    
    private String date;
    
    private String location;
    
    private String status; // "lost" or "found"
    
    private String userId;
    
    private String secretQuestion;
    
    private String secretAnswer;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
