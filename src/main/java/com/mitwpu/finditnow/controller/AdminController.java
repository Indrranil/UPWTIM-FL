package com.mitwpu.finditnow.controller;

import com.mitwpu.finditnow.model.Claim;
import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.Report;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.service.AdminService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Item management
    @GetMapping("/items")
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(adminService.getAllItems());
    }

    @PutMapping("/items/{id}/status")
    public ResponseEntity<Item> updateItemStatus(
        @PathVariable String id,
        @RequestBody Map<String, String> statusUpdate
    ) {
        return ResponseEntity.ok(
            adminService.updateItemStatus(id, statusUpdate.get("status"))
        );
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable String id) {
        adminService.removeItem(id);
        return ResponseEntity.ok().build();
    }

    // User management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Claim management
    @GetMapping("/claims")
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(adminService.getAllClaims());
    }

    @PutMapping("/claims/{id}")
    public ResponseEntity<Claim> updateClaimStatus(
        @PathVariable String id,
        @RequestBody Map<String, String> update
    ) {
        return ResponseEntity.ok(
            adminService.updateClaimStatus(
                id,
                update.get("status"),
                update.get("notes")
            )
        );
    }

    // Report management
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(adminService.getAllReports());
    }

    @GetMapping("/reports/pending")
    public ResponseEntity<List<Report>> getPendingReports() {
        return ResponseEntity.ok(adminService.getPendingReports());
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<Report> getReport(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getReport(id));
    }

    @PutMapping("/reports/{id}")
    public ResponseEntity<Report> updateReport(
        @PathVariable String id,
        @RequestBody Map<String, String> update
    ) {
        return ResponseEntity.ok(
            adminService.updateReport(
                id,
                update.get("status"),
                update.get("adminNotes")
            )
        );
    }

    // Analytics
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
