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

        seedJavaCourse();

        seedProjects();

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
                "#06d96e",
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

    private void seedProjects() {
        if (learningProjectRepository.count() > 0) {
            return;
        }

        LearningProject javaToolkit = learningProjectRepository.save(
                LearningProject.builder()
                        .title("Java Console Toolkit")
                        .slug("java-console-toolkit")
                        .description("Build a beginner-friendly Java command line toolkit step by step: printer, input reader, calculator, menu system, and mini file utility.")
                        .courseSlug("java")
                        .difficulty("Beginner")
                        .accent("#06d96e")
                        .build()
        );

        saveProjectStep(javaToolkit, 1, "Hello Printer",
                "Start with output. Make the program print messages on separate lines.",
                "Print your name, college, and one learning goal on three separate lines.",
                """
                public class Main {
                  public static void main(String[] args) {
                    System.out.println("Hello Neha");
                  }
                }
                """);

        saveProjectStep(javaToolkit, 2, "Input Greeter",
                "Use Scanner to take input from the user and respond dynamically.",
                "Ask for the user's name and print: Hello, <name>. Welcome to LetsCrackIT.",
                """
                import java.util.Scanner;

                public class Main {
                  public static void main(String[] args) {
                    Scanner sc = new Scanner(System.in);
                  }
                }
                """);

        saveProjectStep(javaToolkit, 3, "Mini Calculator",
                "Variables and operators become useful when you combine numbers.",
                "Take two numbers and print their sum, difference, product, and division.",
                """
                import java.util.Scanner;

                public class Main {
                  public static void main(String[] args) {
                    Scanner sc = new Scanner(System.in);
                    int a = sc.nextInt();
                    int b = sc.nextInt();
                  }
                }
                """);

        saveProjectStep(javaToolkit, 4, "Menu Driven Toolkit",
                "Conditions and loops turn small programs into interactive tools.",
                "Show a menu until the user chooses exit: 1 greet, 2 calculate, 3 exit.",
                """
                while (true) {
                  System.out.println("1. Greet 2. Calculate 3. Exit");
                }
                """);
    }

    private void saveProjectStep(LearningProject project, int order, String title, String description, String task, String starterCode) {
        projectStepRepository.save(
                ProjectStep.builder()
                        .project(project)
                        .displayOrder(order)
                        .title(title)
                        .description(description)
                        .task(task)
                        .starterCode(starterCode)
                        .build()
        );
    }

    /* =====================================================
       JAVA COURSE SEEDER
    ===================================================== */

    /* =====================================================
   COURSES + LESSONS
===================================================== */

    private void seedJavaCourse() {

        if (courseRepository.count() > 0) {
            return;
        }

    /* =====================================================
       JAVA COURSE
    ===================================================== */

        Course javaCourse = courseRepository.save(

                Course.builder()
                        .title("Java")
                        .slug("java")
                        .description(
                                "Master Java through cinematic runtime learning."
                        )
                        .icon("☕")
                        .color("#06d96e")
                        .build()
        );

    /* =====================================================
       MODULE 1 — FUNDAMENTALS
    ===================================================== */

        Module fundamentals = moduleRepository.save(

                Module.builder()
                        .title("Java Fundamentals")
                        .displayOrder(1)
                        .course(javaCourse)
                        .build()
        );

        createBasicLesson(
                fundamentals,
                "Introduction to Java",
                "introduction-to-java",
                "Learn what Java is and how JVM works.",
                1
        );

        createBasicLesson(
                fundamentals,
                "JVM JDK and JRE",
                "jvm-jdk-jre",
                "Understand Java architecture visually.",
                2
        );

        createBasicLesson(
                fundamentals,
                "Variables and Data Types",
                "variables-and-data-types",
                "Understand variables internally.",
                3
        );

        createBasicLesson(
                fundamentals,
                "Operators in Java",
                "operators-in-java",
                "Learn arithmetic and logical operators.",
                4
        );

        createBasicLesson(
                fundamentals,
                "If Else in Java",
                "if-else-java",
                "Visualize conditional execution.",
                5
        );

        createBasicLesson(
                fundamentals,
                "Loops in Java",
                "loops-in-java",
                "Visualize loop execution step by step.",
                6
        );

        createBasicLesson(
                fundamentals,
                "Methods in Java",
                "methods-in-java",
                "Understand method execution flow.",
                7
        );

        createBasicLesson(
                fundamentals,
                "Arrays in Java",
                "arrays-in-java",
                "Understand contiguous memory.",
                8
        );

        createBasicLesson(
                fundamentals,
                "Strings in Java",
                "strings-in-java",
                "Understand string pool visually.",
                9
        );

    /* =====================================================
       MODULE 2 — OOP
    ===================================================== */

        Module oop = moduleRepository.save(

                Module.builder()
                        .title("Object Oriented Programming")
                        .displayOrder(2)
                        .course(javaCourse)
                        .build()
        );

        createBasicLesson(
                oop,
                "Classes and Objects",
                "classes-and-objects",
                "Understand objects visually.",
                1
        );

        createBasicLesson(
                oop,
                "Constructors",
                "constructors",
                "Learn constructor flow internally.",
                2
        );

        createBasicLesson(
                oop,
                "Inheritance",
                "inheritance",
                "Visualize parent-child behavior.",
                3
        );

        createBasicLesson(
                oop,
                "Polymorphism",
                "polymorphism",
                "Understand runtime dispatch visually.",
                4
        );

        createBasicLesson(
                oop,
                "Encapsulation",
                "encapsulation",
                "Protect internal object state.",
                5
        );

        createBasicLesson(
                oop,
                "Abstraction",
                "abstraction",
                "Understand abstraction visually.",
                6
        );

        createBasicLesson(
                oop,
                "Interfaces",
                "interfaces",
                "Understand contracts in Java.",
                7
        );

    /* =====================================================
       MODULE 3 — MEMORY MANAGEMENT
    ===================================================== */

        Module memory = moduleRepository.save(

                Module.builder()
                        .title("Java Memory Management")
                        .displayOrder(3)
                        .course(javaCourse)
                        .build()
        );

        createStackVsHeapLesson(memory);

        createBasicLesson(
                memory,
                "JVM Architecture",
                "jvm-architecture",
                "Understand JVM internals visually.",
                2
        );

        createBasicLesson(
                memory,
                "JVM Memory Areas",
                "jvm-memory-areas",
                "Visualize heap stack metaspace.",
                3
        );

        createBasicLesson(
                memory,
                "Garbage Collection",
                "garbage-collection",
                "Understand GC visually.",
                4
        );

        createBasicLesson(
                memory,
                "String Pool",
                "string-pool",
                "Visualize string interning.",
                5
        );

        createBasicLesson(
                memory,
                "Memory Leaks",
                "memory-leaks",
                "Understand memory leak causes.",
                6
        );

        createBasicLesson(
                memory,
                "Recursion Runtime",
                "recursion-runtime",
                "Visualize recursive stack frames.",
                7
        );

    /* =====================================================
       MODULE 4 — COLLECTIONS
    ===================================================== */

        Module collections = moduleRepository.save(

                Module.builder()
                        .title("Collections Framework")
                        .displayOrder(4)
                        .course(javaCourse)
                        .build()
        );

        createBasicLesson(
                collections,
                "ArrayList Internals",
                "arraylist-internals",
                "Understand dynamic arrays visually.",
                1
        );

        createBasicLesson(
                collections,
                "LinkedList Internals",
                "linkedlist-internals",
                "Visualize node connections.",
                2
        );

        createBasicLesson(
                collections,
                "HashMap Internals",
                "hashmap-internals",
                "Visualize hashing and buckets.",
                3
        );

        createBasicLesson(
                collections,
                "Queue in Java",
                "queue-in-java",
                "Understand FIFO visually.",
                4
        );

        createBasicLesson(
                collections,
                "Stack in Java",
                "stack-in-java",
                "Visualize LIFO execution.",
                5
        );

    /* =====================================================
       MODULE 5 — EXCEPTION HANDLING
    ===================================================== */

        Module exceptionModule = moduleRepository.save(

                Module.builder()
                        .title("Exception Handling")
                        .displayOrder(5)
                        .course(javaCourse)
                        .build()
        );

        createBasicLesson(
                exceptionModule,
                "Try Catch Block",
                "try-catch-block",
                "Handle exceptions gracefully.",
                1
        );

        createBasicLesson(
                exceptionModule,
                "Custom Exceptions",
                "custom-exceptions",
                "Create your own exceptions.",
                2
        );

    /* =====================================================
       MODULE 6 — MULTITHREADING
    ===================================================== */

        Module threads = moduleRepository.save(

                Module.builder()
                        .title("Multithreading")
                        .displayOrder(6)
                        .course(javaCourse)
                        .build()
        );

        createBasicLesson(
                threads,
                "Introduction to Threads",
                "introduction-to-threads",
                "Understand parallel execution visually.",
                1
        );

        createBasicLesson(
                threads,
                "Synchronization",
                "synchronization",
                "Prevent race conditions visually.",
                2
        );

    /* =====================================================
       DSA COURSE
    ===================================================== */

        Course dsaCourse = courseRepository.save(

                Course.builder()
                        .title("DSA")
                        .slug("dsa")
                        .description(
                                "Master problem solving and data structures visually."
                        )
                        .icon("🧠")
                        .color("#8b5cf6")
                        .build()
        );

        Module dsaModule = moduleRepository.save(

                Module.builder()
                        .title("Arrays")
                        .displayOrder(1)
                        .course(dsaCourse)
                        .build()
        );

        createBasicLesson(
                dsaModule,
                "Arrays Introduction",
                "arrays-introduction",
                "Learn how arrays work internally.",
                1
        );

    /* =====================================================
       REACT COURSE
    ===================================================== */

        Course reactCourse = courseRepository.save(

                Course.builder()
                        .title("React")
                        .slug("react")
                        .description(
                                "Build cinematic frontend applications with React."
                        )
                        .icon("⚛️")
                        .color("#06b6d4")
                        .build()
        );

        Module reactModule = moduleRepository.save(

                Module.builder()
                        .title("React Basics")
                        .displayOrder(1)
                        .course(reactCourse)
                        .build()
        );

        createBasicLesson(
                reactModule,
                "React useState Hook",
                "react-usestate",
                "Understand state management visually.",
                1
        );

    /* =====================================================
       SPRING BOOT COURSE
    ===================================================== */

        Course springCourse = courseRepository.save(

                Course.builder()
                        .title("Spring Boot")
                        .slug("spring-boot")
                        .description(
                                "Learn backend architecture with Spring Boot."
                        )
                        .icon("🍃")
                        .color("#22c55e")
                        .build()
        );

        Module springModule = moduleRepository.save(

                Module.builder()
                        .title("Spring Boot Basics")
                        .displayOrder(1)
                        .course(springCourse)
                        .build()
        );

        createBasicLesson(
                springModule,
                "Creating REST APIs",
                "creating-rest-api",
                "Learn Spring Boot REST APIs visually.",
                1
        );
    }
    private void createBasicLesson(
            Module module,
            String title,
            String slug,
            String description,
            int order
    ) {

        Lesson lesson = lessonRepository.save(

                Lesson.builder()
                        .title(title)
                        .slug(slug)
                        .description(description)
                        .displayOrder(order)
                        .module(module)
                        .build()
        );

        contentBlockRepository.save(

                ContentBlock.builder()
                        .lesson(lesson)
                        .type(BlockType.TEXT)
                        .displayOrder(1)
                        .data("""
                    {
                      "content":
                      "This lesson contains cinematic runtime explanations and interactive learning."
                    }
                    """)
                        .build()
        );

        contentBlockRepository.save(

                ContentBlock.builder()
                        .lesson(lesson)
                        .type(BlockType.CODE)
                        .displayOrder(2)
                        .data("""
                    {
                      "language": "java",

                      "code":
                      "System.out.println(\\"Lets Crack It\\");"
                    }
                    """)
                        .build()
        );

        contentBlockRepository.save(

                ContentBlock.builder()
                        .lesson(lesson)
                        .type(BlockType.QUIZ)
                        .displayOrder(3)
                        .data("""
                    {
                      "question":
                      "What is Java?",

                      "options": [
                        "Programming Language",
                        "Database",
                        "Browser",
                        "Operating System"
                      ],

                      "correctAnswer": 0,

                      "explanation":
                      "Java is an object oriented programming language."
                    }
                    """)
                        .build()
        );

        contentBlockRepository.save(

                ContentBlock.builder()
                        .lesson(lesson)
                        .type(BlockType.TASK)
                        .displayOrder(4)
                        .data("""
                    {
                      "title": "Build something tiny",
                      "brief": "Use this concept immediately in a mini project step.",
                      "goal": "Write a small program that proves you understood the lesson.",
                      "steps": [
                        "Recreate the example without looking.",
                        "Change the input values.",
                        "Explain what changed in output and memory."
                      ],
                      "starterCode": "public class Main {\\n  public static void main(String[] args) {\\n    System.out.println(\\"Lets Crack IT\\");\\n  }\\n}",
                      "projectConnection": "This becomes one brick in your Java console toolkit project."
                    }
                    """)
                        .build()
        );
    }
    private void createStackVsHeapLesson(Module module) {

        Lesson lesson = lessonRepository.save(

                Lesson.builder()
                        .title("Stack vs Heap Memory")
                        .slug("stack-vs-heap")
                        .description(
                                "Understand how Java memory works internally."
                        )
                        .displayOrder(1)
                        .module(module)
                        .build()
        );

        contentBlockRepository.save(

                ContentBlock.builder()
                        .lesson(lesson)
                        .type(BlockType.TEXT)
                        .displayOrder(1)

                        .data("""
                {
                  "content":
                  "Java stores references inside stack memory while objects are stored inside heap memory dynamically."
                }
            """)

                        .build()
        );

        contentBlockRepository.save(

                ContentBlock.builder()
                        .lesson(lesson)
                        .type(BlockType.CODE)
                        .displayOrder(2)

                        .data("""
                {
                  "language": "java",

                  "code":
                  "User user = new User();"
                }
            """)

                        .build()
        );

        contentBlockRepository.save(

                ContentBlock.builder()

                        .lesson(lesson)

                        .type(BlockType.RUNTIME)

                        .displayOrder(3)

                        .data("""
        {
          "title": "Stack vs Heap Runtime",

          "steps": [

            {
              "id": 1,

              "title": "Program Starts",

              "code":
              "public static void main(String[] args)",

              "explanation":
              "JVM creates a new stack frame for main method execution.",

              "memoryAfter": {

                "stack": [
                  {
                    "frame": "main()",
                    "variables": []
                  }
                ],

                "heap": []
              }
            },

            {
              "id": 2,

              "title": "Object Allocation",

              "code":
              "User user = new User();",

              "explanation":
              "JVM allocates object inside heap and stores reference inside stack frame.",

              "memoryAfter": {

                "stack": [
                  {
                    "frame": "main()",

                    "variables": [
                      {
                        "name": "user",
                        "value": "0x1A2B"
                      }
                    ]
                  }
                ],

                "heap": [
                  {
                    "address": "0x1A2B",

                    "type": "User",

                    "fields": {
                      "name": "Rahul",
                      "age": 22
                    }
                  }
                ]
              }
            }

          ]
        }
        """)

                        .build()
        );
    }
    /* =====================================================
       TOPICS
    ===================================================== */

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
       NOTES
    ===================================================== */

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
