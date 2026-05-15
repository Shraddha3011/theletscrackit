package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.dto.response.CourseResponse;
import com.letscrackitt.backend.entity.Course;
import com.letscrackitt.backend.repository.CourseRepository;
import com.letscrackitt.backend.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin
public class CourseController {

    private final CourseRepository courseRepository;

    private final CourseService courseService;

    /* ============================================
       ALL COURSES
    ============================================ */

    @GetMapping
    public List<Course> getCourses() {

        return courseRepository.findAll();
    }

    @GetMapping("/debug")
    public Map<String, Object> debugCourses() {
        List<Course> courses = courseRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("totalCourses", courses.size());
        response.put("courses", courses.stream().map(c -> {
            Map<String, Object> courseMap = new HashMap<>();
            courseMap.put("id", c.getId());
            courseMap.put("title", c.getTitle());
            courseMap.put("slug", c.getSlug());
            courseMap.put("topicId", c.getTopicId());
            courseMap.put("moduleCount", c.getModules() != null ? c.getModules().size() : 0);
            return courseMap;
        }).toList());
        return response;
    }

    /* ============================================
       COURSE DETAILS
    ============================================ */

    @GetMapping("/{slug}")
    public CourseResponse getCourseBySlug(

            @PathVariable String slug

    ) {

        return courseService
                .getCourseBySlug(slug);
    }
}