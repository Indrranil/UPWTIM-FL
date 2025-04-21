package com.mitwpu.finditnow.controller;

import com.mitwpu.finditnow.model.Report;
import com.mitwpu.finditnow.service.AdminService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final AdminService adminService;

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        return ResponseEntity.ok(adminService.createReport(report));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Report>> getUserReports() {
        // This method would need to be added to AdminService to get reports by current user
        // For now, we'll leave this as a placeholder
        return ResponseEntity.ok(List.of());
    }
}
