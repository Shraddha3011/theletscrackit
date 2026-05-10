package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.entity.enums.Difficulty;
import com.letscrackitt.backend.repository.NoteRepository;
import com.letscrackitt.backend.repository.TopicRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteRepository noteRepository;
    private final TopicRepository topicRepository;

    @GetMapping
    public List<Map<String, Object>> getNotes(
            @RequestParam(required = false) Long topic,
            @RequestParam(required = false) String difficulty
    ) {

        return noteRepository.findAll().stream()

                .filter(note ->
                        topic == null ||
                                note.getTopic().getId().equals(topic)
                )

                .filter(note ->
                        difficulty == null ||
                                note.getDifficulty().name().equalsIgnoreCase(difficulty)
                )

                .map(this::toResponse)

                .toList();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getBySlug(
            @PathVariable String slug
    ) {

        return noteRepository.findBySlug(slug)

                .or(() ->
                        noteRepository.findAll().stream()
                                .filter(note ->
                                        slugify(note.getTitle()).equals(slug)
                                )
                                .findFirst()
                )

                .map(note -> {

                    note.setViewCount(
                            (note.getViewCount() == null ? 0 : note.getViewCount()) + 1
                    );

                    noteRepository.save(note);

                    return ResponseEntity.ok(
                            toResponse(note)
                    );
                })

                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
            @RequestBody Map<String, Object> request
    ) {

        Long topicId =
                Long.valueOf(
                        String.valueOf(request.get("topicId"))
                );

        Topic topic =
                topicRepository.findById(topicId)
                        .orElseThrow();

        String title =
                String.valueOf(request.get("title"));

        Note note = Note.builder()

                .title(title)

                .slug(
                        String.valueOf(
                                request.getOrDefault(
                                        "slug",
                                        slugify(title)
                                )
                        )
                )

                .content(
                        String.valueOf(
                                request.getOrDefault(
                                        "content",
                                        ""
                                )
                        )
                )

                .difficulty(
                        Difficulty.valueOf(
                                String.valueOf(
                                        request.getOrDefault(
                                                "difficulty",
                                                "BEGINNER"
                                        )
                                ).toUpperCase()
                        )
                )

                .tags(
                        String.valueOf(
                                request.getOrDefault(
                                        "tags",
                                        ""
                                )
                        )
                )

                .xpReward(
                        Integer.valueOf(
                                String.valueOf(
                                        request.getOrDefault(
                                                "xpReward",
                                                10
                                        )
                                )
                        )
                )

                .viewCount(0)

                .topic(topic)

                .build();

        return ResponseEntity.ok(
                toResponse(
                        noteRepository.save(note)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request
    ) {

        return noteRepository.findById(id)

                .map(note -> {

                    Long topicId =
                            Long.valueOf(
                                    String.valueOf(
                                            request.get("topicId")
                                    )
                            );

                    Topic topic =
                            topicRepository.findById(topicId)
                                    .orElseThrow();

                    String title =
                            String.valueOf(
                                    request.get("title")
                            );

                    note.setTitle(title);

                    note.setSlug(
                            String.valueOf(
                                    request.getOrDefault(
                                            "slug",
                                            slugify(title)
                                    )
                            )
                    );

                    note.setContent(
                            String.valueOf(
                                    request.getOrDefault(
                                            "content",
                                            ""
                                    )
                            )
                    );

                    note.setDifficulty(
                            Difficulty.valueOf(
                                    String.valueOf(
                                            request.getOrDefault(
                                                    "difficulty",
                                                    "BEGINNER"
                                            )
                                    ).toUpperCase()
                            )
                    );

                    note.setTags(
                            String.valueOf(
                                    request.getOrDefault(
                                            "tags",
                                            ""
                                    )
                            )
                    );

                    note.setXpReward(
                            Integer.valueOf(
                                    String.valueOf(
                                            request.getOrDefault(
                                                    "xpReward",
                                                    10
                                            )
                                    )
                            )
                    );

                    note.setTopic(topic);

                    return ResponseEntity.ok(
                            toResponse(
                                    noteRepository.save(note)
                            )
                    );
                })

                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id
    ) {

        return noteRepository.findById(id)

                .map(note -> {

                    noteRepository.delete(note);

                    return ResponseEntity.ok().build();
                })

                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toResponse(Note note) {

        Topic topic = note.getTopic();

        String slug =
                note.getSlug() != null &&
                        !note.getSlug().isBlank()

                        ? note.getSlug()

                        : slugify(note.getTitle());

        String topicSlug =
                topic.getSlug() != null &&
                        !topic.getSlug().isBlank()

                        ? topic.getSlug()

                        : slugify(topic.getTitle());

        Map<String, Object> response = new HashMap<>();

        response.put("id", note.getId());
        response.put("title", note.getTitle());
        response.put("slug", slug);
        response.put("content", note.getContent());

        response.put(
                "difficulty",
                note.getDifficulty() == null
                        ? "BEGINNER"
                        : note.getDifficulty().name()
        );

        response.put("tags", tags(note.getTags()));

        response.put(
                "xpReward",
                note.getXpReward() == null
                        ? 10
                        : note.getXpReward()
        );

        response.put(
                "viewCount",
                note.getViewCount() == null
                        ? 0
                        : note.getViewCount()
        );

        response.put("createdAt", note.getCreatedAt());

        response.put("topicId", topic.getId());
        response.put("topicSlug", topicSlug);
        response.put("topicTitle", topic.getTitle());

        return response;
    }

    private List<String> tags(String tags) {

        if (tags == null || tags.isBlank()) {
            return List.of();
        }

        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isBlank())
                .toList();
    }

    private String slugify(String value) {

        return value == null

                ? ""

                : value.toLowerCase()
                  .trim()
                  .replaceAll("[^a-z0-9]+", "-")
                  .replaceAll("(^-|-$)", "");
    }
}