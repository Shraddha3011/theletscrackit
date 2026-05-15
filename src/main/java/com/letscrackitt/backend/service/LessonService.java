package com.letscrackitt.backend.service;

import com.letscrackitt.backend.dto.response.BlockResponse;
import com.letscrackitt.backend.dto.response.LessonResponse;
import com.letscrackitt.backend.entity.Lesson;
import com.letscrackitt.backend.repository.LessonRepository;
import com.letscrackitt.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final TopicRepository topicRepository;

    public LessonResponse getLessonBySlug(
            String slug
    ) {

        Lesson lesson = lessonRepository
                .findFirstBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException("Lesson not found"));

        String topicSlug = null;
        if (lesson.getModule() != null && lesson.getModule().getCourse() != null) {
            Long topicId = lesson.getModule().getCourse().getTopicId();
            if (topicId != null) {
                topicSlug = topicRepository.findById(topicId)
                        .map(t -> t.getSlug())
                        .orElse(null);
            }
        }

        return LessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .slug(lesson.getSlug())
                .description(lesson.getDescription())
                .likes(lesson.getLikes() == null ? 0 : lesson.getLikes())
                .topicSlug(topicSlug)
                .blocks(
                        lesson.getBlocks()
                                .stream()

                                .sorted(
                                        Comparator.comparingInt(
                                                b -> b.getDisplayOrder()
                                        )
                                )

                                .map(block ->
                                        BlockResponse.builder()
                                                .id(block.getId())
                                                .type(block.getType().name())
                                                .data(block.getData())
                                                .displayOrder(block.getDisplayOrder())
                                                .build()
                                )

                                .collect(Collectors.toList())
                )

                .build();
    }
}