
package com.mitwpu.finditnow.service;

import com.mitwpu.finditnow.exception.ResourceNotFoundException;
import com.mitwpu.finditnow.model.Claim;
import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.ClaimRepository;
import com.mitwpu.finditnow.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim getClaimById(String id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));
    }

    public List<Claim> getUserClaims() {
        String userId = getCurrentUserId();
        return claimRepository.findByClaimantId(userId);
    }

    public List<Claim> getItemClaims(String itemId) {
        // Verify item exists
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));
        
        // Check if the current user is the owner of the item
        String userId = getCurrentUserId();
        if (!item.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to view claims for this item");
        }
        
        return claimRepository.findByItemId(itemId);
    }

    public Claim createClaim(Claim claim) {
        String userId = getCurrentUserId();
        
        // Verify the item exists
        itemRepository.findById(claim.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + claim.getItemId()));
        
        claim.setClaimantId(userId);
        claim.setStatus("pending");
        claim.setCreatedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());
        
        return claimRepository.save(claim);
    }

    public Claim updateClaimStatus(String id, String status) {
        Claim existingClaim = getClaimById(id);
        String userId = getCurrentUserId();
        
        // Get the item to check if the current user is the owner
        Item item = itemRepository.findById(existingClaim.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + existingClaim.getItemId()));
        
        // Only the item owner can update the claim status
        if (!item.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to update this claim");
        }
        
        // Validate status
        if (!status.equals("approved") && !status.equals("rejected") && !status.equals("pending")) {
            throw new IllegalArgumentException("Invalid status value. Must be 'approved', 'rejected', or 'pending'");
        }
        
        existingClaim.setStatus(status);
        existingClaim.setUpdatedAt(LocalDateTime.now());
        
        return claimRepository.save(existingClaim);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
