package com.mitwpu.finditnow.controller;

import com.mitwpu.finditnow.model.Comment;
import com.mitwpu.finditnow.service.CommentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Comment>> getItemComments(
        @PathVariable String itemId
    ) {
        return ResponseEntity.ok(commentService.getItemComments(itemId));
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.createComment(comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
