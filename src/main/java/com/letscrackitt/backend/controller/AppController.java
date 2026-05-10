package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.entity.Comment;
import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.repository.CommentRepository;
import com.letscrackitt.backend.repository.NoteRepository;
import com.letscrackitt.backend.repository.TopicRepository;
import com.letscrackitt.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AppController {

    private final UserRepository userRepository;
    private final NoteRepository noteRepository;
    private final TopicRepository topicRepository;
    private final CommentRepository commentRepository;

    @GetMapping("/api/progress")
    public Map<String, Object> progress(Principal principal) {

        User user = currentUser(principal);

        int totalNotes = (int) noteRepository.count();

        return Map.of(
                "completedNotes", 0,
                "totalNotes", totalNotes,
                "weeklyXp", List.of(
                        Map.of(
                                "day", "Today",
                                "xp", user.getXpPoints()
                        )
                ),
                "topicProgress", topicRepository.findAll().stream()
                        .map(topic -> Map.of(
                                "slug", topic.getSlug(),
                                "title", topic.getTitle(),
                                "icon", topic.getIcon(),
                                "completed", 0,
                                "total", noteRepository.findAll().stream()
                                        .filter(note ->
                                                note.getTopic() != null &&
                                                        note.getTopic().getId().equals(topic.getId()))
                                        .count()
                        ))
                        .toList(),
                "achievements", List.of(),
                "bookmarks", List.of()
        );
    }

    @PostMapping("/api/progress/note/{noteId}/complete")
    public Map<String, Object> completeNote(
            @PathVariable Long noteId,
            Principal principal
    ) {

        User user = currentUser(principal);

        Note note = noteRepository.findById(noteId).orElseThrow();

        int xp = note.getXpReward() == null
                ? 10
                : note.getXpReward();

        user.setXpPoints(user.getXpPoints() + xp);

        userRepository.save(user);

        return Map.of(
                "completed", true,
                "xpEarned", xp,
                "xpPoints", user.getXpPoints()
        );
    }

    @GetMapping("/api/bookmarks")
    public List<Map<String, Object>> bookmarks() {
        return List.of();
    }

    @PostMapping("/api/bookmarks/{noteId}")
    public Map<String, Object> toggleBookmark(
            @PathVariable Long noteId
    ) {

        return Map.of(
                "bookmarked", true,
                "noteId", noteId
        );
    }

    @GetMapping("/api/notes/{noteId}/comments")
    public List<Map<String, Object>> comments(
            @PathVariable Long noteId
    ) {

        return commentRepository.findAll().stream()
                .filter(comment ->
                        comment.getNote() != null &&
                                comment.getNote().getId().equals(noteId))
                .map(comment -> {

                    Map<String, Object> response =
                            new HashMap<>();

                    response.put("id", comment.getId());

                    response.put(
                            "body",
                            comment.getBody()
                    );

                    response.put(
                            "username",
                            comment.getUser() == null
                                    ? "Learner"
                                    : comment.getUser().getFullName()
                    );

                    response.put(
                            "createdAt",
                            comment.getCreatedAt()
                    );

                    return response;
                })
                .toList();
    }

    @PostMapping("/api/notes/{noteId}/comments")
    public Map<String, Object> addComment(
            @PathVariable Long noteId,
            @RequestBody Map<String, String> request,
            Principal principal
    ) {

        User user = currentUser(principal);

        Note note = noteRepository.findById(noteId)
                .orElseThrow();

        Comment comment = Comment.builder()
                .body(request.getOrDefault("body", ""))
                .note(note)
                .user(user)
                .build();

        Comment saved = commentRepository.save(comment);

        return Map.of(
                "id", saved.getId(),
                "body", saved.getBody(),
                "username", user.getFullName()
        );
    }

    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id
    ) {

        commentRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/leaderboard")
    public Map<String, Object> leaderboard() {

        List<Map<String, Object>> users =
                userRepository.findAll().stream()
                        .sorted(
                                Comparator.comparingInt(
                                        User::getXpPoints
                                ).reversed()
                        )
                        .limit(10)
                        .map(user -> {

                            Map<String, Object> response =
                                    new HashMap<>();

                            response.put(
                                    "id",
                                    user.getId()
                            );

                            response.put(
                                    "username",
                                    user.getFullName()
                            );

                            response.put(
                                    "xpPoints",
                                    user.getXpPoints()
                            );

                            return response;
                        })
                        .toList();

        return Map.of("data", users);
    }

    @GetMapping("/api/search")
    public Map<String, Object> search(
            @RequestParam(defaultValue = "") String q
    ) {

        String query = q.toLowerCase();

        List<Map<String, Object>> results =
                noteRepository.findAll().stream()
                        .filter(note ->
                                note.getTitle().toLowerCase().contains(query)
                                        || note.getContent().toLowerCase().contains(query)
                        )
                        .map(note -> {

                            Map<String, Object> response =
                                    new HashMap<>();

                            response.put("id", note.getId());

                            response.put("title", note.getTitle());

                            response.put("slug", note.getSlug());

                            response.put(
                                    "excerpt",
                                    note.getContent().length() > 160
                                            ? note.getContent().substring(0, 160)
                                            : note.getContent()
                            );

                            return response;
                        })
                        .toList();

        return Map.of("data", results);
    }

    @GetMapping("/api/quiz/{id}")
    public Map<String, Object> quiz(
            @PathVariable Long id
    ) {

        return Map.of(
                "data",
                Map.of(
                        "id", id,
                        "title", "Quiz coming soon",
                        "questions", List.of()
                )
        );
    }

    @GetMapping("/api/quiz/topic/{topicId}")
    public Map<String, Object> topicQuiz(
            @PathVariable Long topicId
    ) {

        return Map.of(
                "data",
                Map.of(
                        "id", topicId,
                        "title", "Topic quiz coming soon",
                        "questions", List.of()
                )
        );
    }

    private User currentUser(
            Principal principal
    ) {

        return userRepository
                .findByEmail(
                        principal.getName()
                )
                .orElseThrow();
    }
}