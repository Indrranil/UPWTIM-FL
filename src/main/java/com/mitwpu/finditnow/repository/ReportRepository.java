package com.mitwpu.finditnow.repository;

import com.mitwpu.finditnow.model.Report;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportRepository extends MongoRepository<Report, String> {
    List<Report> findByItemId(String itemId);
    List<Report> findByReporterId(String reporterId);
    List<Report> findByStatus(String status);
}
