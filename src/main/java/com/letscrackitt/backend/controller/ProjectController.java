package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.entity.LearningProject;
import com.letscrackitt.backend.entity.ProjectStep;
import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.repository.LearningProjectRepository;
import com.letscrackitt.backend.repository.ProjectStepRepository;
import com.letscrackitt.backend.repository.UserRepository;
import com.letscrackitt.backend.service.XpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final LearningProjectRepository projectRepository;
    private final ProjectStepRepository stepRepository;
    private final UserRepository userRepository;
    private final XpService xpService;

    @GetMapping
    public List<Map<String, Object>> getProjects() {
        return projectRepository.findAll().stream()
                .map(this::projectCard)
                .toList();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getProject(@PathVariable String slug) {
        return projectRepository.findBySlug(slug)
                .map(project -> ResponseEntity.ok(projectDetail(project)))
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> projectCard(LearningProject project) {
        Map<String, Object> response = baseProject(project);
        response.put("stepCount", stepRepository.findByProjectOrderByDisplayOrderAsc(project).size());
        return response;
    }

    private Map<String, Object> projectDetail(LearningProject project) {
        Map<String, Object> response = baseProject(project);
        response.put("steps", stepRepository.findByProjectOrderByDisplayOrderAsc(project).stream()
                .map(this::stepResponse)
                .toList());
        return response;
    }

    private Map<String, Object> baseProject(LearningProject project) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", project.getId());
        response.put("title", project.getTitle());
        response.put("slug", project.getSlug());
        response.put("description", project.getDescription());
        response.put("courseSlug", project.getCourseSlug());
        response.put("difficulty", project.getDifficulty());
        response.put("accent", project.getAccent());
        return response;
    }

    private Map<String, Object> stepResponse(ProjectStep step) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", step.getId());
        response.put("title", step.getTitle());
        response.put("description", step.getDescription());
        response.put("task", step.getTask());
        response.put("starterCode", step.getStarterCode());
        response.put("displayOrder", step.getDisplayOrder());
        response.put("xpReward", step.getXpReward() != null ? step.getXpReward() : 50);
        return response;
    }

    @PostMapping("/steps/{stepId}/complete")
    public ResponseEntity<Map<String, Object>> completeStep(@PathVariable Long stepId, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow();

        return stepRepository.findById(stepId)
                .map(step -> {
                    int xp = step.getXpReward() != null ? step.getXpReward() : 50;
                    Map<String, Object> response = new HashMap<>();
                    response.putAll(xpService.awardOnce(
                            user,
                            XpService.SOURCE_PROJECT_STEP,
                            step.getId(),
                            xp
                    ));
                    response.put("success", true);
                    response.put("stepId", stepId);
                    response.put("title", step.getTitle());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
