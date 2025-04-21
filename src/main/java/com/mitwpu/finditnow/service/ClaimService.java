package com.mitwpu.finditnow.service;

import com.mitwpu.finditnow.exception.ResourceNotFoundException;
import com.mitwpu.finditnow.model.Claim;
import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.ClaimRepository;
import com.mitwpu.finditnow.repository.ItemRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim getClaimById(String id) {
        return claimRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Claim not found with id: " + id)
            );
    }

    public Claim getClaim(String id) {
        return getClaimById(id);
    }

    public List<Claim> getClaimsByItem(String itemId) {
        return getItemClaims(itemId);
    }

    public List<Claim> getUserClaims() {
        String userId = getCurrentUserId();
        return claimRepository.findByClaimantId(userId);
    }

    public List<Claim> getItemClaims(String itemId) {
        // Verify item exists
        Item item = itemRepository
            .findById(itemId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Item not found with id: " + itemId
                )
            );

        // Check if the current user is the owner of the item
        String userId = getCurrentUserId();
        if (!item.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                "You are not authorized to view claims for this item"
            );
        }

        return claimRepository.findByItemId(itemId);
    }

    public Claim getApprovedClaim(String itemId) {
        // Verify item exists
        Item item = itemRepository
            .findById(itemId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Item not found with id: " + itemId
                )
            );

        // Anyone can get the approved claim for an item
        Optional<Claim> approvedClaim = claimRepository.findByItemIdAndStatus(
            itemId,
            "approved"
        );

        return approvedClaim.orElseThrow(() ->
            new ResourceNotFoundException(
                "No approved claim found for item with id: " + itemId
            )
        );
    }

    public Claim createClaim(Claim claim) {
        String userId = getCurrentUserId();

        // Verify the item exists
        itemRepository
            .findById(claim.getItemId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Item not found with id: " + claim.getItemId()
                )
            );

        claim.setClaimantId(userId);
        claim.setStatus("pending");
        claim.setCreatedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());

        return claimRepository.save(claim);
    }

    public Claim updateClaim(String id, String status, String notes) {
        Claim existingClaim = getClaimById(id);
        String userId = getCurrentUserId();

        // Get the item to check if the current user is the owner
        Item item = itemRepository
            .findById(existingClaim.getItemId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Item not found with id: " + existingClaim.getItemId()
                )
            );

        // Only the item owner can update the claim status
        if (!item.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                "You are not authorized to update this claim"
            );
        }

        // Validate status
        if (
            !status.equals("approved") &&
            !status.equals("rejected") &&
            !status.equals("pending")
        ) {
            throw new IllegalArgumentException(
                "Invalid status value. Must be 'approved', 'rejected', or 'pending'"
            );
        }

        existingClaim.setStatus(status);
        if (notes != null && !notes.trim().isEmpty()) {
            existingClaim.setNotes(notes);
        }
        existingClaim.setUpdatedAt(LocalDateTime.now());

        return claimRepository.save(existingClaim);
    }

    public Claim updateClaimStatus(String id, String status) {
        return updateClaim(id, status, null);
    }

    public void deleteClaim(String id) {
        Claim existingClaim = getClaimById(id);
        String userId = getCurrentUserId();

        // Only the claimant can delete their own claim
        if (!existingClaim.getClaimantId().equals(userId)) {
            throw new IllegalArgumentException(
                "You are not authorized to delete this claim"
            );
        }

        // Only pending claims can be deleted
        if (!existingClaim.getStatus().equals("pending")) {
            throw new IllegalArgumentException(
                "Only pending claims can be deleted"
            );
        }

        claimRepository.delete(existingClaim);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
