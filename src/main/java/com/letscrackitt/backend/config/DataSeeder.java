package com.letscrackitt.backend.config;

import com.letscrackitt.backend.entity.ContentBlock;
import com.letscrackitt.backend.entity.Course;
import com.letscrackitt.backend.entity.HomeContentItem;
import com.letscrackitt.backend.entity.Lesson;
import com.letscrackitt.backend.entity.LearningProject;
import com.letscrackitt.backend.entity.Module;
import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.ProjectStep;
import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.entity.User;

import com.letscrackitt.backend.entity.enums.BlockType;
import com.letscrackitt.backend.entity.enums.Difficulty;
import com.letscrackitt.backend.entity.enums.Role;

import com.letscrackitt.backend.repository.ContentBlockRepository;
import com.letscrackitt.backend.repository.CourseRepository;
import com.letscrackitt.backend.repository.HomeContentItemRepository;
import com.letscrackitt.backend.repository.LessonRepository;
import com.letscrackitt.backend.repository.LearningProjectRepository;
import com.letscrackitt.backend.repository.ModuleRepository;
import com.letscrackitt.backend.repository.NoteRepository;
import com.letscrackitt.backend.repository.ProjectStepRepository;
import com.letscrackitt.backend.repository.TopicRepository;
import com.letscrackitt.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;



@Component
@Order(1)
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final HomeContentItemRepository homeContentItemRepository;

    /* =========================
       NEW REPOSITORIES
    ========================= */

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final ContentBlockRepository contentBlockRepository;
    private final LearningProjectRepository learningProjectRepository;
    private final ProjectStepRepository projectStepRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        seedAdminUser();

        seedHomeContent();

        if (topicRepository.count() > 0) {
            return;
        }

        Topic springBoot = saveTopic(
                "spring-boot",
                "Spring Boot",
                "Backend",
                "Build modern Java backend applications with REST APIs, databases, security, authentication, and production-ready architecture.",
                "SpringBoot",
                "#22c55e",
                4
        );
    }

    private Topic saveTopic(
            String slug,
            String title,
            String category,
            String description,
            String icon,
            String color,
            int orderIndex
    ) {

        return topicRepository.save(
                Topic.builder()
                        .slug(slug)
                        .title(title)
                        .category(category)
                        .description(description)
                        .icon(icon)
                        .color(color)
                        .orderIndex(orderIndex)
                        .build()
        );
    }

    /* =====================================================
       ADMIN USER
    ===================================================== */

    private void seedAdminUser() {

        boolean hasAdmin = userRepository.findAll().stream()
                .anyMatch(user -> user.getRole() == Role.ADMIN);

        if (hasAdmin) {
            return;
        }

        userRepository.save(
                User.builder()
                        .username("admin")
                        .fullName("LetsCrackIT Admin")
                        .email("admin@letscrackit.local")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .xpPoints(0)
                        .streak(0)
                        .build()
        );
    }

    /* =====================================================
       HOME CONTENT
    ===================================================== */

    private void seedHomeContent() {

        if (homeContentItemRepository.count() > 0) {
            return;
        }

        saveHomeItem(
                "STEP",
                "Read curated notes",
                "Markdown with syntax-highlighted code.",
                "Read",
                "#06d96e",
                1
        );

        saveHomeItem(
                "STEP",
                "Test yourself",
                "Topic-wise quizzes with instant feedback.",
                "Quiz",
                "#a78bfa",
                2
        );

        saveHomeItem(
                "STEP",
                "Maintain streaks",
                "Daily goals keep you accountable.",
                "Streak",
                "#fb923c",
                3
        );

        saveHomeItem(
                "FEATURE",
                "Rich Markdown Notes",
                "Code blocks, callouts, tables, and real-world analogies.",
                "Notes",
                "#06d96e",
                1
        );

        saveHomeItem(
                "FEATURE",
                "Spaced Revision Mode",
                "Flashcard-style quick revision for every topic.",
                "Revision",
                "#a78bfa",
                2
        );

        saveHomeItem(
                "FEATURE",
                "Community Discussions",
                "Comment on notes and learn together.",
                "Community",
                "#60a5fa",
                3
        );

        saveHomeItem(
                "FEATURE",
                "Personal Bookmarks",
                "Save notes to your revision list.",
                "Bookmarks",
                "#fb923c",
                4
        );
    }

    private void saveHomeItem(
            String section,
            String title,
            String description,
            String icon,
            String accent,
            int orderIndex
    ) {

        homeContentItemRepository.save(
                HomeContentItem.builder()
                        .section(section)
                        .title(title)
                        .description(description)
                        .icon(icon)
                        .accent(accent)
                        .orderIndex(orderIndex)
                        .build()
        );
    }
}
