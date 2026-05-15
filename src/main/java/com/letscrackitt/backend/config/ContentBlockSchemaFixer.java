package com.letscrackitt.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(0)
@RequiredArgsConstructor
public class ContentBlockSchemaFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        jdbcTemplate.execute("ALTER TABLE content_block DROP CONSTRAINT IF EXISTS content_block_type_check");
        jdbcTemplate.execute("""
                ALTER TABLE content_block
                ADD CONSTRAINT content_block_type_check
                CHECK (type IN (
                    'TEXT',
                    'CODE',
                    'QUIZ',
                    'TASK',
                    'PROJECT_STEP',
                    'MEMORY_VISUALIZER',
                    'RUNTIME'
                ))
                """);
    }
}
