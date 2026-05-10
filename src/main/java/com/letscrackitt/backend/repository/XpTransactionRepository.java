package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.entity.Xptransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XpTransactionRepository extends JpaRepository<Xptransaction, Long> {
    List<Xptransaction> findByUserOrderByCreatedAtDesc(User user);
}