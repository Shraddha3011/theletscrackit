package com.letscrackitt.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.letscrackitt.backend.dto.response.CourseResponse;
import com.letscrackitt.backend.dto.response.LessonCardResponse;
import com.letscrackitt.backend.dto.response.ModuleResponse;
import com.letscrackitt.backend.entity.ContentBlock;
import com.letscrackitt.backend.entity.Course;
import com.letscrackitt.backend.entity.Lesson;
import com.letscrackitt.backend.entity.Module;
import com.letscrackitt.backend.entity.enums.BlockType;
import com.letscrackitt.backend.repository.ContentBlockRepository;
import com.letscrackitt.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final ContentBlockRepository contentBlockRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public CourseResponse getCourseBySlug(
            String slug
    ) {

        Course course = courseRepository
                .findBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found"
                        )
                );

        return CourseResponse.builder()

                .id(course.getId())

                .title(course.getTitle())

                .slug(course.getSlug())

                .description(course.getDescription())

                .icon(course.getIcon())

                .color(course.getColor())

                .modules(

                        course.getModules() == null ? List.of() : course.getModules()

                                .stream()

                                .sorted(
                                        Comparator.comparingInt(
                                                Module::getDisplayOrder
                                        )
                                )

                                .map(module ->

                                        ModuleResponse.builder()

                                                .id(module.getId())

                                                .title(module.getTitle())

                                                .displayOrder(
                                                        module.getDisplayOrder()
                                                )

                                                .lessons(

                                                        module.getLessons() == null ? List.of() : module.getLessons()

                                                                .stream()

                                                                .sorted(
                                                                        Comparator.comparingInt(
                                                                                lesson ->
                                                                                        lesson.getDisplayOrder()
                                                                        )
                                                                )

                                                                .map(this::toLessonCard)

                                                                .collect(
                                                                        Collectors.toList()
                                                                )
                                                )

                                                .build()
                                )

                                .collect(Collectors.toList())
                )

                .build();
    }

    private LessonCardResponse toLessonCard(Lesson lesson) {
        Optional<JsonNode> task = readTaskData(lesson);

        return LessonCardResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .slug(lesson.getSlug())
                .description(lesson.getDescription())
                .taskTitle(task.map(node -> text(node, "title")).orElse(null))
                .taskBrief(task.map(node -> text(node, "brief")).orElse(null))
                .projectConnection(task.map(node -> text(node, "projectConnection")).orElse(null))
                .build();
    }

    private Optional<JsonNode> readTaskData(Lesson lesson) {
        return contentBlockRepository.findByLessonOrderByDisplayOrderAsc(lesson)
                .stream()
                .filter(block -> block.getType() == BlockType.TASK || block.getType() == BlockType.PROJECT_STEP)
                .findFirst()
                .flatMap(this::parseData);
    }

    private Optional<JsonNode> parseData(ContentBlock block) {
        try {
            return Optional.of(objectMapper.readTree(block.getData()));
        } catch (Exception ignored) {
            return Optional.empty();
        }
    }

    private String text(JsonNode node, String field) {
        JsonNode value = node.get(field);
        return value == null || value.isNull() ? null : value.asText();
    }
}
