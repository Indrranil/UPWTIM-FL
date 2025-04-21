package com.mitwpu.finditnow.controller;

import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.UserRepository;
import com.mitwpu.finditnow.service.EmailService;
import com.mitwpu.finditnow.service.ItemService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItem(@PathVariable String id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Item>> getUserItems() {
        return ResponseEntity.ok(itemService.getUserItems());
    }

    @GetMapping("/match/{id}")
    public ResponseEntity<List<Item>> getMatchingItems(
        @PathVariable String id
    ) {
        return ResponseEntity.ok(itemService.findMatchingItems(id));
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        Item newItem = itemService.createItem(item);

        // Check for potential matches and send notifications
        if (newItem.getStatus().equals("lost")) {
            List<Item> matchingItems = itemService.getMatchingItems(
                newItem.getId()
            );
            if (!matchingItems.isEmpty()) {
                // Notify the user who posted the lost item
                User user = userRepository
                    .findById(newItem.getUserId())
                    .orElse(null);
                if (user != null) {
                    Map<String, Boolean> preferences =
                        emailService.getNotificationPreferences(user.getId());
                    if (preferences.getOrDefault("matchFound", true)) {
                        Item matchedItem = matchingItems.get(0); // Get the top match
                        emailService.sendMatchFoundNotification(
                            user.getEmail(),
                            newItem.getTitle(),
                            matchedItem.getTitle()
                        );
                    }
                }

                // Notify the users who posted matching found items
                for (Item matchedItem : matchingItems) {
                    User matchedUser = userRepository
                        .findById(matchedItem.getUserId())
                        .orElse(null);
                    if (matchedUser != null) {
                        Map<String, Boolean> preferences =
                            emailService.getNotificationPreferences(
                                matchedUser.getId()
                            );
                        if (preferences.getOrDefault("matchFound", true)) {
                            emailService.sendMatchFoundNotification(
                                matchedUser.getEmail(),
                                matchedItem.getTitle(),
                                newItem.getTitle()
                            );
                        }
                    }
                }
            }
        } else if (newItem.getType().equals("found")) {
            List<Item> matchingItems = itemService.getMatchingItems(
                newItem.getId()
            );
            if (!matchingItems.isEmpty()) {
                // Notify the user who posted the found item
                User user = userRepository
                    .findById(newItem.getUserId())
                    .orElse(null);
                if (user != null) {
                    Map<String, Boolean> preferences =
                        emailService.getNotificationPreferences(user.getId());
                    if (preferences.getOrDefault("matchFound", true)) {
                        Item matchedItem = matchingItems.get(0); // Get the top match
                        emailService.sendMatchFoundNotification(
                            user.getEmail(),
                            newItem.getTitle(),
                            matchedItem.getTitle()
                        );
                    }
                }

                // Notify the users who posted matching lost items
                for (Item matchedItem : matchingItems) {
                    User matchedUser = userRepository
                        .findById(matchedItem.getUserId())
                        .orElse(null);
                    if (matchedUser != null) {
                        Map<String, Boolean> preferences =
                            emailService.getNotificationPreferences(
                                matchedUser.getId()
                            );
                        if (preferences.getOrDefault("matchFound", true)) {
                            emailService.sendMatchFoundNotification(
                                matchedUser.getEmail(),
                                matchedItem.getTitle(),
                                newItem.getTitle()
                            );
                        }
                    }
                }
            }
        }

        return ResponseEntity.ok(newItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(
        @PathVariable String id,
        @RequestBody Item item
    ) {
        Item updatedItem = itemService.updateItem(id, item);

        // If item is marked as recovered, notify the owner
        if (updatedItem.getStatus().equals("recovered")) {
            User owner = userRepository
                .findById(updatedItem.getUserId())
                .orElse(null);
            if (owner != null) {
                Map<String, Boolean> preferences =
                    emailService.getNotificationPreferences(owner.getId());
                if (preferences.getOrDefault("itemRecovered", true)) {
                    emailService.sendItemRecoveredNotification(
                        owner.getEmail(),
                        updatedItem.getTitle()
                    );
                }
            }
        }

        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok().build();
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
