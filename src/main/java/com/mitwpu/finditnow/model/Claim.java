
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
@Document(collection = "claims")
public class Claim {
    @Id
    private String id;
    
    private String itemId;
    
    private String claimantId;
    
    private String answer;
    
    private String justification;
    
    private String proofImageUrl;
    
    private String status; // "pending", "approved", "rejected"
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
