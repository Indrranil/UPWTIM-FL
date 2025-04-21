package com.mitwpu.finditnow.service;

import com.mitwpu.finditnow.exception.ResourceNotFoundException;
import com.mitwpu.finditnow.model.Claim;
import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.ClaimRepository;
import com.mitwpu.finditnow.repository.ItemRepository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(String id) {
        return itemRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Item not found with id: " + id)
            );
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
            throw new IllegalArgumentException(
                "You are not authorized to update this item"
            );
        }

        // Update the fields
        existingItem.setTitle(
            updatedItem.getTitle() != null
                ? updatedItem.getTitle()
                : existingItem.getTitle()
        );
        existingItem.setDescription(
            updatedItem.getDescription() != null
                ? updatedItem.getDescription()
                : existingItem.getDescription()
        );
        existingItem.setImageUrl(
            updatedItem.getImageUrl() != null
                ? updatedItem.getImageUrl()
                : existingItem.getImageUrl()
        );
        existingItem.setCategory(
            updatedItem.getCategory() != null
                ? updatedItem.getCategory()
                : existingItem.getCategory()
        );
        existingItem.setDate(
            updatedItem.getDate() != null
                ? updatedItem.getDate()
                : existingItem.getDate()
        );
        existingItem.setLocation(
            updatedItem.getLocation() != null
                ? updatedItem.getLocation()
                : existingItem.getLocation()
        );
        existingItem.setStatus(
            updatedItem.getStatus() != null
                ? updatedItem.getStatus()
                : existingItem.getStatus()
        );
        existingItem.setType(
            updatedItem.getType() != null
                ? updatedItem.getType()
                : existingItem.getType()
        );
        existingItem.setSecretQuestion(
            updatedItem.getSecretQuestion() != null
                ? updatedItem.getSecretQuestion()
                : existingItem.getSecretQuestion()
        );
        existingItem.setSecretAnswer(
            updatedItem.getSecretAnswer() != null
                ? updatedItem.getSecretAnswer()
                : existingItem.getSecretAnswer()
        );
        existingItem.setUpdatedAt(LocalDateTime.now());

        return itemRepository.save(existingItem);
    }

    public Item updateItemStatus(String id, String status) {
        Item existingItem = getItemById(id);
        String userId = getCurrentUserId();

        // Check if the current user is the owner of the item
        if (!existingItem.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                "You are not authorized to update this item"
            );
        }

        // For recovered status, check if there's an approved claim
        if (status.equals("recovered")) {
            List<Claim> claims = claimRepository.findByItemId(id);
            boolean hasApprovedClaim = claims
                .stream()
                .anyMatch(claim -> claim.getStatus().equals("approved"));

            if (!hasApprovedClaim) {
                throw new IllegalArgumentException(
                    "Cannot mark as recovered without an approved claim"
                );
            }
        }

        // Valid statuses
        if (
            !status.equals("lost") &&
            !status.equals("found") &&
            !status.equals("recovered")
        ) {
            throw new IllegalArgumentException(
                "Invalid status. Must be 'lost', 'found', or 'recovered'"
            );
        }

        existingItem.setStatus(status);
        existingItem.setUpdatedAt(LocalDateTime.now());

        return itemRepository.save(existingItem);
    }

    public void deleteItem(String id) {
        Item existingItem = getItemById(id);
        String userId = getCurrentUserId();

        // Check if the current user is the owner of the item
        if (!existingItem.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                "You are not authorized to delete this item"
            );
        }

        itemRepository.deleteById(id);
    }

    public List<Item> findMatchingItems(String itemId) {
        // Get the item for which we want to find matches
        Item targetItem = getItemById(itemId);

        // If the item is not lost or found, don't try to match
        if (
            !targetItem.getStatus().equals("lost") &&
            !targetItem.getStatus().equals("found")
        ) {
            return new ArrayList<>();
        }

        // Get items with opposite status
        String oppositeStatus = targetItem.getStatus().equals("lost")
            ? "found"
            : "lost";
        List<Item> potentialMatches = itemRepository
            .findAll()
            .stream()
            .filter(item -> !item.getId().equals(itemId)) // Don't match with itself
            .filter(item -> item.getStatus().equals(oppositeStatus)) // Match opposite status
            .filter(item -> item.getCategory().equals(targetItem.getCategory())) // Same category
            .collect(Collectors.toList());

        // Calculate match score for each potential match
        List<ItemMatch> scoredMatches = new ArrayList<>();

        for (Item item : potentialMatches) {
            double score = calculateMatchScore(targetItem, item);
            if (score > 0.4) { // Only consider items with at least 40% match
                scoredMatches.add(new ItemMatch(item, score));
            }
        }

        // Sort matches by score (highest first) and return the top 5
        return scoredMatches
            .stream()
            .sorted(Comparator.comparing(ItemMatch::getScore).reversed())
            .limit(5)
            .map(ItemMatch::getItem)
            .collect(Collectors.toList());
    }

    // Add the missing method that's being called in ItemController
    public List<Item> getMatchingItems(String itemId) {
        return findMatchingItems(itemId);
    }

    private double calculateMatchScore(Item targetItem, Item potentialMatch) {
        double score = 0.0;
        double totalWeight = 0.0;

        // Category match (highest weight)
        if (targetItem.getCategory().equals(potentialMatch.getCategory())) {
            score += 0.3;
        }
        totalWeight += 0.3;

        // Location match
        if (
            targetItem.getLocation() != null &&
            potentialMatch.getLocation() != null &&
            targetItem.getLocation().equals(potentialMatch.getLocation())
        ) {
            score += 0.2;
        }
        totalWeight += 0.2;

        // Date proximity (within 5 days)
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
                "yyyy-MM-dd"
            );
            LocalDateTime targetDate = LocalDateTime.parse(
                targetItem.getDate(),
                formatter
            );
            LocalDateTime matchDate = LocalDateTime.parse(
                potentialMatch.getDate(),
                formatter
            );

            long daysBetween = Math.abs(
                targetDate.toLocalDate().toEpochDay() -
                matchDate.toLocalDate().toEpochDay()
            );
            if (daysBetween <= 5) {
                score += 0.15 * (1.0 - (daysBetween / 5.0));
            }
        } catch (Exception e) {
            // If date parsing fails, skip this score component
        }
        totalWeight += 0.15;

        // Title similarity
        String targetTitle = targetItem.getTitle().toLowerCase();
        String matchTitle = potentialMatch.getTitle().toLowerCase();
        double titleSimilarity = calculateTextSimilarity(
            targetTitle,
            matchTitle
        );
        score += 0.2 * titleSimilarity;
        totalWeight += 0.2;

        // Description similarity
        String targetDesc = targetItem.getDescription().toLowerCase();
        String matchDesc = potentialMatch.getDescription().toLowerCase();
        double descSimilarity = calculateTextSimilarity(targetDesc, matchDesc);
        score += 0.15 * descSimilarity;
        totalWeight += 0.15;

        // Normalize score
        return score / totalWeight;
    }

    private double calculateTextSimilarity(String text1, String text2) {
        // Simple word overlap similarity
        String[] words1 = text1.split("\\s+");
        String[] words2 = text2.split("\\s+");

        int matches = 0;
        for (String word1 : words1) {
            if (word1.length() <= 3) continue; // Skip short words

            for (String word2 : words2) {
                if (
                    word1.equals(word2) ||
                    (word1.length() > 4 && word2.contains(word1)) ||
                    (word2.length() > 4 && word1.contains(word2))
                ) {
                    matches++;
                    break;
                }
            }
        }

        return (double) matches / Math.max(words1.length, 1);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }

    // Helper class for item matching
    private static class ItemMatch {

        private final Item item;
        private final double score;

        public ItemMatch(Item item, double score) {
            this.item = item;
            this.score = score;
        }

        public Item getItem() {
            return item;
        }

        public double getScore() {
            return score;
        }
    }
}
