package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Comment;
import com.letscrackitt.backend.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByNoteAndParentIsNullOrderByCreatedAtDesc(Note note);
    List<Comment> findByParentOrderByCreatedAtAsc(Comment parent);
}