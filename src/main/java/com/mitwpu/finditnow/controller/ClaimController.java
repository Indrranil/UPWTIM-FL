
package com.mitwpu.finditnow.controller;

import com.mitwpu.finditnow.model.Claim;
import com.mitwpu.finditnow.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @GetMapping
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaimById(@PathVariable String id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Claim>> getUserClaims() {
        return ResponseEntity.ok(claimService.getUserClaims());
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Claim>> getItemClaims(@PathVariable String itemId) {
        return ResponseEntity.ok(claimService.getItemClaims(itemId));
    }

    @PostMapping
    public ResponseEntity<Claim> createClaim(@RequestBody Claim claim) {
        return ResponseEntity.ok(claimService.createClaim(claim));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Claim> updateClaimStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> status) {
        return ResponseEntity.ok(claimService.updateClaimStatus(id, status.get("status")));
    }
}
