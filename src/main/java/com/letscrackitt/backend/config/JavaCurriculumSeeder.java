package com.letscrackitt.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.letscrackitt.backend.entity.ContentBlock;
import com.letscrackitt.backend.entity.Course;
import com.letscrackitt.backend.entity.LearningProject;
import com.letscrackitt.backend.entity.Lesson;
import com.letscrackitt.backend.entity.Module;
import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.ProjectStep;
import com.letscrackitt.backend.entity.Quiz;
import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.entity.enums.BlockType;
import com.letscrackitt.backend.entity.enums.Difficulty;
import com.letscrackitt.backend.repository.ContentBlockRepository;
import com.letscrackitt.backend.repository.CourseRepository;
import com.letscrackitt.backend.repository.LearningProjectRepository;
import com.letscrackitt.backend.repository.LessonRepository;
import com.letscrackitt.backend.repository.ModuleRepository;
import com.letscrackitt.backend.repository.NoteRepository;
import com.letscrackitt.backend.repository.ProjectStepRepository;
import com.letscrackitt.backend.repository.QuizRepository;
import com.letscrackitt.backend.repository.TopicRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@Order(2)
@RequiredArgsConstructor
public class JavaCurriculumSeeder implements CommandLineRunner {

    private final EntityManager entityManager;
    private final ObjectMapper objectMapper;
    private final TopicRepository topicRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final ContentBlockRepository contentBlockRepository;
    private final NoteRepository noteRepository;
    private final QuizRepository quizRepository;
    private final LearningProjectRepository learningProjectRepository;
    private final ProjectStepRepository projectStepRepository;

    @Override
    @Transactional
    public void run(String... args) {
        Topic java = topicRepository.findBySlug("java")
                .orElseGet(() -> topicRepository.save(
                        Topic.builder()
                                .slug("java")
                                .title("Java")
                                .category("Backend")
                                .description("Start from zero and grow into Core Java, OOP, collections, exceptions, files, threads, and backend-ready thinking.")
                                .icon("Java")
                                .color("#06d96e")
                                .orderIndex(2)
                                .build()
                ));

        java.setTitle("Java");
        java.setCategory("Backend");
        java.setDescription("Start from zero and grow into Core Java, OOP, collections, exceptions, files, threads, and backend-ready thinking.");
        java.setIcon("Java");
        java.setColor("#06d96e");
        topicRepository.save(java);

        if (currentCurriculumInstalled(java.getId())) {
            return;
        }

        wipeJavaData(java.getId());

        Course course = courseRepository.save(
                Course.builder()
                        .title("Java: Zero to Job-Ready Core")
                        .slug("java")
                        .description("A complete beginner-first Java path. Every lesson explains the why, the syntax, the runtime behavior, a correct example, a checkpoint quiz, and a small practical task.")
                        .icon("Java")
                        .color("#06d96e")
                        .topicId(java.getId())
                        .build()
        );

        seedModules(course);
        seedNotes(java);
        seedTopicQuizzes(java);
        seedProject();
    }

    private boolean currentCurriculumInstalled(Long javaTopicId) {
        long javaCourses = ((Number) entityManager
                .createNativeQuery("select count(*) from course where slug = 'java' and title = 'Java: Zero to Job-Ready Core'")
                .getSingleResult())
                .longValue();

        long javaLessons = ((Number) entityManager
                .createNativeQuery("""
                        select count(*) from lesson l
                        join module m on l.module_id = m.id
                        join course c on m.course_id = c.id
                        where c.slug = 'java'
                        """)
                .getSingleResult())
                .longValue();

        long javaQuizzes = ((Number) entityManager
                .createNativeQuery("select count(*) from quizzes where topic_id = :topicId")
                .setParameter("topicId", javaTopicId)
                .getSingleResult())
                .longValue();

        long javaProjects = ((Number) entityManager
                .createNativeQuery("select count(*) from learning_project where slug = 'java-console-toolkit' and course_slug = 'java'")
                .getSingleResult())
                .longValue();

        return javaCourses == 1 && javaLessons >= 25 && javaQuizzes >= 5 && javaProjects == 1;
    }

