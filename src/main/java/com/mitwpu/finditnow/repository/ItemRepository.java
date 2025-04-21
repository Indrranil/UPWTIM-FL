package com.mitwpu.finditnow.repository;

import com.mitwpu.finditnow.model.Item;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByUserId(String userId);
    long countByStatus(String status);
}
