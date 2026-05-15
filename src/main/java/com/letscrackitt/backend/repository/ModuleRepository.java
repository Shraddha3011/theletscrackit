package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository
        extends JpaRepository<Module, Long> {
}