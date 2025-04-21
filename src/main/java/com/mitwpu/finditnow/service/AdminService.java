package com.mitwpu.finditnow.service;

import com.mitwpu.finditnow.exception.ResourceNotFoundException;
import com.mitwpu.finditnow.model.Claim;
import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.Report;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.ClaimRepository;
import com.mitwpu.finditnow.repository.ItemRepository;
import com.mitwpu.finditnow.repository.ReportRepository;
import com.mitwpu.finditnow.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    // Item moderation
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item updateItemStatus(String id, String status) {
        Item item = itemRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Item not found with id: " + id)
            );

        item.setStatus(status);
        item.setUpdatedAt(LocalDateTime.now());

        return itemRepository.save(item);
    }

    public void removeItem(String id) {
        if (!itemRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                "Item not found with id: " + id
            );
        }

        itemRepository.deleteById(id);
    }

    // User management
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Dispute handling (Claims)
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim updateClaimStatus(String id, String status, String notes) {
        Claim claim = claimRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Claim not found with id: " + id)
            );

        claim.setStatus(status);
        claim.setUpdatedAt(LocalDateTime.now());

        return claimRepository.save(claim);
    }

    // Report handling
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public List<Report> getPendingReports() {
        return reportRepository.findByStatus("pending");
    }

    public Report getReport(String id) {
        return reportRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Report not found with id: " + id)
            );
    }

    public Report createReport(Report report) {
        String currentUserId = getCurrentUserId();

        // Verify the item exists
        itemRepository
            .findById(report.getItemId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Item not found with id: " + report.getItemId()
                )
            );

        report.setReporterId(currentUserId);
        report.setStatus("pending");
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());

        return reportRepository.save(report);
    }

    public Report updateReport(String id, String status, String adminNotes) {
        Report report = reportRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Report not found with id: " + id)
            );

        String currentUserId = getCurrentUserId();

        report.setStatus(status);
        report.setAdminNotes(adminNotes);
        report.setAdminId(currentUserId);
        report.setUpdatedAt(LocalDateTime.now());

        return reportRepository.save(report);
    }

    // Analytics
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        // Count of items by status
        long totalItems = itemRepository.count();
        long lostItems = itemRepository.countByStatus("lost");
        long foundItems = itemRepository.countByStatus("found");

        // Count of claims by status
        long totalClaims = claimRepository.count();
        long pendingClaims = claimRepository.countByStatus("pending");
        long approvedClaims = claimRepository.countByStatus("approved");
        long rejectedClaims = claimRepository.countByStatus("rejected");

        // Count of reports by status
        long totalReports = reportRepository.count();
        long pendingReports = reportRepository.findByStatus("pending").size();
        long resolvedReports = totalReports - pendingReports;

        // User count
        long totalUsers = userRepository.count();

        // Build analytics object
        analytics.put(
            "items",
            Map.of("total", totalItems, "lost", lostItems, "found", foundItems)
        );

        analytics.put(
            "claims",
            Map.of(
                "total",
                totalClaims,
                "pending",
                pendingClaims,
                "approved",
                approvedClaims,
                "rejected",
                rejectedClaims
            )
        );

        analytics.put(
            "reports",
            Map.of(
                "total",
                totalReports,
                "pending",
                pendingReports,
                "resolved",
                resolvedReports
            )
        );

        analytics.put("users", totalUsers);

        return analytics;
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