    private void wipeJavaData(Long javaTopicId) {
        execute("delete from comments where parent_id in (select id from comments where note_id in (select id from notes where topic_id = :topicId))", "topicId", javaTopicId);
        execute("delete from comments where note_id in (select id from notes where topic_id = :topicId)", "topicId", javaTopicId);
        execute("delete from bookmarks where note_id in (select id from notes where topic_id = :topicId)", "topicId", javaTopicId);
        execute("delete from progress where note_id in (select id from notes where topic_id = :topicId)", "topicId", javaTopicId);
        execute("delete from quiz_attempts where quiz_id in (select id from quizzes where topic_id = :topicId)", "topicId", javaTopicId);
        execute("delete from quizzes where topic_id = :topicId", "topicId", javaTopicId);
        execute("delete from notes where topic_id = :topicId", "topicId", javaTopicId);

        execute("delete from project_step where project_id in (select id from learning_project where course_slug = 'java' or slug = 'java-console-toolkit')");
        execute("delete from learning_project where course_slug = 'java' or slug = 'java-console-toolkit'");

        execute("""
                delete from comments where parent_id in (
                    select c.id from comments c
                    join lesson l on c.lesson_id = l.id
                    join module m on l.module_id = m.id
                    join course co on m.course_id = co.id
                    where co.slug = 'java'
                )
                """);
        execute("""
                delete from comments where lesson_id in (
                    select l.id from lesson l
                    join module m on l.module_id = m.id
                    join course co on m.course_id = co.id
                    where co.slug = 'java'
                )
                """);
        execute("""
                delete from content_block where lesson_id in (
                    select l.id from lesson l
                    join module m on l.module_id = m.id
                    join course co on m.course_id = co.id
                    where co.slug = 'java'
                )
                """);
        execute("""
                delete from lesson where module_id in (
                    select m.id from module m
                    join course co on m.course_id = co.id
                    where co.slug = 'java'
                )
                """);
        execute("delete from module where course_id in (select id from course where slug = 'java')");
        execute("delete from course where slug = 'java'");
    }

    private void execute(String sql) {
        entityManager.createNativeQuery(sql).executeUpdate();
    }

    private void execute(String sql, String name, Object value) {
        entityManager.createNativeQuery(sql).setParameter(name, value).executeUpdate();
    }

