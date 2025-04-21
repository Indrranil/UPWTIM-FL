package com.mitwpu.finditnow.controller;

import com.mitwpu.finditnow.model.Claim;
import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.ItemRepository;
import com.mitwpu.finditnow.repository.UserRepository;
import com.mitwpu.finditnow.service.ClaimService;
import com.mitwpu.finditnow.service.EmailService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaim(@PathVariable String id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Claim>> getClaimsByItem(
        @PathVariable String itemId
    ) {
        return ResponseEntity.ok(claimService.getItemClaims(itemId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Claim>> getUserClaims() {
        return ResponseEntity.ok(claimService.getUserClaims());
    }

    @PostMapping
    public ResponseEntity<Claim> createClaim(
        @RequestBody Map<String, String> claimData
    ) {
        String itemId = claimData.get("itemId");
        String description = claimData.get("description");
        String proofUrl = claimData.get("proofUrl");

        Claim claim = Claim.builder()
            .itemId(itemId)
            .justification(description) // if 'description' refers to user's justification
            .proofImageUrl(proofUrl)
            .build();

        Claim newClaim = claimService.createClaim(claim);

        // Send email notification to the item owner
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item != null) {
            User owner = userRepository.findById(item.getUserId()).orElse(null);
            User claimant = userRepository
                .findById(newClaim.getClaimantId())
                .orElse(null);

            if (owner != null && claimant != null) {
                // Check notification preferences
                Map<String, Boolean> preferences =
                    emailService.getNotificationPreferences(owner.getId());
                if (preferences.getOrDefault("claimReceived", true)) {
                    emailService.sendClaimReceivedNotification(
                        owner.getEmail(),
                        item.getTitle(),
                        claimant.getName()
                    );
                }
            }
        }

        return ResponseEntity.ok(newClaim);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Claim> updateClaim(
        @PathVariable String id,
        @RequestBody Map<String, String> updateData
    ) {
        String status = updateData.get("status");
        String notes = updateData.get("notes");

        Claim updatedClaim = claimService.updateClaim(
            id,
            status,
            (String) null
        );

        // Send email notification to the claimant
        User claimant = userRepository
            .findById(updatedClaim.getClaimantId())
            .orElse(null);
        Item item = itemRepository
            .findById(updatedClaim.getItemId())
            .orElse(null);

        if (claimant != null && item != null) {
            // Check notification preferences
            Map<String, Boolean> preferences =
                emailService.getNotificationPreferences(claimant.getId());
            if (preferences.getOrDefault("claimUpdated", true)) {
                emailService.sendClaimStatusNotification(
                    claimant.getEmail(),
                    item.getTitle(),
                    status
                );
            }

            // If claim was approved, also notify about item recovery
            if ("approved".equalsIgnoreCase(status)) {
                User owner = userRepository
                    .findById(item.getUserId())
                    .orElse(null);
                if (owner != null) {
                    Map<String, Boolean> ownerPreferences =
                        emailService.getNotificationPreferences(owner.getId());
                    if (ownerPreferences.getOrDefault("itemRecovered", true)) {
                        emailService.sendItemRecoveredNotification(
                            owner.getEmail(),
                            item.getTitle()
                        );
                    }
                }
            }
        }

        return ResponseEntity.ok(updatedClaim);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable String id) {
        claimService.deleteClaim(id);
        return ResponseEntity.ok().build();
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
