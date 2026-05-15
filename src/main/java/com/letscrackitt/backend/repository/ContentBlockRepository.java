package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.ContentBlock;
import com.letscrackitt.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentBlockRepository
        extends JpaRepository<ContentBlock, Long> {

    List<ContentBlock> findByLessonOrderByDisplayOrderAsc(Lesson lesson);
}
