package com.mitwpu.finditnow.repository;

import com.mitwpu.finditnow.model.Comment;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByItemId(String itemId);
}
