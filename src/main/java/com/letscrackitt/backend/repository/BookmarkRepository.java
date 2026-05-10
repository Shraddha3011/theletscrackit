package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Bookmark;
import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Optional<Bookmark> findByUserAndNote(User user, Note note);
    List<Bookmark> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndNote(User user, Note note);
}