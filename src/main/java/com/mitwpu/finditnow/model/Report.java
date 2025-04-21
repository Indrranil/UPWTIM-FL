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
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reports")
public class Report {

    @Id
    private String id;

    private String itemId;

    private String reporterId;

    private String reason;

    private String description;

    private String status; // "pending", "approved", "rejected"

    private String adminNotes;

    private String adminId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
