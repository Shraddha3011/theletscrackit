package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.entity.Quiz;
import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.entity.enums.Difficulty;
import com.letscrackitt.backend.repository.QuizRepository;
import com.letscrackitt.backend.repository.TopicRepository;
import com.letscrackitt.backend.repository.UserRepository;
import com.letscrackitt.backend.service.XpService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizRepository quizRepository;

    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final XpService xpService;

    // GET ALL QUIZZES
    @GetMapping
    public List<Map<String, Object>> getQuizzes(
            @RequestParam(required = false) Long topic
    ) {

        List<Quiz> quizzes =
                topic == null
                        ? quizRepository.findAll()
                        : quizRepository.findByTopicId(topic);

        return quizzes.stream()
                .map(this::toResponse)
                .toList();
    }

    // GET QUIZ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id
    ) {

        return quizRepository.findById(id)

                .map(quiz ->
                        ResponseEntity.ok(
                                toResponse(quiz)
                        )
                )

                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE QUIZ
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Map<String, Object> request
    ) {

        Long topicId =
                Long.valueOf(
                        String.valueOf(
                                request.get("topicId")
                        )
                );

        Topic topic =
                topicRepository.findById(topicId)
                        .orElseThrow();

        Quiz quiz = Quiz.builder()

                .question(
                        String.valueOf(
                                request.get("question")
                        )
                )

                .optionA(
                        String.valueOf(
                                request.get("optionA")
                        )
                )

                .optionB(
                        String.valueOf(
                                request.get("optionB")
                        )
                )

                .optionC(
                        String.valueOf(
                                request.get("optionC")
                        )
                )

                .optionD(
                        String.valueOf(
                                request.get("optionD")
                        )
                )

                .correctAnswer(
                        String.valueOf(
                                request.get("correctAnswer")
                        )
                )

                .explanation(
                        String.valueOf(
                                request.getOrDefault(
                                        "explanation",
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

                .xpReward(
                        Integer.valueOf(
                                String.valueOf(
                                        request.getOrDefault(
                                                "xpReward",
                                                5
                                        )
                                )
                        )
                )

                .topic(topic)

                .build();

        return ResponseEntity.ok(
                toResponse(
                        quizRepository.save(quiz)
                )
        );
    }

    // UPDATE QUIZ
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request
    ) {

        return quizRepository.findById(id)

                .map(quiz -> {

                    Long topicId =
                            Long.valueOf(
                                    String.valueOf(
                                            request.get("topicId")
                                    )
                            );

                    Topic topic =
                            topicRepository.findById(topicId)
                                    .orElseThrow();

                    quiz.setQuestion(
                            String.valueOf(
                                    request.get("question")
                            )
                    );

                    quiz.setOptionA(
                            String.valueOf(
                                    request.get("optionA")
                            )
                    );

                    quiz.setOptionB(
                            String.valueOf(
                                    request.get("optionB")
                            )
                    );

                    quiz.setOptionC(
                            String.valueOf(
                                    request.get("optionC")
                            )
                    );

                    quiz.setOptionD(
                            String.valueOf(
                                    request.get("optionD")
                            )
                    );

                    quiz.setCorrectAnswer(
                            String.valueOf(
                                    request.get("correctAnswer")
                            )
                    );

                    quiz.setExplanation(
                            String.valueOf(
                                    request.getOrDefault(
                                            "explanation",
                                            ""
                                    )
                            )
                    );

                    quiz.setDifficulty(
                            Difficulty.valueOf(
                                    String.valueOf(
                                            request.getOrDefault(
                                                    "difficulty",
                                                    "BEGINNER"
                                            )
                                    ).toUpperCase()
                            )
                    );

                    quiz.setXpReward(
                            Integer.valueOf(
                                    String.valueOf(
                                            request.getOrDefault(
                                                    "xpReward",
                                                    5
                                            )
                                    )
                            )
                    );

                    quiz.setTopic(topic);

                    return ResponseEntity.ok(
                            toResponse(
                                    quizRepository.save(quiz)
                            )
                    );
                })

                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE QUIZ
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id
    ) {

        return quizRepository.findById(id)

                .map(quiz -> {

                    quizRepository.delete(quiz);

                    return ResponseEntity.ok().build();
                })

                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submit(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request,
            Principal principal
    ) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow();

        Long topicId = id;
        List<Quiz> quizzes = quizRepository.findByTopicId(topicId);

        if (quizzes.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Object rawAnswers = request.getOrDefault("answers", Map.of());
        Map<?, ?> answers = rawAnswers instanceof Map<?, ?> map ? map : Map.of();
        int score = 0;
        int totalXp = 0;
        List<Map<String, Object>> results = new ArrayList<>();

        for (Quiz quiz : quizzes) {
            Object answerValue = answers.get(String.valueOf(quiz.getId()));
            String submittedAnswer = answerValue == null ? "" : String.valueOf(answerValue);
            boolean correct = isCorrectAnswer(quiz, submittedAnswer);
            int quizXp = quiz.getXpReward() == null ? 5 : quiz.getXpReward();

            if (correct) {
                score++;
                totalXp += quizXp;
            }

            results.add(Map.of(
                    "quizId", quiz.getId(),
                    "correct", correct,
                    "correctAnswer", quiz.getCorrectAnswer(),
                    "xpReward", quizXp
            ));
        }

        Map<String, Object> xp = xpService.awardOnce(
                user,
                XpService.SOURCE_QUIZ,
                topicId,
                totalXp
        );

        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("total", quizzes.size());
        response.put("results", results);
        response.putAll(xp);

        return ResponseEntity.ok(response);
    }

    // RESPONSE FORMAT
    private Map<String, Object> toResponse(
            Quiz quiz
    ) {

        Map<String, Object> response =
                new HashMap<>();

        response.put("id", quiz.getId());

        response.put("question", quiz.getQuestion());

        response.put("optionA", quiz.getOptionA());

        response.put("optionB", quiz.getOptionB());

        response.put("optionC", quiz.getOptionC());

        response.put("optionD", quiz.getOptionD());

        response.put("correctAnswer", quiz.getCorrectAnswer());

        response.put("explanation", quiz.getExplanation());

        response.put(
                "difficulty",
                quiz.getDifficulty() == null
                        ? "BEGINNER"
                        : quiz.getDifficulty().name()
        );

        response.put(
                "xpReward",
                quiz.getXpReward() == null
                        ? 5
                        : quiz.getXpReward()
        );

        response.put("createdAt", quiz.getCreatedAt());

        response.put(
                "topic",
                Map.of(
                        "id", quiz.getTopic().getId(),
                        "title", quiz.getTopic().getTitle(),
                        "color", quiz.getTopic().getColor()
                )
        );

        return response;
    }

    private boolean isCorrectAnswer(Quiz quiz, String submittedAnswer) {
        String answer = submittedAnswer == null ? "" : submittedAnswer.trim();
        String correct = quiz.getCorrectAnswer() == null ? "" : quiz.getCorrectAnswer().trim();

        if (answer.equalsIgnoreCase(correct)) {
            return true;
        }

        return switch (correct.toUpperCase()) {
            case "A" -> answer.equalsIgnoreCase(quiz.getOptionA());
            case "B" -> answer.equalsIgnoreCase(quiz.getOptionB());
            case "C" -> answer.equalsIgnoreCase(quiz.getOptionC());
            case "D" -> answer.equalsIgnoreCase(quiz.getOptionD());
            default -> false;
        };
    }
}