    private void seedModules(Course course) {
        List<ModuleSeed> modules = List.of(
                module("Start Here: Programming And Java Basics", List.of(
                        lesson("what-is-programming", "What Is Programming?",
                                "Programming means giving exact instructions to a computer. A computer does not guess your intention; it follows steps. Java lets you write those steps in human-readable code, then the Java tools convert and run them. Start with the mental model: input goes in, code transforms it, output comes out.",
                                "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Input -> Process -> Output\");\n    }\n}",
                                "What does a program mainly contain?", "Exact instructions for the computer", "A video file", "Only colors", "A database password",
                                "A program is a set of precise instructions that the computer can execute.",
                                "Print Your First Process", "Print three lines: input, process, and output."),
                        lesson("introduction-to-java", "Introduction To Java",
                                "Java is a general-purpose, object-oriented language used for backend systems, Android, desktop tools, and enterprise applications. You write .java source code, compile it to bytecode, and run it on the JVM. The same bytecode can run on any machine with a compatible JVM.",
                                "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Java\");\n        System.out.println(\"I am learning step by step\");\n    }\n}",
                                "Which method starts a Java console program?", "public static void main(String[] args)", "start()", "main.java", "run.html",
                                "The JVM starts a console app from the public static void main(String[] args) method.",
                                "Hello Java Profile", "Print your name, learning goal, and today's Java topic."),
                        lesson("jdk-jre-jvm", "JDK, JRE, JVM, javac And java",
                                "The JDK is the developer kit: it includes javac, java, libraries, and tools. javac compiles source code into .class bytecode. The JVM runs bytecode. The JRE is the runtime environment used to run Java applications. Modern JDKs include the runtime needed for development.",
                                "// Compile: javac Main.java\n// Run:     java Main\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\".java -> javac -> .class -> JVM\");\n    }\n}",
                                "What does javac create?", "A .class bytecode file", "A CSS file", "A browser tab", "A database table",
                                "javac converts .java source code into .class bytecode.",
                                "Explain The Java Run Flow", "Print each step from source file to JVM execution."),
                        lesson("java-file-structure", "Java File Structure And Main Method",
                                "A simple Java file usually contains a class. If the class is public, the file name must match the class name. The main method is the entry point. Braces group code, semicolons end most statements, and indentation makes the code readable.",
                                "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Class body, method body, statement\");\n    }\n}",
                                "If a public class is named Main, what should the file be named?", "Main.java", "main.txt", "Java.java", "Start.class",
                                "A public Java class name must match the source file name.",
                                "Label The Structure", "Print labels for class, main method, and statement.")
                )),
                module("Core Syntax And Decisions", List.of(
                        lesson("variables-and-data-types", "Variables And Data Types",
                                "A variable is a named storage location. A data type tells Java what kind of value can be stored. int stores whole numbers, double stores decimals, boolean stores true or false, char stores one character, and String stores text. Java is strongly typed, so type mistakes are caught early.",
                                "public class Main {\n    public static void main(String[] args) {\n        String name = \"Asha\";\n        int age = 20;\n        double percentage = 87.5;\n        boolean active = true;\n        System.out.println(name + \" \" + age + \" \" + percentage + \" \" + active);\n    }\n}",
                                "Which type stores true or false?", "boolean", "int", "double", "char",
                                "boolean is the type for true or false values.",
                                "Student Info Card", "Create variables for a student's name, age, percentage, and pass status."),
                        lesson("input-with-scanner", "Taking Input With Scanner",
                                "Scanner reads user input from System.in. Use nextLine for full text, nextInt for integers, and nextDouble for decimal numbers. After numeric input, be careful with leftover newline characters before reading a full line.",
                                "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print(\"Enter name: \");\n        String name = sc.nextLine();\n        System.out.println(\"Welcome, \" + name);\n    }\n}",
                                "Which object commonly reads console input?", "Scanner", "Printer", "Compiler", "ArrayList only",
                                "Scanner is commonly used for beginner console input.",
                                "Input Greeter", "Ask the user for name and city, then print a welcome sentence."),
                        lesson("operators-in-java", "Operators In Java",
                                "Operators perform actions on values. Arithmetic operators calculate, comparison operators produce boolean answers, assignment operators update values, and logical operators combine conditions. Parentheses make order clear.",
                                "public class Main {\n    public static void main(String[] args) {\n        int a = 17;\n        int b = 5;\n        System.out.println(a + b);\n        System.out.println(a % b);\n        System.out.println(a > b && b > 0);\n    }\n}",
                                "What does % calculate?", "Remainder", "Average", "Power", "String size",
                                "The modulus operator returns the remainder after division.",
                                "Mini Calculator Core", "Print sum, difference, product, quotient, and remainder for two numbers."),
                        lesson("if-else-java", "if, else-if And else",
                                "if lets a program choose a path. Java evaluates a boolean condition. If it is true, that block runs. else-if checks another condition. else runs when no previous condition matched. Always check ranges in a logical order.",
                                "public class Main {\n    public static void main(String[] args) {\n        int marks = 76;\n        if (marks >= 90) {\n            System.out.println(\"Excellent\");\n        } else if (marks >= 40) {\n            System.out.println(\"Pass\");\n        } else {\n            System.out.println(\"Fail\");\n        }\n    }\n}",
                                "What must an if condition produce?", "boolean", "Only String", "Only int", "A file",
                                "The expression inside if parentheses must evaluate to true or false.",
                                "Grade Decision", "Print Fail, Pass, Good, or Excellent for marks."),
                        lesson("switch-statement", "switch Statement",
                                "switch chooses one branch from many possible values. It works well for menus, days, roles, and fixed command numbers. Modern Java also supports switch expressions, but beginners should first understand case, break, and default.",
                                "public class Main {\n    public static void main(String[] args) {\n        int choice = 2;\n        switch (choice) {\n            case 1 -> System.out.println(\"Start\");\n            case 2 -> System.out.println(\"Practice\");\n            default -> System.out.println(\"Exit\");\n        }\n    }\n}",
                                "Which switch branch handles unmatched values?", "default", "else-if", "finally", "public",
                                "default runs when no case matches.",
                                "Menu Choice", "Build a 1-2-3 menu using switch.")
                )),
                module("Loops, Methods And Arrays", List.of(
                        lesson("loops-in-java", "for, while And do-while Loops",
                                "Loops repeat code. Use for when the count is clear. Use while when repetition depends on a condition. Use do-while when the body must run at least once. A loop must move toward stopping, or it becomes infinite.",
                                "public class Main {\n    public static void main(String[] args) {\n        int number = 5;\n        for (int i = 1; i <= 10; i++) {\n            System.out.println(number + \" x \" + i + \" = \" + (number * i));\n        }\n    }\n}",
                                "Which loop is best for exactly 10 repetitions?", "for", "try", "class", "import",
                                "A for loop keeps initialization, condition, and update together.",
                                "Table Generator", "Print a multiplication table from 1 to 10."),
                        lesson("break-continue", "break And continue",
                                "break stops the nearest loop or switch. continue skips the rest of the current loop iteration and moves to the next one. They are useful, but overusing them can make code harder to read.",
                                "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            if (i == 3) continue;\n            if (i == 5) break;\n            System.out.println(i);\n        }\n    }\n}",
                                "What does continue do?", "Skips to the next iteration", "Ends the JVM", "Deletes a variable", "Creates a class",
                                "continue skips the remaining statements in the current iteration.",
                                "Skip Bad Input", "Loop through numbers and skip negative values."),
                        lesson("methods-in-java", "Methods In Java",
                                "A method is a named reusable block of code. Parameters are inputs. A return value is output. Methods reduce duplication and make programs easier to test. A good method should do one clear job.",
                                "public class Main {\n    static int add(int a, int b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(add(10, 20));\n    }\n}",
                                "What are method parameters?", "Inputs received by a method", "Files on disk", "Database rows", "Only print statements",
                                "Parameters let a method receive values from the caller.",
                                "Reusable Calculator Method", "Create add, subtract, multiply, and divide methods."),
                        lesson("arrays-in-java", "Arrays In Java",
                                "An array stores multiple values of the same type using one name. Indexes start at 0. The length is fixed after creation. Arrays are useful for marks, prices, names, and any fixed-size group.",
                                "public class Main {\n    public static void main(String[] args) {\n        int[] marks = {80, 75, 90};\n        int total = 0;\n        for (int mark : marks) {\n            total += mark;\n        }\n        System.out.println(\"Average: \" + (total / marks.length));\n    }\n}",
                                "What is the first array index?", "0", "1", "-1", "length",
                                "Java arrays use zero-based indexing.",
                                "Marks Average", "Store marks in an array and calculate total and average."),
                        lesson("strings-in-java", "Strings In Java",
                                "String stores text. Use equals to compare content, not ==. Important methods include length, charAt, substring, trim, toUpperCase, toLowerCase, contains, and split. Strings are immutable: methods return new strings.",
                                "public class Main {\n    public static void main(String[] args) {\n        String raw = \"  Java Basics  \";\n        String clean = raw.trim().toUpperCase();\n        System.out.println(clean);\n        System.out.println(clean.length());\n    }\n}",
                                "Which method compares String content?", "equals", "==", "same", "compareMemory",
                                "equals checks text content; == checks reference identity.",
                                "Username Cleaner", "Trim a username and check if it equals an expected value.")
                )),
                module("Object-Oriented Java", List.of(
                        lesson("classes-and-objects", "Classes And Objects",
                                "A class is a blueprint. An object is an instance created from that blueprint. Fields store state, and methods describe behavior. Objects help you group related data and logic instead of scattering variables everywhere.",
                                "class Student {\n    String name;\n    int marks;\n\n    void printReport() {\n        System.out.println(name + \" scored \" + marks);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s = new Student();\n        s.name = \"Asha\";\n        s.marks = 88;\n        s.printReport();\n    }\n}",
                                "What is an object?", "An instance of a class", "Only a loop", "Only a variable type", "A compiler command",
                                "An object is a real instance created from a class blueprint.",
                                "Student Object", "Create two Student objects and print their reports."),
                        lesson("constructors", "Constructors And this",
                                "A constructor runs when an object is created. It initializes required data. The this keyword refers to the current object, commonly used when parameter names match field names.",
                                "class Student {\n    String name;\n    int marks;\n\n    Student(String name, int marks) {\n        this.name = name;\n        this.marks = marks;\n    }\n}\n",
                                "When does a constructor run?", "When new creates an object", "When a loop starts", "Only after program exit", "When import runs",
                                "Constructors run during object creation.",
                                "Safe Student Creation", "Create a constructor that requires name and marks."),
                        lesson("encapsulation", "Encapsulation",
                                "Encapsulation keeps fields private and exposes controlled methods. This protects objects from invalid state. For example, a bank balance should not be changed directly from outside the class.",
                                "class BankAccount {\n    private double balance;\n\n    void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n\n    double getBalance() {\n        return balance;\n    }\n}",
                                "Why make fields private?", "To control valid changes", "To make code impossible", "To remove methods", "To skip objects",
                                "Private fields can be protected by validation methods.",
                                "Protected Balance", "Add deposit and withdraw methods with validation."),
                        lesson("inheritance", "Inheritance",
                                "Inheritance lets a child class reuse and specialize a parent class. Use it for a real is-a relationship, like SavingsAccount is an Account. Do not use inheritance only to avoid typing repeated code.",
                                "class Account {\n    void showType() {\n        System.out.println(\"General account\");\n    }\n}\n\nclass SavingsAccount extends Account {\n    void addInterest() {\n        System.out.println(\"Interest added\");\n    }\n}",
                                "Which keyword creates inheritance?", "extends", "inherits", "implements class", "child",
                                "extends creates a child class from a parent class.",
                                "Account Types", "Create Account and SavingsAccount classes."),
                        lesson("polymorphism", "Polymorphism And Method Overriding",
                                "Polymorphism means one call can behave differently depending on the actual object. Overriding lets a child class provide its own version of a parent method. Java chooses the overridden method at runtime.",
                                "class Notification {\n    void send() {\n        System.out.println(\"Sending notification\");\n    }\n}\n\nclass EmailNotification extends Notification {\n    @Override\n    void send() {\n        System.out.println(\"Sending email\");\n    }\n}",
                                "Runtime polymorphism happens through:", "Method overriding", "Only comments", "Only arrays", "Compilation error",
                                "Overridden methods are resolved based on the actual object at runtime.",
                                "Notification Sender", "Override send in Email and Sms notification classes."),
                        lesson("abstraction-interfaces", "Abstraction And Interfaces",
                                "Abstraction exposes what an object can do while hiding details of how it does it. Abstract classes can hold shared partial behavior. Interfaces define contracts that classes implement. Use interfaces for capabilities like Printable or Payable.",
                                "interface Printable {\n    void print();\n}\n\nclass Invoice implements Printable {\n    public void print() {\n        System.out.println(\"Printing invoice\");\n    }\n}",
                                "Which keyword connects a class to an interface?", "implements", "extends only", "interfaceof", "new",
                                "A class implements an interface and provides its methods.",
                                "Printable Reports", "Create Printable and two report classes.")
                )),
                module("Errors, Files, Collections And Backend Readiness", List.of(
                        lesson("try-catch-block", "Exception Handling With try-catch",
                                "Exceptions represent runtime problems. Put risky code in try. Handle expected problems in catch. Use finally for cleanup when needed. Good exception handling gives a clear message without hiding real bugs.",
                                "public class Main {\n    public static void main(String[] args) {\n        try {\n            int result = 10 / 0;\n            System.out.println(result);\n        } catch (ArithmeticException ex) {\n            System.out.println(\"Cannot divide by zero\");\n        }\n    }\n}",
                                "Where should risky runtime code go?", "try block", "class name", "import line", "package name",
                                "Risky code belongs in a try block so catch can handle known failures.",
                                "Safe Division", "Handle division by zero with a friendly message."),
                        lesson("custom-exceptions", "Custom Exceptions",
                                "A custom exception gives a business rule a clear name. InvalidMarksException is more meaningful than a generic RuntimeException. Use custom exceptions when your domain has a specific failure case.",
                                "class InvalidMarksException extends RuntimeException {\n    InvalidMarksException(String message) {\n        super(message);\n    }\n}",
                                "Why create a custom exception?", "To describe a domain-specific error", "To avoid all errors forever", "To replace classes", "To make loops faster",
                                "A custom exception makes a project-specific rule visible.",
                                "Invalid Marks Rule", "Throw InvalidMarksException for marks outside 0 to 100."),
                        lesson("arraylist-hashmap", "ArrayList And HashMap",
                                "ArrayList stores ordered values and grows dynamically. HashMap stores key-value pairs for fast lookup by key. Use ArrayList when order matters. Use HashMap when you need to find a value by an identifier like username or roll number.",
                                "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> names = new ArrayList<>();\n        names.add(\"Asha\");\n        HashMap<String, Integer> scores = new HashMap<>();\n        scores.put(\"Asha\", 90);\n        System.out.println(scores.get(\"Asha\"));\n    }\n}",
                                "Which collection stores key-value pairs?", "HashMap", "ArrayList", "String", "Scanner",
                                "HashMap maps keys to values.",
                                "Score Directory", "Store student names and scores in a HashMap."),
                        lesson("file-handling", "File Handling Basics",
                                "File handling lets Java read and write data outside memory. For beginners, Files.writeString and Files.readString are simple starting points. Always handle IO exceptions because files may be missing or locked.",
                                "import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Path path = Path.of(\"notes.txt\");\n        Files.writeString(path, \"Learning Java files\");\n        System.out.println(Files.readString(path));\n    }\n}",
                                "Why can file code fail?", "The file path may be missing or unavailable", "Strings cannot exist", "Classes cannot write files", "Java has no files",
                                "File operations depend on the operating system and filesystem.",
                                "Save A Note", "Write a small text file and read it back."),
                        lesson("threads-basics", "Threads Basics",
                                "A thread is a path of execution. Java programs start with the main thread. Extra threads can run work in parallel, but shared data must be handled carefully. Learn the idea before using threads heavily.",
                                "class Worker extends Thread {\n    public void run() {\n        System.out.println(\"Work running in \" + Thread.currentThread().getName());\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Worker().start();\n    }\n}",
                                "Which method contains thread work?", "run", "main.css", "compile", "equals",
                                "A Thread's run method contains the work that runs on that thread.",
                                "Background Worker", "Create a thread that prints three progress messages."),
                        lesson("java-backend-next-steps", "Java Backend Next Steps",
                                "After Core Java, backend development usually adds SQL, JDBC or JPA, HTTP, REST APIs, Spring Boot, validation, security, testing, and deployment. Core Java is the foundation: variables, OOP, collections, exceptions, and clean methods all appear inside backend code.",
                                "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Core Java -> SQL -> Spring Boot -> REST API\");\n    }\n}",
                                "Which framework is commonly used for Java backend APIs?", "Spring Boot", "React only", "Photoshop", "Excel",
                                "Spring Boot is widely used for Java backend REST APIs.",
                                "Roadmap Printer", "Print your next 5 Java backend learning steps.")
                ))
        );

        for (int i = 0; i < modules.size(); i++) {
            Module module = moduleRepository.save(
                    Module.builder()
                            .title(modules.get(i).title())
                            .displayOrder(i + 1)
                            .course(course)
                            .build()
            );

            List<LessonSeed> lessons = modules.get(i).lessons();
            for (int j = 0; j < lessons.size(); j++) {
                seedLesson(module, lessons.get(j), j + 1);
            }
        }
    }

