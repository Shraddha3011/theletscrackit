package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.entity.Xptransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface XpTransactionRepository extends JpaRepository<Xptransaction, Long> {
    List<Xptransaction> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndSourceAndSourceId(User user, String source, Long sourceId);
    List<Xptransaction> findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );
}
