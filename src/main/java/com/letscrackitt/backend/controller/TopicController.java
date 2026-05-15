package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.repository.CourseRepository;
import com.letscrackitt.backend.repository.QuizRepository;
import com.letscrackitt.backend.service.TopicService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TopicController {

    private final TopicService topicService;

    private final CourseRepository courseRepository;

    private final QuizRepository quizRepository;

    @GetMapping
    public List<Map<String, Object>> getAll() {

        return topicService.getAllTopics()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getBySlug(
            @PathVariable String slug
    ) {

        return topicService.getBySlug(slug)

                .map(topic ->
                        ResponseEntity.ok(
                                toResponse(topic)
                        )
                )

                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Map<String, Object> create(
            @RequestBody Topic topic
    ) {

        return toResponse(
                topicService.createTopic(topic)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long id,
            @RequestBody Topic topic
    ) {

        return topicService.updateTopic(id, topic)

                .map(updated ->
                        ResponseEntity.ok(
                                toResponse(updated)
                        )
                )

                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        if (!topicService.deleteTopic(id)) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toResponse(
            Topic topic
    ) {

        String slug =
                topic.getSlug() != null &&
                        !topic.getSlug().isBlank()

                        ? topic.getSlug()

                        : slugify(topic.getTitle());

        return Map.of(

                "id", topic.getId(),

                "slug", slug,

                "title", topic.getTitle(),

                "category",
                topic.getCategory() == null
                        ? ""
                        : topic.getCategory(),

                "description",
                topic.getDescription() == null
                        ? ""
                        : topic.getDescription(),

                "icon",
                topic.getIcon() == null
                        ? ""
                        : topic.getIcon(),

                "color",
                topic.getColor() == null
                        ? ""
                        : topic.getColor(),

                "moduleCount",
                courseRepository.countModulesByTopicId(topic.getId()),

                "subtopicCount",
                courseRepository.countLessonsByTopicId(topic.getId()),

                "quizCount",
                quizRepository.countByTopicId(topic.getId())
        );
    }

    private String slugify(
            String value
    ) {

        return value == null

                ? ""

                : value.toLowerCase()
                  .trim()
                  .replaceAll("[^a-z0-9]+", "-")
                  .replaceAll("(^-|-$)", "");
    }
}