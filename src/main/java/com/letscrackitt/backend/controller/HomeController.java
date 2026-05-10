package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.entity.HomeContentItem;
import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class HomeController {

    private final TopicRepository topicRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final HomeContentItemRepository homeContentItemRepository;
    private final QuizRepository quizRepository;

    @GetMapping("/api/home")
    public Map<String, Object> home() {
        List<Topic> topics = topicRepository.findAll().stream()
                .sorted(Comparator.comparing(topic -> topic.getOrderIndex() == null ? 0 : topic.getOrderIndex()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("typedWords", topics.stream().map(topic -> topic.getTitle()).toList());
        response.put("topics", topics.stream().map(this::topicResponse).toList());
        response.put("stats", stats());
        response.put("steps", items("STEP"));
        response.put("features", items("FEATURE"));
        return response;
    }

    private List<Map<String, Object>> stats() {
        return List.of(
                stat("Topics Covered", topicRepository.count()),
                stat("Notes Published", noteRepository.count()),
                stat("Active Learners", userRepository.count()),
                stat("Quiz Questions", questionRepository.count())
        );
    }

    private Map<String, Object> stat(String label, long value) {
        Map<String, Object> stat = new HashMap<>();
        stat.put("label", label);
        stat.put("value", String.valueOf(value));
        stat.put("icon", switch (label) {
            case "Topics Covered" -> "Topics";
            case "Notes Published" -> "Notes";
            case "Active Learners" -> "Users";
            default -> "Quiz";
        });
        return stat;
    }

    private List<Map<String, Object>> items(String section) {
        return homeContentItemRepository.findBySectionOrderByOrderIndexAsc(section).stream()
                .map(this::itemResponse)
                .toList();
    }

    private Map<String, Object> itemResponse(HomeContentItem item) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", item.getId());
        response.put("icon", item.getIcon());
        response.put("title", item.getTitle());
        response.put("desc", item.getDescription());
        response.put("accent", item.getAccent());
        return response;
    }

    private Map<String, Object> topicResponse(Topic topic) {
        String slug = topic.getSlug() != null && !topic.getSlug().isBlank() ? topic.getSlug() : slugify(topic.getTitle());
        Map<String, Object> response = new HashMap<>();
        response.put("id", topic.getId());
        response.put("slug", slug);
        response.put("title", topic.getTitle());
        response.put("category", topic.getCategory() == null ? "" : topic.getCategory());
        response.put("description", topic.getDescription() == null ? "" : topic.getDescription());
        response.put("icon", topic.getIcon() == null ? "" : topic.getIcon());
        response.put("color", topic.getColor() == null ? "" : topic.getColor());
        response.put("noteCount", noteRepository.findByTopicId(topic.getId()).size());
        response.put("quizCount",
                quizRepository.findByTopicId(topic.getId()).size()
        );
        return response;
    }

    private String slugify(String value) {
        return value == null ? "" : value.toLowerCase().trim().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