    private void seedLesson(Module module, LessonSeed seed, int order) {
        Lesson lesson = lessonRepository.save(
                Lesson.builder()
                        .title(seed.title())
                        .slug(seed.slug())
                        .description(seed.explanation())
                        .displayOrder(order)
                        .module(module)
                        .likes(0)
                        .build()
        );

        contentBlockRepository.saveAll(List.of(
                block(lesson, BlockType.TEXT, 1, Map.of(
                        "content", seed.explanation(),
                        "story", "You are learning this as a first-time Java student: first understand the rule, then see the code, then change one value and observe the output.",
                        "interactionPrompt", "Before running the code, predict the output. Then change one value and run it again.",
                        "checkpoint", "You are ready to continue when you can explain this lesson in your own words and complete the task without copying."
                )),
                block(lesson, BlockType.CODE, 2, Map.of(
                        "language", "java",
                        "code", seed.code()
                )),
                block(lesson, BlockType.QUIZ, 3, Map.of(
                        "question", seed.question(),
                        "options", List.of(seed.optionA(), seed.optionB(), seed.optionC(), seed.optionD()),
                        "correctAnswer", 0,
                        "explanation", seed.quizExplanation()
                )),
                block(lesson, BlockType.TASK, 4, Map.of(
                        "title", seed.taskTitle(),
                        "brief", "Practice immediately so the concept becomes usable.",
                        "goal", seed.taskGoal(),
                        "steps", List.of(
                                "Run the starter example.",
                                "Change at least one value.",
                                "Add one extra print or condition.",
                                "Explain the final output in a comment."
                        ),
                        "starterCode", seed.code(),
                        "projectConnection", "This skill becomes part of your Java Console Toolkit project."
                ))
        ));
    }

