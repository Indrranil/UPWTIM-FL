package com.mitwpu.finditnow.repository;

import com.mitwpu.finditnow.model.Claim;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClaimRepository extends MongoRepository<Claim, String> {
    List<Claim> findByItemId(String itemId);

    List<Claim> findByClaimantId(String claimantId);

    Optional<Claim> findByItemIdAndClaimantIdAndStatus(
        String itemId,
        String claimantId,
        String status
    );

    Optional<Claim> findByItemIdAndStatus(String itemId, String status);
    long countByStatus(String status);
}
