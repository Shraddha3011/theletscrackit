package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.dto.response.LessonResponse;
import com.letscrackitt.backend.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@CrossOrigin
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/{slug}")
    public LessonResponse getLesson(
            @PathVariable String slug
    ) {

        return lessonService
                .getLessonBySlug(slug);
    }
}