    private ContentBlock block(Lesson lesson, BlockType type, int order, Map<String, Object> data) {
        try {
            return ContentBlock.builder()
                    .lesson(lesson)
                    .type(type)
                    .displayOrder(order)
                    .data(objectMapper.writeValueAsString(data))
                    .build();
        } catch (Exception ex) {
            throw new IllegalStateException("Could not serialize Java lesson content", ex);
        }
    }

    private void seedNotes(Topic java) {
        noteRepository.save(Note.builder()
                .topic(java)
                .slug("java-complete-beginner-roadmap")
                .title("Java Complete Beginner Roadmap")
                .difficulty(Difficulty.BEGINNER)
                .tags("java,beginner,roadmap,core-java")
                .content("""
                        # Java Complete Beginner Roadmap

                        Start here if you know nothing about Java.

                        ## Order to learn
                        1. What programming means
                        2. JDK, JRE, JVM, javac, and java
                        3. File structure and main method
                        4. Variables, data types, operators, input
                        5. Conditions, switch, loops
                        6. Methods, arrays, strings
                        7. Classes, objects, constructors
                        8. Encapsulation, inheritance, polymorphism, abstraction, interfaces
                        9. Exceptions, collections, files, and threads
                        10. Backend next steps with SQL and Spring Boot

                        ## Golden rules
                        - Run every program.
                        - Change values and observe output.
                        - Prefer clear names.
                        - Keep one concept per method.
                        - Use `equals` for String content comparison.
                        - Validate input before trusting it.
                        """)
                .xpReward(25)
                .viewCount(0)
                .isPublished(true)
                .build());
    }

