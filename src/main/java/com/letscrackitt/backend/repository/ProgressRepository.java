package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.Progress;
import com.letscrackitt.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    Optional<Progress> findByUserAndNote(User user, Note note);
    List<Progress> findByUser(User user);
    long countByUserAndCompletedTrue(User user);

    @Query("SELECT p FROM Progress p JOIN FETCH p.note n JOIN FETCH n.topic " +
            "WHERE p.user = :user AND p.completed = true")
    List<Progress> findCompletedByUser(@Param("user") User user);
}