package com.letscrackitt.backend.config;

import com.letscrackitt.backend.entity.HomeContentItem;
import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.entity.enums.Difficulty;
import com.letscrackitt.backend.entity.enums.Role;
import com.letscrackitt.backend.repository.HomeContentItemRepository;
import com.letscrackitt.backend.repository.NoteRepository;
import com.letscrackitt.backend.repository.TopicRepository;
import com.letscrackitt.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final HomeContentItemRepository homeContentItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        seedAdminUser();
        seedHomeContent();

        if (topicRepository.count() > 0) {
            return;
        }

        Topic dsa = saveTopic(
                "dsa",
                "Data Structures",
                "DSA",
                "Master arrays, linked lists, trees, graphs, and interview patterns.",
                "DSA",
                "#8b5cf6",
                1
        );

        Topic java = saveTopic(
                "java",
                "Java",
                "Backend",
                "Core Java, OOP, collections, exceptions, and backend fundamentals.",
                "Java",
                "#f97316",
                2
        );

        Topic react = saveTopic(
                "react",
                "React",
                "Frontend",
                "Build component-driven user interfaces with hooks and routing.",
                "React",
                "#3b82f6",
                3
        );

        saveNote(
                dsa,
                "arrays-basics",
                "Arrays Basics",
                "BEGINNER",
                "arrays,dsa",
                """
                # Arrays Basics

                An array stores elements in contiguous memory.

                ```java
                int[] marks = {90, 85, 92};
                System.out.println(marks[0]);
                ```

                Key operations:
                traversal, searching, insertion, deletion.
                """
        );

        saveNote(
                java,
                "oops-in-java",
                "OOP in Java",
                "BEGINNER",
                "java,oops",
                """
                # OOP in Java

                Java uses classes and objects.

                ```java
                class User {
                    private String name;
                }
                ```
                """
        );

        saveNote(
                react,
                "react-hooks",
                "React Hooks",
                "INTERMEDIATE",
                "react,hooks",
                """
                # React Hooks

                Hooks let function components use state.

                ```jsx
                const [count, setCount] = useState(0);
                ```
                """
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

    private void saveNote(
            Topic topic,
            String slug,
            String title,
            String difficulty,
            String tags,
            String content
    ) {

        noteRepository.save(
                Note.builder()
                        .topic(topic)
                        .slug(slug)
                        .title(title)
                        .difficulty(Difficulty.valueOf(difficulty))
                        .tags(tags)
                        .content(content)
                        .xpReward(10)
                        .viewCount(0)
                        .build()
        );
    }

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