    private void seedTopicQuizzes(Topic java) {
        quizRepository.saveAll(List.of(
                quiz(java, "What is the correct Java execution flow?", ".java source -> javac -> .class bytecode -> JVM", ".java -> browser -> CSS", "SQL -> JVM -> HTML", "JVM -> source -> bytecode", "A", "Java source is compiled by javac into bytecode, and the JVM executes bytecode."),
                quiz(java, "Which type should store a true or false answer?", "boolean", "String", "double", "char", "A", "boolean stores true or false."),
                quiz(java, "How should Java String content be compared?", "equals", "== always", "compareMemory", "length only", "A", "equals compares text content. == compares references."),
                quiz(java, "What is encapsulation?", "Keeping data private and changing it through controlled methods", "Putting all code in main", "Deleting fields", "Only using loops", "A", "Encapsulation protects object state."),
                quiz(java, "Which collection stores key-value pairs?", "HashMap", "ArrayList", "Scanner", "Thread", "A", "HashMap maps keys to values.")
        ));
    }

    private Quiz quiz(Topic topic, String question, String a, String b, String c, String d, String correct, String explanation) {
        return Quiz.builder()
                .topic(topic)
                .question(question)
                .optionA(a)
                .optionB(b)
                .optionC(c)
                .optionD(d)
                .correctAnswer(correct)
                .explanation(explanation)
                .difficulty(Difficulty.BEGINNER)
                .xpReward(10)
                .build();
    }

