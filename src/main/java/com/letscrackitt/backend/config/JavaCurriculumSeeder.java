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
                                .icon("☕")
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
                        .title("Java")
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
                .createNativeQuery("select count(*) from quizzes where topic_id = ?1")
                .setParameter(1, javaTopicId)
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

                        lesson(
                                "what-is-programming",
                                "What Is Programming?",

                                "Programming means giving instructions to a computer step by step. "
                                        + "Computers cannot think like humans, so they follow only the instructions written by programmers. "
                                        + "These instructions are written using programming languages such as Java. "
                                        + "Programs are used in mobile apps, websites, games, banking systems, and many real-world applications. "
                                        + "Before learning Java syntax, first understand that programming is mainly about solving problems using logical steps.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        // Java program structure will be learned step by step\n"
                                        + "    }\n"
                                        + "}",

                                "What is programming?",
                                "Giving instructions to a computer",
                                "Only using the internet",
                                "Drawing pictures on screen",
                                "Repairing computer hardware",

                                "Programming means writing instructions that a computer can understand and execute.",

                                "Think Like A Programmer",
                                "Think of one real-life app and identify what task it performs using programming."
                        ),

                        lesson(
                                "why-java",
                                "Why Learn Java?",

                                "Java is one of the most popular programming languages in the world. "
                                        + "It is beginner-friendly, secure, and widely used in companies. "
                                        + "Java is used for Android apps, backend development, enterprise software, banking systems, and cloud applications. "
                                        + "Java follows the principle 'Write Once, Run Anywhere', meaning Java programs can run on different operating systems using the JVM (Java Virtual Machine).",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        // Java is used in many real-world applications\n"
                                        + "    }\n"
                                        + "}",

                                "Where is Java commonly used?",
                                "Android apps and backend systems",
                                "Only image editing",
                                "Only web browsers",
                                "Only hardware repair",

                                "Java is widely used in Android, backend, enterprise, and cloud applications.",

                                "Explore Java Usage",
                                "Search for three popular applications or companies that use Java."
                        ),

                        lesson(
                                "java-program-structure",
                                "Understanding A Simple Java Program",

                                "Before printing anything, understand the basic structure of a Java program. "
                                        + "Every Java program contains a class. "
                                        + "The main() method is the starting point of the program. "
                                        + "Java starts executing code from the main() method. "
                                        + "Curly braces {} are used to group code blocks. "
                                        + "Java is case-sensitive, so Main and main are different.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "    }\n"
                                        + "}",

                                "Which method is the starting point of a Java program?",
                                "main()",
                                "start()",
                                "run()",
                                "execute()",

                                "Java begins program execution from the main() method.",

                                "Identify Program Parts",
                                "Find the class name and main() method in the example program."
                        ),

                        lesson(
                                "understanding-output",
                                "What Is Output?",

                                "Output means the information shown by a program to the user. "
                                        + "For example, displaying a message, showing marks, or showing a calculation result are outputs. "
                                        + "Before learning printing statements, it is important to understand that output is how programs communicate results to users.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        // Output will be displayed here\n"
                                        + "    }\n"
                                        + "}",

                                "What is output in programming?",
                                "Information shown by a program",
                                "Deleting code",
                                "Only storing data",
                                "Closing the application",

                                "Output is the information displayed by a program to the user.",

                                "Observe Output Examples",
                                "Think of three examples of output in mobile apps or websites."
                        ),

                        lesson(
                                "printing-in-java",
                                "Printing Output In Java",

                                "Java uses System.out.println() to print output on the console screen. "
                                        + "The word 'System' represents the system, 'out' represents standard output, and 'println' means print a line. "
                                        + "Text inside double quotes \" \" is called a string. "
                                        + "Each println() statement prints output and moves the cursor to the next line.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        System.out.println(\"Hello Java\");\n"
                                        + "    }\n"
                                        + "}",

                                "Which statement is used to print output in Java?",
                                "System.out.println()",
                                "display.text()",
                                "print.java()",
                                "show.output()",

                                "System.out.println() is used to print output on the console.",

                                "Print Your Name",
                                "Write a Java program that prints your name on the screen."
                        ),

                        lesson(
                                "multiple-print-statements",
                                "Printing Multiple Lines",

                                "You can use multiple System.out.println() statements to print multiple lines. "
                                        + "Each println() prints text on a new line automatically. "
                                        + "This helps display information clearly and neatly.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        System.out.println(\"Name: Shraddha\");\n"
                                        + "        System.out.println(\"Learning: Java\");\n"
                                        + "        System.out.println(\"Goal: Become A Developer\");\n"
                                        + "    }\n"
                                        + "}",

                                "What happens after println() prints output?",
                                "The cursor moves to the next line",
                                "The program stops",
                                "The text is deleted",
                                "The screen becomes empty",

                                "println() prints output and then moves to the next line.",

                                "Create Your Introduction",
                                "Print your name, city, and career goal using multiple println() statements."
                        ),

                        lesson(
                                "comments-in-java",
                                "Comments In Java",

                                "Comments are notes written inside code to explain programs. "
                                        + "Comments are ignored by the Java compiler, so they do not affect output. "
                                        + "Single-line comments start with //. "
                                        + "Comments help beginners and developers understand code easily.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        // This prints a welcome message\n"
                                        + "        System.out.println(\"Welcome To Java\");\n"
                                        + "    }\n"
                                        + "}",

                                "Why are comments used in Java?",
                                "To explain code",
                                "To print output",
                                "To create errors",
                                "To stop execution",

                                "Comments help explain the purpose of code.",

                                "Write A Comment",
                                "Add a comment above a print statement explaining what the program does."
                        )

                )),
                module("Core Syntax And Decisions", List.of(

                        lesson(
                                "variables-introduction",
                                "Understanding Variables",

                                "Variables are used to store data in memory. "
                                        + "A variable acts like a container that stores information which can be used later in the program. "
                                        + "For example, storing a student's name, age, or marks. "
                                        + "Each variable has a name and a value. "
                                        + "In Java, we must declare the variable type before storing data. "
                                        + "This helps Java understand what kind of value will be stored.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        String name = \"Rahul\";\n"
                                        + "        System.out.println(name);\n"
                                        + "    }\n"
                                        + "}",

                                "What is a variable?",
                                "A container used to store data",
                                "A type of loop",
                                "A Java compiler",
                                "A comment in Java",

                                "Variables store data that can be used later in the program.",

                                "Store Your Name",
                                "Create a variable that stores your name and print it."
                        ),

                        lesson(
                                "data-types-in-java",
                                "Data Types In Java",

                                "A data type tells Java what kind of value a variable can store. "
                                        + "Different types are used for different kinds of data. "
                                        + "int stores whole numbers like 10 or 25. "
                                        + "double stores decimal numbers like 87.5. "
                                        + "char stores a single character like 'A'. "
                                        + "boolean stores true or false values. "
                                        + "String stores text such as names or sentences. "
                                        + "Java is strongly typed, so using correct data types helps prevent errors.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int age = 20;\n"
                                        + "        double percentage = 87.5;\n"
                                        + "        char grade = 'A';\n"
                                        + "        boolean passed = true;\n"
                                        + "        String name = \"Asha\";\n"
                                        + "\n"
                                        + "        System.out.println(name);\n"
                                        + "        System.out.println(age);\n"
                                        + "        System.out.println(percentage);\n"
                                        + "        System.out.println(grade);\n"
                                        + "        System.out.println(passed);\n"
                                        + "    }\n"
                                        + "}",

                                "Which data type stores true or false values?",
                                "boolean",
                                "int",
                                "double",
                                "char",

                                "boolean is used to store true or false values.",

                                "Student Information",
                                "Create variables for name, age, marks, and pass status."
                        ),

                        lesson(
                                "changing-variable-values",
                                "Changing Variable Values",

                                "The value stored inside a variable can be changed during program execution. "
                                        + "This is useful when information changes, such as updating scores or counters. "
                                        + "Java allows variables to store new values of the same data type.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int score = 50;\n"
                                        + "        System.out.println(score);\n"
                                        + "\n"
                                        + "        score = 80;\n"
                                        + "        System.out.println(score);\n"
                                        + "    }\n"
                                        + "}",

                                "Can a variable value be changed later in Java?",
                                "Yes, variables can store new values",
                                "No, variables never change",
                                "Only Strings can change",
                                "Only booleans can change",

                                "Variables can store updated values during program execution.",

                                "Update Marks",
                                "Store marks in a variable, then update the marks and print again."
                        ),

                        lesson(
                                "taking-input-scanner",
                                "Taking Input With Scanner",

                                "Programs become interactive when they accept input from users. "
                                        + "Java uses the Scanner class to read input from the keyboard. "
                                        + "Scanner is available in the java.util package, so we import it before use. "
                                        + "nextLine() reads text input, nextInt() reads integers, and nextDouble() reads decimal numbers.",

                                "import java.util.Scanner;\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        Scanner sc = new Scanner(System.in);\n"
                                        + "\n"
                                        + "        System.out.print(\"Enter your name: \");\n"
                                        + "        String name = sc.nextLine();\n"
                                        + "\n"
                                        + "        System.out.println(\"Welcome \" + name);\n"
                                        + "    }\n"
                                        + "}",

                                "Which class is commonly used for user input in Java?",
                                "Scanner",
                                "Printer",
                                "ConsoleReader",
                                "InputData",

                                "Scanner is commonly used to read user input from the keyboard.",

                                "User Greeting",
                                "Take the user's name as input and print a welcome message."
                        ),

                        lesson(
                                "operators-in-java",
                                "Operators In Java",

                                "Operators are symbols used to perform operations on values and variables. "
                                        + "Arithmetic operators perform mathematical calculations. "
                                        + "+ adds values, - subtracts, * multiplies, / divides, and % gives the remainder. "
                                        + "Comparison operators compare values and return true or false. "
                                        + "Logical operators combine conditions.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int a = 10;\n"
                                        + "        int b = 3;\n"
                                        + "\n"
                                        + "        System.out.println(a + b);\n"
                                        + "        System.out.println(a - b);\n"
                                        + "        System.out.println(a * b);\n"
                                        + "        System.out.println(a / b);\n"
                                        + "        System.out.println(a % b);\n"
                                        + "    }\n"
                                        + "}",

                                "What does the % operator return?",
                                "Remainder",
                                "Product",
                                "Average",
                                "Square",

                                "The modulus (%) operator returns the remainder after division.",

                                "Mini Calculator",
                                "Print sum, subtraction, multiplication, division, and remainder of two numbers."
                        ),

                        lesson(
                                "comparison-and-logical-operators",
                                "Comparison And Logical Operators",

                                "Comparison operators compare values and return true or false. "
                                        + "Examples include ==, !=, >, <, >=, and <=. "
                                        + "Logical operators are used to combine conditions. "
                                        + "&& means AND, || means OR, and ! means NOT. "
                                        + "These operators are commonly used in decision-making programs.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int age = 20;\n"
                                        + "\n"
                                        + "        System.out.println(age >= 18);\n"
                                        + "        System.out.println(age > 18 && age < 30);\n"
                                        + "    }\n"
                                        + "}",

                                "What is the result type of comparison operators?",
                                "boolean",
                                "String",
                                "char",
                                "double",

                                "Comparison operators return boolean values: true or false.",

                                "Check Eligibility",
                                "Create a program that checks if a person is eligible to vote."
                        ),

                        lesson(
                                "if-else-in-java",
                                "if, else-if And else",

                                "Decision-making allows programs to choose different actions based on conditions. "
                                        + "The if statement checks a condition. "
                                        + "If the condition is true, the code inside the if block executes. "
                                        + "else-if checks another condition if the previous one was false. "
                                        + "else executes when no condition matches.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int marks = 75;\n"
                                        + "\n"
                                        + "        if (marks >= 90) {\n"
                                        + "            System.out.println(\"Excellent\");\n"
                                        + "        } else if (marks >= 40) {\n"
                                        + "            System.out.println(\"Pass\");\n"
                                        + "        } else {\n"
                                        + "            System.out.println(\"Fail\");\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}",

                                "What must an if condition return?",
                                "true or false",
                                "Only text",
                                "Only numbers",
                                "A file name",

                                "Conditions inside if statements must evaluate to true or false.",

                                "Student Result Checker",
                                "Print Pass or Fail based on student marks."
                        ),

                        lesson(
                                "switch-statement",
                                "Switch Statement",

                                "The switch statement is used when there are multiple fixed choices. "
                                        + "It is commonly used for menus, options, and commands. "
                                        + "Each case represents one possible value. "
                                        + "The default block runs if no case matches.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int day = 2;\n"
                                        + "\n"
                                        + "        switch(day) {\n"
                                        + "            case 1:\n"
                                        + "                System.out.println(\"Monday\");\n"
                                        + "                break;\n"
                                        + "\n"
                                        + "            case 2:\n"
                                        + "                System.out.println(\"Tuesday\");\n"
                                        + "                break;\n"
                                        + "\n"
                                        + "            default:\n"
                                        + "                System.out.println(\"Invalid Day\");\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}",

                                "Which block runs when no switch case matches?",
                                "default",
                                "else",
                                "main",
                                "public",

                                "The default block executes when no case matches.",

                                "Menu Program",
                                "Create a menu program using switch for choices 1, 2, and 3."
                        )

                )),
                module("Loops, Methods And Arrays", List.of(

                        lesson(
                                "why-loops",
                                "Why Do We Need Loops?",

                                "Sometimes we need to repeat the same task many times. "
                                        + "Writing the same code again and again is not efficient. "
                                        + "Loops help us execute a block of code repeatedly. "
                                        + "For example, printing numbers from 1 to 10 or displaying a multiplication table. "
                                        + "Loops make programs shorter, cleaner, and easier to manage.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        System.out.println(1);\n"
                                        + "        System.out.println(2);\n"
                                        + "        System.out.println(3);\n"
                                        + "    }\n"
                                        + "}",

                                "Why are loops useful?",
                                "They help repeat code efficiently",
                                "They only create variables",
                                "They stop Java programs",
                                "They replace comments",

                                "Loops are used to repeat code without writing it multiple times.",

                                "Find Repeated Work",
                                "Identify one real-life task where repetition happens again and again."
                        ),

                        lesson(
                                "for-loop-java",
                                "For Loop In Java",

                                "The for loop is used when the number of repetitions is known. "
                                        + "A for loop contains three important parts: initialization, condition, and update. "
                                        + "Initialization starts the loop variable, the condition checks whether the loop should continue, and the update changes the variable after each iteration.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        for (int i = 1; i <= 5; i++) {\n"
                                        + "            System.out.println(i);\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}",

                                "Which loop is best when the number of repetitions is known?",
                                "for loop",
                                "switch",
                                "if statement",
                                "Scanner",

                                "The for loop is commonly used when the repetition count is known.",

                                "Print Numbers",
                                "Use a for loop to print numbers from 1 to 10."
                        ),

                        lesson(
                                "while-loop-java",
                                "While Loop In Java",

                                "The while loop is used when the number of repetitions is not fixed. "
                                        + "The condition is checked before each iteration. "
                                        + "If the condition becomes false, the loop stops. "
                                        + "A while loop must update its condition correctly to avoid infinite loops.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int i = 1;\n"
                                        + "\n"
                                        + "        while (i <= 5) {\n"
                                        + "            System.out.println(i);\n"
                                        + "            i++;\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}",

                                "When does a while loop stop?",
                                "When its condition becomes false",
                                "After one iteration only",
                                "When Java closes",
                                "Only after using break",

                                "A while loop continues until its condition becomes false.",

                                "Count Using While",
                                "Use a while loop to print numbers from 1 to 5."
                        ),

                        lesson(
                                "do-while-loop-java",
                                "Do-While Loop In Java",

                                "The do-while loop is similar to the while loop, but it always executes at least one time. "
                                        + "This happens because the condition is checked after the loop body runs. "
                                        + "It is useful in menus and programs where at least one execution is required.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int i = 1;\n"
                                        + "\n"
                                        + "        do {\n"
                                        + "            System.out.println(i);\n"
                                        + "            i++;\n"
                                        + "        } while (i <= 5);\n"
                                        + "    }\n"
                                        + "}",

                                "How many times does a do-while loop execute at minimum?",
                                "At least one time",
                                "Zero times",
                                "Only two times",
                                "Infinite times",

                                "A do-while loop always runs at least once before checking the condition.",

                                "Run Once",
                                "Create a do-while loop that prints numbers from 1 to 3."
                        ),

                        lesson(
                                "break-and-continue",
                                "Break And Continue",

                                "The break statement immediately stops the nearest loop. "
                                        + "The continue statement skips the current iteration and moves to the next iteration. "
                                        + "These statements are useful in conditions where certain values should stop or skip processing.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        for (int i = 1; i <= 5; i++) {\n"
                                        + "\n"
                                        + "            if (i == 3) {\n"
                                        + "                continue;\n"
                                        + "            }\n"
                                        + "\n"
                                        + "            if (i == 5) {\n"
                                        + "                break;\n"
                                        + "            }\n"
                                        + "\n"
                                        + "            System.out.println(i);\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}",

                                "What does continue do in a loop?",
                                "Skips the current iteration",
                                "Stops the JVM",
                                "Deletes variables",
                                "Ends the program completely",

                                "continue skips the remaining statements of the current iteration.",

                                "Skip Numbers",
                                "Print numbers from 1 to 10 but skip number 5."
                        ),

                        lesson(
                                "introduction-to-methods",
                                "Introduction To Methods",

                                "Methods are reusable blocks of code that perform a specific task. "
                                        + "Methods help avoid repeating the same code multiple times. "
                                        + "A method can take inputs called parameters and can return a result. "
                                        + "Using methods makes programs organized and easier to understand.",

                                "public class Main {\n"
                                        + "\n"
                                        + "    static void greet() {\n"
                                        + "        System.out.println(\"Welcome To Java\");\n"
                                        + "    }\n"
                                        + "\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        greet();\n"
                                        + "    }\n"
                                        + "}",

                                "Why are methods useful?",
                                "They help reuse code",
                                "They only create loops",
                                "They stop programs",
                                "They replace variables",

                                "Methods reduce code duplication and improve readability.",

                                "Create A Greeting Method",
                                "Create a method that prints a welcome message."
                        ),

                        lesson(
                                "methods-with-parameters",
                                "Methods With Parameters",

                                "Parameters allow methods to receive values from the caller. "
                                        + "This makes methods more flexible because the same method can work with different data. "
                                        + "The values passed to methods are called arguments.",

                                "public class Main {\n"
                                        + "\n"
                                        + "    static void greet(String name) {\n"
                                        + "        System.out.println(\"Welcome \" + name);\n"
                                        + "    }\n"
                                        + "\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        greet(\"Asha\");\n"
                                        + "    }\n"
                                        + "}",

                                "What are method parameters?",
                                "Inputs received by a method",
                                "Java keywords",
                                "Loop conditions",
                                "Comments",

                                "Parameters allow methods to receive and use values.",

                                "Personal Greeting",
                                "Create a method that accepts a name and prints a greeting."
                        ),

                        lesson(
                                "methods-with-return-values",
                                "Methods With Return Values",

                                "Some methods return a result after performing calculations. "
                                        + "The return keyword sends the result back to the caller. "
                                        + "The return type defines what kind of value the method returns.",

                                "public class Main {\n"
                                        + "\n"
                                        + "    static int add(int a, int b) {\n"
                                        + "        return a + b;\n"
                                        + "    }\n"
                                        + "\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int result = add(10, 20);\n"
                                        + "        System.out.println(result);\n"
                                        + "    }\n"
                                        + "}",

                                "What does the return keyword do?",
                                "Sends a value back from a method",
                                "Stops Java installation",
                                "Creates a loop",
                                "Prints automatically",

                                "The return statement sends a value back to the method caller.",

                                "Calculator Method",
                                "Create a method that returns the multiplication of two numbers."
                        ),

                        lesson(
                                "arrays-in-java",
                                "Arrays In Java",

                                "An array stores multiple values of the same data type using one variable name. "
                                        + "Each value in an array is stored at an index position. "
                                        + "Array indexing starts from 0 in Java. "
                                        + "Arrays are useful for storing lists such as marks, prices, or names.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int[] marks = {80, 75, 90};\n"
                                        + "\n"
                                        + "        System.out.println(marks[0]);\n"
                                        + "        System.out.println(marks[1]);\n"
                                        + "        System.out.println(marks[2]);\n"
                                        + "    }\n"
                                        + "}",

                                "What is the first index of an array in Java?",
                                "0",
                                "1",
                                "-1",
                                "10",

                                "Java arrays use zero-based indexing.",

                                "Store Student Marks",
                                "Create an array to store 5 student marks."
                        ),

                        lesson(
                                "looping-through-arrays",
                                "Looping Through Arrays",

                                "Loops are commonly used with arrays to access each element one by one. "
                                        + "The length property gives the total number of elements in an array. "
                                        + "Using loops with arrays helps process large collections of data efficiently.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        int[] numbers = {10, 20, 30, 40};\n"
                                        + "\n"
                                        + "        for (int i = 0; i < numbers.length; i++) {\n"
                                        + "            System.out.println(numbers[i]);\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}",

                                "Which property gives the size of an array?",
                                "length",
                                "size()",
                                "count",
                                "capacity",

                                "The length property stores the number of elements in an array.",

                                "Print Array Elements",
                                "Use a loop to print all elements of an array."
                        ),

                        lesson(
                                "strings-in-java",
                                "Strings In Java",

                                "Strings are used to store text in Java. "
                                        + "String values are written inside double quotes. "
                                        + "Strings provide many useful methods such as length(), toUpperCase(), toLowerCase(), trim(), contains(), and substring(). "
                                        + "Strings are immutable, which means their original value cannot be changed after creation.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        String text = \"Java Basics\";\n"
                                        + "\n"
                                        + "        System.out.println(text.length());\n"
                                        + "        System.out.println(text.toUpperCase());\n"
                                        + "    }\n"
                                        + "}",

                                "Which method returns the length of a String?",
                                "length()",
                                "size()",
                                "count()",
                                "charAt()",

                                "The length() method returns the total number of characters in a String.",

                                "String Practice",
                                "Store your name in a String and print its length."
                        )

                )),
                module("Object-Oriented Java", List.of(

                        lesson(
                                "why-oops",
                                "Why Learn Object-Oriented Programming?",

                                "As programs become larger, managing code using only variables and methods becomes difficult. "
                                        + "Object-Oriented Programming (OOP) helps organize programs into objects that contain both data and behavior. "
                                        + "Java is an object-oriented programming language. "
                                        + "OOP makes programs easier to manage, reuse, test, and maintain. "
                                        + "The four main concepts of OOP are classes and objects, encapsulation, inheritance, polymorphism, and abstraction.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        System.out.println(\"Java uses Object-Oriented Programming\");\n"
                                        + "    }\n"
                                        + "}",

                                "Why is OOP useful?",
                                "It helps organize and manage code",
                                "It only prints output",
                                "It replaces loops",
                                "It removes variables",

                                "OOP helps create organized, reusable, and maintainable programs.",

                                "Observe Real Objects",
                                "Think of a real-world object like a car or student and identify its data and behavior."
                        ),

                        lesson(
                                "classes-in-java",
                                "Classes In Java",

                                "A class is a blueprint used to create objects. "
                                        + "A class defines what data an object will store and what actions it can perform. "
                                        + "Variables inside a class are called fields, and functions inside a class are called methods. "
                                        + "For example, a Student class can contain student name, marks, and a method to display details.",

                                "class Student {\n"
                                        + "    String name;\n"
                                        + "    int marks;\n"
                                        + "}",

                                "What is a class in Java?",
                                "A blueprint for creating objects",
                                "A loop structure",
                                "A Java package",
                                "An output statement",

                                "A class defines the structure and behavior of objects.",

                                "Create A Class",
                                "Create a Student class with name and marks fields."
                        ),

                        lesson(
                                "objects-in-java",
                                "Objects In Java",

                                "An object is a real instance created from a class. "
                                        + "Objects store actual values in memory. "
                                        + "We use the new keyword to create objects. "
                                        + "Multiple objects can be created from the same class, each with different values.",

                                "class Student {\n"
                                        + "    String name;\n"
                                        + "    int marks;\n"
                                        + "}\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        Student s1 = new Student();\n"
                                        + "\n"
                                        + "        s1.name = \"Asha\";\n"
                                        + "        s1.marks = 90;\n"
                                        + "\n"
                                        + "        System.out.println(s1.name);\n"
                                        + "        System.out.println(s1.marks);\n"
                                        + "    }\n"
                                        + "}",

                                "Which keyword is used to create an object?",
                                "new",
                                "class",
                                "public",
                                "static",

                                "The new keyword creates objects in Java.",

                                "Create Student Objects",
                                "Create two Student objects with different names and marks."
                        ),

                        lesson(
                                "methods-inside-class",
                                "Methods Inside A Class",

                                "Methods inside a class define the behavior of objects. "
                                        + "A method can access and use the fields of the object. "
                                        + "Methods help organize related actions together.",

                                "class Student {\n"
                                        + "    String name;\n"
                                        + "    int marks;\n\n"
                                        + "    void printReport() {\n"
                                        + "        System.out.println(name + \" scored \" + marks);\n"
                                        + "    }\n"
                                        + "}\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        Student s = new Student();\n"
                                        + "        s.name = \"Rahul\";\n"
                                        + "        s.marks = 85;\n"
                                        + "\n"
                                        + "        s.printReport();\n"
                                        + "    }\n"
                                        + "}",

                                "What is the purpose of methods in a class?",
                                "To define object behavior",
                                "To stop execution",
                                "To create comments",
                                "To import packages",

                                "Methods define the actions objects can perform.",

                                "Student Report Method",
                                "Create a method that prints a student's name and marks."
                        ),

                        lesson(
                                "constructors-in-java",
                                "Constructors In Java",

                                "A constructor is a special method used to initialize objects. "
                                        + "A constructor automatically runs when an object is created. "
                                        + "The constructor name must match the class name. "
                                        + "Constructors help ensure objects start with proper values.",

                                "class Student {\n"
                                        + "    String name;\n"
                                        + "    int marks;\n\n"
                                        + "    Student(String n, int m) {\n"
                                        + "        name = n;\n"
                                        + "        marks = m;\n"
                                        + "    }\n"
                                        + "}\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        Student s = new Student(\"Asha\", 92);\n"
                                        + "        System.out.println(s.name);\n"
                                        + "    }\n"
                                        + "}",

                                "When does a constructor execute?",
                                "When an object is created",
                                "When a loop starts",
                                "After program ends",
                                "Only during compilation",

                                "Constructors automatically execute during object creation.",

                                "Initialize Student Data",
                                "Create a constructor that accepts student name and marks."
                        ),

                        lesson(
                                "this-keyword",
                                "The this Keyword",

                                "The this keyword refers to the current object. "
                                        + "It is commonly used when constructor parameters and field names are the same. "
                                        + "Using this helps Java distinguish between local variables and object fields.",

                                "class Student {\n"
                                        + "    String name;\n\n"
                                        + "    Student(String name) {\n"
                                        + "        this.name = name;\n"
                                        + "    }\n"
                                        + "}",

                                "What does this represent in Java?",
                                "The current object",
                                "The parent class",
                                "A loop variable",
                                "A package",

                                "this refers to the current object being used.",

                                "Use this Keyword",
                                "Create a constructor using this to assign values to fields."
                        ),

                        lesson(
                                "encapsulation-in-java",
                                "Encapsulation",

                                "Encapsulation means protecting object data by keeping fields private and controlling access using methods. "
                                        + "This improves security and prevents invalid data changes. "
                                        + "Getter methods are used to read values, and setter methods are used to update values safely.",

                                "class BankAccount {\n"
                                        + "    private double balance;\n\n"
                                        + "    void deposit(double amount) {\n"
                                        + "        if (amount > 0) {\n"
                                        + "            balance += amount;\n"
                                        + "        }\n"
                                        + "    }\n\n"
                                        + "    double getBalance() {\n"
                                        + "        return balance;\n"
                                        + "    }\n"
                                        + "}",

                                "Why are fields made private in encapsulation?",
                                "To protect data from invalid changes",
                                "To stop object creation",
                                "To remove methods",
                                "To make code shorter only",

                                "Private fields protect object data and improve control.",

                                "Safe Bank Account",
                                "Create deposit and withdraw methods with validation."
                        ),

                        lesson(
                                "inheritance-in-java",
                                "Inheritance",

                                "Inheritance allows one class to reuse the properties and methods of another class. "
                                        + "The parent class is also called the superclass, and the child class is called the subclass. "
                                        + "Inheritance helps reduce duplicate code and represents real-world relationships.",

                                "class Animal {\n"
                                        + "    void sound() {\n"
                                        + "        System.out.println(\"Animal makes sound\");\n"
                                        + "    }\n"
                                        + "}\n\n"
                                        + "class Dog extends Animal {\n"
                                        + "    void bark() {\n"
                                        + "        System.out.println(\"Dog barks\");\n"
                                        + "    }\n"
                                        + "}",

                                "Which keyword is used for inheritance in Java?",
                                "extends",
                                "implements",
                                "inherits",
                                "superclass",

                                "The extends keyword creates inheritance between classes.",

                                "Animal And Dog",
                                "Create Animal and Dog classes using inheritance."
                        ),

                        lesson(
                                "polymorphism-in-java",
                                "Polymorphism And Method Overriding",

                                "Polymorphism means one method can behave differently depending on the object. "
                                        + "Method overriding happens when a child class provides its own version of a parent class method. "
                                        + "Java chooses the correct overridden method at runtime.",

                                "class Animal {\n"
                                        + "    void sound() {\n"
                                        + "        System.out.println(\"Animal sound\");\n"
                                        + "    }\n"
                                        + "}\n\n"
                                        + "class Dog extends Animal {\n"
                                        + "    @Override\n"
                                        + "    void sound() {\n"
                                        + "        System.out.println(\"Dog barks\");\n"
                                        + "    }\n"
                                        + "}",

                                "Polymorphism in Java commonly happens through:",
                                "Method overriding",
                                "Comments",
                                "Variables only",
                                "Packages",

                                "Method overriding enables runtime polymorphism in Java.",

                                "Override Methods",
                                "Override the sound() method in Cat and Dog classes."
                        ),

                        lesson(
                                "abstraction-and-interfaces",
                                "Abstraction And Interfaces",

                                "Abstraction means hiding implementation details and showing only important functionality. "
                                        + "Interfaces define rules that classes must follow. "
                                        + "A class implements an interface and provides method definitions. "
                                        + "Interfaces help create flexible and reusable designs.",

                                "interface Printable {\n"
                                        + "    void print();\n"
                                        + "}\n\n"
                                        + "class Invoice implements Printable {\n"
                                        + "    public void print() {\n"
                                        + "        System.out.println(\"Printing Invoice\");\n"
                                        + "    }\n"
                                        + "}",

                                "Which keyword connects a class to an interface?",
                                "implements",
                                "extends",
                                "inherits",
                                "interface",

                                "A class uses implements to connect with an interface.",

                                "Printable Documents",
                                "Create a Printable interface and implement it in two classes."
                        )

                )),
                module("Errors, Files, Collections And Backend Readiness", List.of(

                        lesson(
                                "understanding-errors",
                                "Understanding Errors In Java",

                                "Errors and exceptions are problems that occur during program execution. "
                                        + "Some errors happen because of incorrect code syntax, while others happen during runtime. "
                                        + "For example, dividing by zero or accessing a missing file can cause runtime exceptions. "
                                        + "Handling errors properly helps programs continue safely without crashing unexpectedly.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        System.out.println(\"Programs can face errors during execution\");\n"
                                        + "    }\n"
                                        + "}",

                                "When can runtime errors happen?",
                                "While the program is running",
                                "Only before writing code",
                                "Only during installation",
                                "Only when printing text",

                                "Runtime errors happen while the program is executing.",

                                "Identify Possible Errors",
                                "Think of two situations where a Java program may fail during execution."
                        ),

                        lesson(
                                "try-catch-block",
                                "Exception Handling With try-catch",

                                "Exception handling allows Java programs to handle runtime problems safely. "
                                        + "Risky code is placed inside the try block. "
                                        + "If an exception occurs, Java transfers control to the catch block. "
                                        + "This prevents the program from stopping suddenly and allows friendly error messages to be shown.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "\n"
                                        + "        try {\n"
                                        + "            int result = 10 / 0;\n"
                                        + "            System.out.println(result);\n"
                                        + "        } catch (ArithmeticException ex) {\n"
                                        + "            System.out.println(\"Cannot divide by zero\");\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}",

                                "Where should risky code be written?",
                                "Inside the try block",
                                "Inside comments",
                                "Inside package names",
                                "Inside import statements",

                                "Risky code is placed in the try block so exceptions can be handled safely.",

                                "Safe Calculator",
                                "Handle division by zero using try-catch."
                        ),

                        lesson(
                                "finally-block",
                                "The finally Block",

                                "The finally block contains code that always executes, whether an exception happens or not. "
                                        + "It is commonly used for cleanup tasks such as closing files, database connections, or resources.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "\n"
                                        + "        try {\n"
                                        + "            System.out.println(\"Inside try block\");\n"
                                        + "        } finally {\n"
                                        + "            System.out.println(\"Finally block always runs\");\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}",

                                "Does the finally block always execute?",
                                "Yes",
                                "No",
                                "Only during errors",
                                "Only during compilation",

                                "The finally block runs whether an exception occurs or not.",

                                "Cleanup Message",
                                "Write a program using try and finally blocks."
                        ),

                        lesson(
                                "custom-exceptions",
                                "Custom Exceptions",

                                "Java allows developers to create custom exceptions for project-specific problems. "
                                        + "Custom exceptions make programs easier to understand because they describe business-related errors clearly. "
                                        + "A custom exception is created by extending Exception or RuntimeException.",

                                "class InvalidMarksException extends RuntimeException {\n"
                                        + "\n"
                                        + "    InvalidMarksException(String message) {\n"
                                        + "        super(message);\n"
                                        + "    }\n"
                                        + "}",

                                "Why are custom exceptions useful?",
                                "They describe project-specific errors clearly",
                                "They remove all runtime errors",
                                "They replace loops",
                                "They create arrays automatically",

                                "Custom exceptions help represent meaningful business-related errors.",

                                "Marks Validation",
                                "Throw a custom exception if marks are less than 0 or greater than 100."
                        ),

                        lesson(
                                "introduction-to-collections",
                                "Why Collections Are Needed",

                                "Arrays have fixed sizes, which means their size cannot change after creation. "
                                        + "Collections in Java provide dynamic storage that can grow or shrink when needed. "
                                        + "The Java Collections Framework includes useful classes such as ArrayList, HashMap, HashSet, and more. "
                                        + "Collections are widely used in real-world applications.",

                                "import java.util.ArrayList;\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        ArrayList<String> names = new ArrayList<>();\n"
                                        + "        names.add(\"Asha\");\n"
                                        + "        System.out.println(names);\n"
                                        + "    }\n"
                                        + "}",

                                "Why are collections useful?",
                                "They provide dynamic storage",
                                "They only print output",
                                "They replace methods",
                                "They stop exceptions",

                                "Collections allow flexible and dynamic data storage.",

                                "Store Dynamic Data",
                                "Create an ArrayList and store three names."
                        ),

                        lesson(
                                "arraylist-in-java",
                                "ArrayList In Java",

                                "ArrayList stores ordered elements and can grow dynamically. "
                                        + "Elements are added using add(), accessed using get(), and removed using remove(). "
                                        + "ArrayList is commonly used when the number of elements can change.",

                                "import java.util.ArrayList;\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "\n"
                                        + "        ArrayList<String> fruits = new ArrayList<>();\n"
                                        + "\n"
                                        + "        fruits.add(\"Apple\");\n"
                                        + "        fruits.add(\"Mango\");\n"
                                        + "\n"
                                        + "        System.out.println(fruits.get(0));\n"
                                        + "    }\n"
                                        + "}",

                                "Which method adds elements into an ArrayList?",
                                "add()",
                                "insert()",
                                "put()",
                                "store()",

                                "The add() method inserts elements into an ArrayList.",

                                "Fruit List",
                                "Store five fruit names inside an ArrayList."
                        ),

                        lesson(
                                "hashmap-in-java",
                                "HashMap In Java",

                                "HashMap stores data in key-value pairs. "
                                        + "Each key maps to a value. "
                                        + "HashMap is useful for storing information such as usernames and passwords, student roll numbers and marks, or product IDs and prices. "
                                        + "Keys should usually be unique.",

                                "import java.util.HashMap;\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "\n"
                                        + "        HashMap<String, Integer> scores = new HashMap<>();\n"
                                        + "\n"
                                        + "        scores.put(\"Asha\", 90);\n"
                                        + "        scores.put(\"Rahul\", 85);\n"
                                        + "\n"
                                        + "        System.out.println(scores.get(\"Asha\"));\n"
                                        + "    }\n"
                                        + "}",

                                "Which collection stores key-value pairs?",
                                "HashMap",
                                "ArrayList",
                                "String",
                                "Scanner",

                                "HashMap stores data using keys and values.",

                                "Student Score Map",
                                "Store student names and marks using HashMap."
                        ),

                        lesson(
                                "file-handling-basics",
                                "File Handling Basics",

                                "File handling allows Java programs to store and read data from files. "
                                        + "Java provides the Files class in java.nio.file package for file operations. "
                                        + "Files.writeString() writes text into a file, and Files.readString() reads file content. "
                                        + "File handling is useful for notes, logs, reports, and saved application data.",

                                "import java.nio.file.*;\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) throws Exception {\n"
                                        + "\n"
                                        + "        Path path = Path.of(\"notes.txt\");\n"
                                        + "\n"
                                        + "        Files.writeString(path, \"Learning Java File Handling\");\n"
                                        + "\n"
                                        + "        System.out.println(Files.readString(path));\n"
                                        + "    }\n"
                                        + "}",

                                "Why can file operations fail?",
                                "The file may not exist or be accessible",
                                "Strings cannot be stored",
                                "Java does not support files",
                                "Methods cannot read files",

                                "File operations depend on the operating system and file availability.",

                                "Save Notes",
                                "Write text into a file and read it back."
                        ),

                        lesson(
                                "threads-basics",
                                "Threads Basics",

                                "A thread is a separate path of execution inside a program. "
                                        + "Java programs start with the main thread. "
                                        + "Additional threads can run tasks in parallel. "
                                        + "Threads are useful for background work such as downloading files, processing tasks, or handling multiple users.",

                                "class Worker extends Thread {\n"
                                        + "\n"
                                        + "    public void run() {\n"
                                        + "        System.out.println(\"Worker thread is running\");\n"
                                        + "    }\n"
                                        + "}\n\n"
                                        + "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        Worker w = new Worker();\n"
                                        + "        w.start();\n"
                                        + "    }\n"
                                        + "}",

                                "Which method contains the code executed by a thread?",
                                "run()",
                                "main()",
                                "startLoop()",
                                "execute()",

                                "The run() method contains the work performed by a thread.",

                                "Background Task",
                                "Create a thread that prints three progress messages."
                        ),

                        lesson(
                                "java-backend-next-steps",
                                "Java Backend Next Steps",

                                "After learning Core Java, backend development usually continues with databases, SQL, JDBC, JPA, REST APIs, Spring Boot, authentication, validation, testing, and deployment. "
                                        + "Core Java concepts such as OOP, collections, exception handling, methods, and multithreading are heavily used in backend development. "
                                        + "Spring Boot is one of the most popular frameworks for building Java backend applications and REST APIs.",

                                "public class Main {\n"
                                        + "    public static void main(String[] args) {\n"
                                        + "        System.out.println(\"Core Java -> SQL -> Spring Boot -> REST APIs\");\n"
                                        + "    }\n"
                                        + "}",

                                "Which framework is commonly used for Java backend development?",
                                "Spring Boot",
                                "Photoshop",
                                "Excel",
                                "React Native",

                                "Spring Boot is widely used for building Java backend APIs and web applications.",

                                "Backend Roadmap",
                                "Print your next learning steps after Core Java."
                        )

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
                        .description("Build a real Java console application step by step while learning Core Java concepts through interactive mini-features and guided project building.")
                        .courseSlug("java")
                        .difficulty("Beginner")
                        .accent("#06d96e")
                        .build()
        );

        saveStep(
                project,
                1,
                "Build Your First Console Screen",
                "Learn how output works in Java.",
                """
                In this step, the learner understands how Java prints output on the console.
    
                Goal:
                Build a simple welcome screen for the toolkit application.
    
                What learner will understand:
                - How Java displays output
                - What System.out.println() does
                - How console applications communicate with users
    
                Small Task Flow:
                1. Print app title
                2. Print welcome message
                3. Print learning journey message
                4. Print next step instruction
    
                Expected Feeling:
                'I just made my first Java screen.'
                """,
                """
                public class Main {
    
                    public static void main(String[] args) {
    
                        System.out.println("================================");
                        System.out.println("      JAVA CONSOLE TOOLKIT      ");
                        System.out.println("================================");
    
                        System.out.println("Welcome to Lets Crack IT");
                        System.out.println("Start building while learning");
                        System.out.println("Next Step -> Create your profile");
    
                    }
                }
                """
        );

        saveStep(
                project,
                2,
                "Create Developer Profile",
                "Learn variables and strings.",
                """
                In this step, the learner stores information using variables.
    
                Goal:
                Create a developer profile section dynamically.
    
                What learner will understand:
                - What variables are
                - Why variables are needed
                - How String variables store text
                - How dynamic data works
    
                Small Task Flow:
                1. Create name variable
                2. Create city variable
                3. Create dream company variable
                4. Print all details dynamically
    
                Real Understanding:
                Instead of hardcoded text, programs can store reusable information.
                """,
                """
                public class Main {
    
                    public static void main(String[] args) {
    
                        String name = "Shraddha";
                        String city = "Mumbai";
                        String dreamCompany = "Google";
    
                        System.out.println("===== DEVELOPER PROFILE =====");
    
                        System.out.println("Name: " + name);
                        System.out.println("City: " + city);
                        System.out.println("Dream Company: " + dreamCompany);
    
                    }
                }
                """
        );

        saveStep(
                project,
                3,
                "Make The App Interactive",
                "Learn user input using Scanner.",
                """
                In this step, the learner makes the application interactive.
    
                Goal:
                Ask the user for information instead of hardcoding values.
    
                What learner will understand:
                - How Scanner works
                - How Java reads keyboard input
                - How user interaction works in console apps
    
                Small Task Flow:
                1. Ask user name
                2. Ask user city
                3. Store values
                4. Print personalized greeting
    
                Real Understanding:
                Programs become useful when users can interact with them.
                """,
                """
                import java.util.Scanner;
    
                public class Main {
    
                    public static void main(String[] args) {
    
                        Scanner sc = new Scanner(System.in);
    
                        System.out.print("Enter your name: ");
                        String name = sc.nextLine();
    
                        System.out.print("Enter your city: ");
                        String city = sc.nextLine();
    
                        System.out.println();
                        System.out.println("Welcome " + name + " from " + city);
    
                    }
                }
                """
        );

        saveStep(
                project,
                4,
                "Build Smart Decisions",
                "Learn conditions using if-else.",
                """
                In this step, the learner teaches the application how to make decisions.
    
                Goal:
                Check whether user is eligible for Java backend roadmap.
    
                What learner will understand:
                - How conditions work
                - How applications make decisions
                - What boolean logic means
    
                Small Task Flow:
                1. Take user age input
                2. Check age using if condition
                3. Print eligible or not eligible
    
                Real Understanding:
                Real applications constantly make decisions using conditions.
                """,
                """
                import java.util.Scanner;
    
                public class Main {
    
                    public static void main(String[] args) {
    
                        Scanner sc = new Scanner(System.in);
    
                        System.out.print("Enter your age: ");
                        int age = sc.nextInt();
    
                        if(age >= 18) {
                            System.out.println("Eligible for backend roadmap");
                        } else {
                            System.out.println("Keep learning and come back stronger");
                        }
    
                    }
                }
                """
        );

        saveStep(
                project,
                5,
                "Automate Repeated Work",
                "Learn loops in Java.",
                """
                In this step, the learner understands automation using loops.
    
                Goal:
                Generate multiplication table automatically.
    
                What learner will understand:
                - Why loops are needed
                - How repetition works
                - How applications automate repeated tasks
    
                Small Task Flow:
                1. Take number input
                2. Run loop from 1 to 10
                3. Print multiplication table
    
                Real Understanding:
                Loops help applications avoid repetitive code.
                """,
                """
                import java.util.Scanner;
    
                public class Main {
    
                    public static void main(String[] args) {
    
                        Scanner sc = new Scanner(System.in);
    
                        System.out.print("Enter a number: ");
                        int number = sc.nextInt();
    
                        for(int i = 1; i <= 10; i++) {
    
                            System.out.println(
                                    number + " x " + i + " = " + (number * i)
                            );
    
                        }
    
                    }
                }
                """
        );

        saveStep(
                project,
                6,
                "Build Reusable Features",
                "Learn methods in Java.",
                """
                In this step, the learner understands reusable programming.
    
                Goal:
                Convert repeated calculator logic into reusable methods.
    
                What learner will understand:
                - Why methods are important
                - How reusable logic works
                - How real applications stay clean and maintainable
    
                Small Task Flow:
                1. Create add method
                2. Create subtract method
                3. Call methods from main
                4. Print results
    
                Real Understanding:
                Large applications are built using reusable methods.
                """,
                """
                public class Main {
    
                    static int add(int a, int b) {
                        return a + b;
                    }
    
                    static int subtract(int a, int b) {
                        return a - b;
                    }
    
                    public static void main(String[] args) {
    
                        System.out.println(add(10, 5));
                        System.out.println(subtract(20, 8));
    
                    }
                }
                """
        );

        saveStep(
                project,
                7,
                "Create Real Objects",
                "Learn classes and objects.",
                """
                In this step, the learner enters Object-Oriented Programming.
    
                Goal:
                Create Student objects dynamically.
    
                What learner will understand:
                - What classes are
                - What objects are
                - How real applications model data
    
                Small Task Flow:
                1. Create Student class
                2. Add variables
                3. Create object
                4. Print student details
    
                Real Understanding:
                Most modern Java applications are built using objects.
                """,
                """
                class Student {
    
                    String name;
                    int marks;
    
                    void printDetails() {
    
                        System.out.println(name);
                        System.out.println(marks);
    
                    }
    
                }
    
                public class Main {
    
                    public static void main(String[] args) {
    
                        Student s1 = new Student();
    
                        s1.name = "Asha";
                        s1.marks = 90;
    
                        s1.printDetails();
    
                    }
                }
                """
        );

        saveStep(
                project,
                8,
                "Store Multiple Students",
                "Learn ArrayList collections.",
                """
                In this step, the learner handles multiple records dynamically.
    
                Goal:
                Store multiple student names using ArrayList.
    
                What learner will understand:
                - Why collections are needed
                - Difference between arrays and ArrayList
                - Dynamic data storage
    
                Small Task Flow:
                1. Create ArrayList
                2. Add student names
                3. Loop through list
                4. Print all students
    
                Real Understanding:
                Real applications manage large collections of data dynamically.
                """,
                """
                import java.util.ArrayList;
    
                public class Main {
    
                    public static void main(String[] args) {
    
                        ArrayList<String> students = new ArrayList<>();
    
                        students.add("Asha");
                        students.add("Rahul");
                        students.add("Neha");
    
                        for(String student : students) {
    
                            System.out.println(student);
    
                        }
    
                    }
                }
                """
        );

        saveStep(
                project,
                9,
                "Handle Errors Safely",
                "Learn exception handling.",
                """
                In this step, the learner prevents application crashes.
    
                Goal:
                Handle division by zero safely.
    
                What learner will understand:
                - What exceptions are
                - Why applications crash
                - How try-catch prevents failures
    
                Small Task Flow:
                1. Create risky division
                2. Add try block
                3. Catch exception
                4. Show friendly message
    
                Real Understanding:
                Professional applications must handle errors safely.
                """,
                """
                public class Main {
    
                    public static void main(String[] args) {
    
                        try {
    
                            int result = 10 / 0;
    
                            System.out.println(result);
    
                        } catch (ArithmeticException ex) {
    
                            System.out.println("Cannot divide by zero");
    
                        }
    
                    }
                }
                """
        );

        saveStep(
                project,
                10,
                "Save User Progress",
                "Learn file handling.",
                """
                In this final step, the learner saves application data into a file.
    
                Goal:
                Save learning summary into notes.txt file.
    
                What learner will understand:
                - How files work
                - How applications save data
                - Basic persistence in Java
    
                Small Task Flow:
                1. Create file path
                2. Write content
                3. Read file
                4. Print saved content
    
                Real Understanding:
                Applications become useful when data persists permanently.
                """,
                """
                import java.nio.file.Files;
                import java.nio.file.Path;
    
                public class Main {
    
                    public static void main(String[] args) throws Exception {
    
                        Path path = Path.of("notes.txt");
    
                        Files.writeString(
                                path,
                                "Completed Java Console Toolkit"
                        );
    
                        String content = Files.readString(path);
    
                        System.out.println(content);
    
                    }
                }
                """
        );

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
