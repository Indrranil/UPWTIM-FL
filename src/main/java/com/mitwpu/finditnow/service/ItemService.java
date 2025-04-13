
package com.mitwpu.finditnow.service;

import com.mitwpu.finditnow.exception.ResourceNotFoundException;
import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(String id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
    }

    public List<Item> getUserItems() {
        String userId = getCurrentUserId();
        return itemRepository.findByUserId(userId);
    }

    public Item createItem(Item item) {
        String userId = getCurrentUserId();
        
        item.setUserId(userId);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        
        return itemRepository.save(item);
    }

    public Item updateItem(String id, Item updatedItem) {
        Item existingItem = getItemById(id);
        String userId = getCurrentUserId();
        
        // Check if the current user is the owner of the item
        if (!existingItem.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to update this item");
        }
        
        // Update the fields
        existingItem.setTitle(updatedItem.getTitle() != null ? updatedItem.getTitle() : existingItem.getTitle());
        existingItem.setDescription(updatedItem.getDescription() != null ? updatedItem.getDescription() : existingItem.getDescription());
        existingItem.setImageUrl(updatedItem.getImageUrl() != null ? updatedItem.getImageUrl() : existingItem.getImageUrl());
        existingItem.setCategory(updatedItem.getCategory() != null ? updatedItem.getCategory() : existingItem.getCategory());
        existingItem.setDate(updatedItem.getDate() != null ? updatedItem.getDate() : existingItem.getDate());
        existingItem.setLocation(updatedItem.getLocation() != null ? updatedItem.getLocation() : existingItem.getLocation());
        existingItem.setStatus(updatedItem.getStatus() != null ? updatedItem.getStatus() : existingItem.getStatus());
        existingItem.setSecretQuestion(updatedItem.getSecretQuestion() != null ? updatedItem.getSecretQuestion() : existingItem.getSecretQuestion());
        existingItem.setSecretAnswer(updatedItem.getSecretAnswer() != null ? updatedItem.getSecretAnswer() : existingItem.getSecretAnswer());
        existingItem.setUpdatedAt(LocalDateTime.now());
        
        return itemRepository.save(existingItem);
    }

    public void deleteItem(String id) {
        Item existingItem = getItemById(id);
        String userId = getCurrentUserId();
        
        // Check if the current user is the owner of the item
        if (!existingItem.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to delete this item");
        }
        
        itemRepository.deleteById(id);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
