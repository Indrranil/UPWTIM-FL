
package com.mitwpu.finditnow.repository;

import com.mitwpu.finditnow.model.Claim;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClaimRepository extends MongoRepository<Claim, String> {
    List<Claim> findByClaimantId(String claimantId);
    List<Claim> findByItemId(String itemId);
}