    private void seedProject() {
        LearningProject project = learningProjectRepository.save(
                LearningProject.builder()
                        .title("Java Console Toolkit")
                        .slug("java-console-toolkit")
                        .description("A beginner capstone project that starts with printing, then adds input, decisions, loops, methods, objects, collections, exceptions, and file saving.")
                        .courseSlug("java")
                        .difficulty("Beginner")
                        .accent("#06d96e")
                        .build()
        );

        saveStep(project, 1, "Profile Printer", "Print a clean profile using variables.", "Create variables for name, goal, and topic. Print them as a readable profile card.", "public class Main {\n    public static void main(String[] args) {\n        String name = \"\";\n        String goal = \"\";\n    }\n}");
        saveStep(project, 2, "Input Greeter", "Read text from the user.", "Ask for name and city using Scanner, then print a personalized greeting.", "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
        saveStep(project, 3, "Safe Calculator", "Use operators, methods, and exception handling.", "Create methods for add, subtract, multiply, and divide. Handle division by zero.", "public class Main {\n    static int add(int a, int b) { return a + b; }\n}");
        saveStep(project, 4, "Menu Loop", "Use loops and switch.", "Show a menu repeatedly until the user chooses Exit.", "while (true) {\n    System.out.println(\"1. Greet 2. Calculate 3. Exit\");\n}");
        saveStep(project, 5, "Student Manager", "Use classes, objects, ArrayList, and validation.", "Create Student objects, store them in an ArrayList, and print reports.", "class Student {\n    private String name;\n    private int marks;\n}");
        saveStep(project, 6, "Save Summary File", "Use file handling.", "Write a learning summary to a text file and read it back.", "import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n    }\n}");
    }

    private void saveStep(LearningProject project, int order, String title, String description, String task, String starterCode) {
        projectStepRepository.save(
                ProjectStep.builder()
                        .project(project)
                        .displayOrder(order)
                        .title(title)
                        .description(description)
                        .task(task)
                        .starterCode(starterCode)
                        .xpReward(50)
                        .build()
        );
    }

    private ModuleSeed module(String title, List<LessonSeed> lessons) {
        return new ModuleSeed(title, lessons);
    }

    private LessonSeed lesson(String slug, String title, String explanation, String code, String question, String optionA, String optionB, String optionC, String optionD, String quizExplanation, String taskTitle, String taskGoal) {
        return new LessonSeed(slug, title, explanation, code, question, optionA, optionB, optionC, optionD, quizExplanation, taskTitle, taskGoal);
    }

    private record ModuleSeed(String title, List<LessonSeed> lessons) {
    }

    private record LessonSeed(
            String slug,
            String title,
            String explanation,
            String code,
            String question,
            String optionA,
            String optionB,
            String optionC,
            String optionD,
            String quizExplanation,
            String taskTitle,
            String taskGoal
    ) {
    }
}
