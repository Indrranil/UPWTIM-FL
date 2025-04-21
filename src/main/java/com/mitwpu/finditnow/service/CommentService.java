package com.mitwpu.finditnow.service;

import com.mitwpu.finditnow.exception.ResourceNotFoundException;
import com.mitwpu.finditnow.model.Claim;
import com.mitwpu.finditnow.model.Comment;
import com.mitwpu.finditnow.model.Item;
import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.ClaimRepository;
import com.mitwpu.finditnow.repository.CommentRepository;
import com.mitwpu.finditnow.repository.ItemRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;

    public List<Comment> getItemComments(String itemId) {
        // Verify that the item exists
        itemRepository
            .findById(itemId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Item not found with id: " + itemId
                )
            );

        return commentRepository.findByItemId(itemId);
    }

    public Comment createComment(Comment comment) {
        String userId = getCurrentUserId();

        // Verify item exists
        Item item = itemRepository
            .findById(comment.getItemId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Item not found with id: " + comment.getItemId()
                )
            );

        // Check if the user is the owner of the item or has an approved claim
        boolean isItemOwner = item.getUserId().equals(userId);
        boolean hasApprovedClaim = claimRepository
            .findByItemIdAndClaimantIdAndStatus(
                comment.getItemId(),
                userId,
                "approved"
            )
            .isPresent();

        // Only the item owner or a user with an approved claim can comment
        if (!isItemOwner && !hasApprovedClaim) {
            throw new IllegalArgumentException(
                "You are not authorized to comment on this item"
            );
        }

        comment.setUserId(userId);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public void deleteComment(String id) {
        String userId = getCurrentUserId();

        Comment comment = commentRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Comment not found with id: " + id
                )
            );

        // Check if the current user is the owner of the comment
        if (!comment.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                "You are not authorized to delete this comment"
            );
        }

        commentRepository.deleteById(id);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
