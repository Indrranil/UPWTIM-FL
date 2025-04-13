
package com.mitwpu.finditnow.repository;

import com.mitwpu.finditnow.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByUserId(String userId);
}
