package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.entity.Question;
import com.letscrackitt.backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService service;

    @GetMapping("/{slug}")
    public List<Question> getQuestions(
            @PathVariable String slug
    ) {
        return service.getQuestionsByTopic(slug);
    }
}