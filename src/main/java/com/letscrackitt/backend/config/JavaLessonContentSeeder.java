package com.letscrackitt.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.letscrackitt.backend.entity.ContentBlock;
import com.letscrackitt.backend.entity.Lesson;
import com.letscrackitt.backend.entity.enums.BlockType;
import com.letscrackitt.backend.repository.ContentBlockRepository;
import com.letscrackitt.backend.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Order(3)
@RequiredArgsConstructor
public class JavaLessonContentSeeder implements CommandLineRunner {

    private final LessonRepository lessonRepository;
    private final ContentBlockRepository contentBlockRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) {
        Map<String, LessonSeed> richLessons = lessons()
                .stream()
                .collect(Collectors.toMap(LessonSeed::slug, Function.identity()));

        lessonRepository.findAll().forEach(lesson ->
                refreshGenericContent(
                        lesson,
                        richLessons.getOrDefault(lesson.getSlug(), fallbackLesson(lesson))
                )
        );
    }

    private LessonSeed fallbackLesson(Lesson lesson) {
        String title = lesson.getTitle();
        String description = lesson.getDescription() == null
                ? "Learn the concept by writing and changing a small Java program."
                : lesson.getDescription();

        return lesson(
                lesson.getSlug(),
                title + " is best learned by connecting the rule to a small working program. " + description
                        + " Read the example, change one value, and watch how the output changes. That habit makes the concept practical instead of theoretical.",
                """
                public class Main {
                    public static void main(String[] args) {
                        System.out.println("Learning: %s");
                        System.out.println("Change this example and run it again.");
                    }
                }
                """.formatted(title),
                "What is the best way to confirm you understood " + title + "?",
                List.of(
                        "Write and modify a small working example",
                        "Only read the heading",
                        "Skip the code",
                        "Memorize without running anything"
                ),
                0,
                "Running and changing a small example proves that you understand the behavior, not just the definition.",
                title + " Practice Build",
                "Turn this subtopic into a small working checkpoint.",
                "Build one tiny Java program that demonstrates " + title + " clearly.",
                List.of(
                        "Run the starter code once.",
                        "Add one value or condition related to the lesson.",
                        "Print output that proves the concept.",
                        "Write one comment explaining what changed."
                ),
                """
                public class Main {
                    public static void main(String[] args) {
                        // Build your checkpoint for this lesson here
                    }
                }
                """,
                "This checkpoint becomes a practical step in your learning project, so the topic is connected to code you actually build."
        );
    }

    private void refreshGenericContent(Lesson lesson, LessonSeed seed) {
        List<ContentBlock> existing = contentBlockRepository.findByLessonOrderByDisplayOrderAsc(lesson);
        boolean needsRefresh = existing.isEmpty()
                || existing.stream().noneMatch(block -> block.getType() == BlockType.TASK)
                || existing.stream().filter(block -> block.getType() == BlockType.TEXT)
                .anyMatch(block -> block.getData() == null || !block.getData().contains("\"story\""))
                || existing.stream().anyMatch(block -> block.getData() != null
                && (block.getData().contains("cinematic runtime explanations")
                || block.getData().contains("Build something tiny")));

        if (!needsRefresh) {
            return;
        }

        contentBlockRepository.deleteAll(existing);
        contentBlockRepository.saveAll(List.of(
                block(lesson, BlockType.TEXT, 1, Map.of(
                        "content", seed.explanation(),
                        "story", storyFor(seed),
                        "interactionPrompt", promptFor(seed),
                        "checkpoint", checkpointFor(seed)
                )),
                block(lesson, BlockType.CODE, 2, Map.of(
                        "language", "java",
                        "code", seed.code()
                )),
                block(lesson, BlockType.QUIZ, 3, quizData(seed)),
                block(lesson, BlockType.TASK, 4, taskData(seed))
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
            throw new IllegalStateException("Could not write lesson seed JSON for " + lesson.getSlug(), ex);
        }
    }

    private Map<String, Object> quizData(LessonSeed seed) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("question", seed.quizQuestion());
        data.put("options", seed.quizOptions());
        data.put("correctAnswer", seed.correctAnswer());
        data.put("explanation", seed.quizExplanation());
        return data;
    }

    private Map<String, Object> taskData(LessonSeed seed) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("title", seed.taskTitle());
        data.put("brief", seed.taskBrief());
        data.put("goal", seed.taskGoal());
        data.put("steps", seed.taskSteps());
        data.put("starterCode", seed.starterCode());
        data.put("projectConnection", seed.projectConnection());
        return data;
    }

    private String storyFor(LessonSeed seed) {
        return "Imagine your program is a tiny control room. The user asks for help, the code follows one rule, and the screen answers back. In this scene, the rule is: "
                + seed.taskGoal()
                + " That is why this lesson is not just theory; it becomes a working part of the project.";
    }

    private String promptFor(LessonSeed seed) {
        return "Before running the code, predict what will appear on screen. Then change one value, run it again, and explain why the output changed.";
    }

    private String checkpointFor(LessonSeed seed) {
        return "You understood this when you can complete: " + seed.taskTitle() + " without copying the final answer.";
    }

    private List<LessonSeed> lessons() {
        return List.of(
                lesson(
                        "introduction-to-java",
                        "Java is a language plus a runtime. You write source code in a .java file, the compiler turns it into bytecode, and the JVM runs that bytecode on your machine. The big idea is portability: the same bytecode can run anywhere a matching JVM exists. Start by learning the smallest Java program: a class, a main method, and a print statement.",
                        """
                        public class Main {
                            public static void main(String[] args) {
                                System.out.println("Hello, LetsCrackIT");
                                System.out.println("I am learning Java step by step");
                            }
                        }
                        """,
                        "Which part starts a normal Java console program?",
                        List.of("public static void main(String[] args)", "System.start()", "main.java", "print()"),
                        0,
                        "The JVM looks for the main method signature to begin running a console program.",
                        "Hello Profile Printer",
                        "Make Java print real profile lines, not one random example.",
                        "Print your name, your course, and one goal on separate lines.",
                        List.of("Create a Main class.", "Add the main method.", "Use println three times.", "Change the text and run again."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                // print your profile here
                            }
                        }
                        """,
                        "This is the first screen of your Java Console Toolkit: a clean welcome/profile section."
                ),
                lesson(
                        "jvm-jdk-jre",
                        "JDK, JRE, and JVM are not the same thing. The JDK is your developer toolbox: compiler, runtime, and tools. The JRE is what a user needs to run Java apps. The JVM is the engine that reads bytecode and executes it. When your code works, this flow happened: .java source -> javac compiler -> .class bytecode -> JVM execution.",
                        """
                        // Terminal flow:
                        // javac Main.java
                        // java Main
                        public class Main {
                            public static void main(String[] args) {
                                System.out.println("Source -> Bytecode -> JVM");
                            }
                        }
                        """,
                        "What does javac create from a .java file?",
                        List.of("Bytecode in a .class file", "A database table", "HTML", "A JVM"),
                        0,
                        "The compiler creates bytecode. The JVM executes that bytecode.",
                        "Explain The Run Flow",
                        "Turn the invisible Java run process into visible output.",
                        "Print each step Java takes from source code to running output.",
                        List.of("Print Step 1: write .java source.", "Print Step 2: compile using javac.", "Print Step 3: run bytecode on JVM.", "Add one sentence explaining why this helps portability."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                System.out.println("Step 1: ");
                            }
                        }
                        """,
                        "Your toolkit gets a debug/help command that explains how Java runs behind the scenes."
                ),
                lesson(
                        "variables-and-data-types",
                        "A variable is a named space for a value. The data type tells Java what kind of value is allowed and how much behavior is expected. int stores whole numbers, double stores decimal numbers, boolean stores true or false, char stores one character, and String stores text. Think of the type as a label on a container: Java checks the label before letting values in.",
                        """
                        public class Main {
                            public static void main(String[] args) {
                                String name = "Neha";
                                int age = 20;
                                double percentage = 87.5;
                                boolean isLearning = true;

                                System.out.println(name + " scored " + percentage);
                            }
                        }
                        """,
                        "Which type should store true or false?",
                        List.of("boolean", "int", "double", "String"),
                        0,
                        "boolean is used for values that are either true or false.",
                        "Student Info Card",
                        "Store real details using the correct data types.",
                        "Create variables for name, age, percentage, and learning status, then print a clean student card.",
                        List.of("Create one String, one int, one double, and one boolean.", "Print each value with a useful label.", "Change values and confirm the output changes.", "Avoid storing every value as String."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                String name = "";
                                int age = 0;
                            }
                        }
                        """,
                        "This becomes the profile data model used by your console toolkit."
                ),
                lesson(
                        "operators-in-java",
                        "Operators are small actions you perform on values. Arithmetic operators calculate, comparison operators answer true or false, and logical operators combine decisions. Operators are where variables become useful: a price and quantity can become a bill, marks can become a percentage, and two conditions can become one final decision.",
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int a = 20;
                                int b = 6;

                                System.out.println("Sum: " + (a + b));
                                System.out.println("Remainder: " + (a % b));
                                System.out.println("Is a bigger? " + (a > b));
                            }
                        }
                        """,
                        "What does % return?",
                        List.of("Remainder", "Power", "Average", "String length"),
                        0,
                        "The modulus operator returns the remainder after division.",
                        "Mini Calculator Core",
                        "Use operators to calculate useful results from two numbers.",
                        "Take two numbers in variables and print sum, difference, product, division, and remainder.",
                        List.of("Create two number variables.", "Print all five calculations.", "Use parentheses where needed.", "Test with values that do not divide evenly."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int first = 12;
                                int second = 5;
                            }
                        }
                        """,
                        "This becomes the calculation engine of your Java Console Toolkit."
                ),
                lesson(
                        "if-else-java",
                        "An if statement is a gate. Java checks a boolean condition. If it is true, one path runs. If it is false, another path can run. This is how programs stop being fixed scripts and start reacting to the user: pass or fail, login allowed or blocked, discount applied or skipped.",
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int marks = 72;

                                if (marks >= 40) {
                                    System.out.println("Pass");
                                } else {
                                    System.out.println("Try again");
                                }
                            }
                        }
                        """,
                        "What must be inside if parentheses?",
                        List.of("A boolean condition", "Only a String", "Only a class name", "A file name"),
                        0,
                        "The expression inside if must evaluate to true or false.",
                        "Grade Decision Screen",
                        "Make the program choose output based on marks.",
                        "Given marks, print Fail, Pass, Good, or Excellent using if else-if else.",
                        List.of("Create a marks variable.", "Check the highest grade first.", "Print exactly one result.", "Test with 35, 55, 75, and 90."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int marks = 0;
                            }
                        }
                        """,
                        "Your toolkit now has decision logic for grading and validation."
                ),
                lesson(
                        "loops-in-java",
                        "A loop repeats code while a condition allows it. Use for loops when you know the count, while loops when repetition depends on something changing, and do-while when you need one run before checking. The danger is also simple: if the condition never becomes false, the loop never stops.",
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int table = 5;

                                for (int i = 1; i <= 10; i++) {
                                    System.out.println(table + " x " + i + " = " + (table * i));
                                }
                            }
                        }
                        """,
                        "Which loop is best when you know you need exactly 10 repetitions?",
                        List.of("for loop", "try-catch", "class", "import"),
                        0,
                        "A for loop keeps the counter, condition, and update in one readable place.",
                        "Table Generator",
                        "Use repetition to produce many useful lines from one rule.",
                        "Print the multiplication table of one number from 1 to 10.",
                        List.of("Create a number variable.", "Create a for loop from 1 to 10.", "Print number x counter = answer.", "Change the number and confirm the whole table updates."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int number = 7;
                            }
                        }
                        """,
                        "This becomes the repeated-output feature in your menu driven toolkit."
                ),
                lesson(
                        "methods-in-java",
                        "A method is a named block of work. Parameters are inputs. A return value is output. Methods stop your program from becoming one giant main method. When logic has a clear name, your code becomes easier to read, test, and reuse.",
                        """
                        public class Main {
                            static int add(int a, int b) {
                                return a + b;
                            }

                            public static void main(String[] args) {
                                int total = add(10, 15);
                                System.out.println(total);
                            }
                        }
                        """,
                        "What are method parameters?",
                        List.of("Inputs received by a method", "Files created by Java", "Database rows", "Only print statements"),
                        0,
                        "Parameters let the same method work with different input values.",
                        "Calculator Methods",
                        "Move calculator logic into reusable methods.",
                        "Create add, subtract, multiply, and divide methods, then call them from main.",
                        List.of("Write one method for each operation.", "Return the answer instead of printing inside every method.", "Call each method from main.", "Print labels with the returned values."),
                        """
                        public class Main {
                            static int add(int a, int b) {
                                return 0;
                            }
                        }
                        """,
                        "Your toolkit calculator becomes clean enough to reuse from a menu."
                ),
                lesson(
                        "arrays-in-java",
                        "An array stores multiple values of the same type under one name. Each value has an index, and indexing starts at 0. Arrays are powerful when the same action must happen to many values: marks, prices, temperatures, scores. The size is fixed once the array is created.",
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int[] marks = {80, 75, 92, 68};
                                int total = 0;

                                for (int mark : marks) {
                                    total += mark;
                                }

                                System.out.println("Average: " + (total / marks.length));
                            }
                        }
                        """,
                        "What is the first index of a Java array?",
                        List.of("0", "1", "-1", "Depends on the value"),
                        0,
                        "Java arrays use zero-based indexing, so the first element is at index 0.",
                        "Marks Analyzer",
                        "Use an array to process many marks together.",
                        "Store marks, calculate total, average, highest, and lowest.",
                        List.of("Create an int array of marks.", "Loop through all marks.", "Track total, highest, and lowest.", "Print a small report."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int[] marks = {78, 90, 66};
                            }
                        }
                        """,
                        "Your toolkit can now analyze repeated data instead of only two numbers."
                ),
                lesson(
                        "strings-in-java",
                        "A String is text, and Java gives it useful methods. Use equals for content comparison, not ==. Use length to count characters, charAt to read one character, and trim to remove extra spaces. Strings are immutable, so methods usually return a new value instead of changing the old one.",
                        """
                        public class Main {
                            public static void main(String[] args) {
                                String rawName = "  neha  ";
                                String cleanName = rawName.trim();

                                System.out.println(cleanName.toUpperCase());
                                System.out.println(cleanName.length());
                            }
                        }
                        """,
                        "Which method compares String content correctly?",
                        List.of("equals", "==", "compareMemory", "sameObject"),
                        0,
                        "equals checks text content. == checks whether two references point to the same object.",
                        "Username Formatter",
                        "Clean messy user input before showing it.",
                        "Take a name string, trim spaces, convert it to title style or uppercase, and print a welcome line.",
                        List.of("Create a messy name with spaces.", "Use trim.", "Use uppercase or lowercase methods.", "Print the cleaned result in a sentence."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                String name = "  neha  ";
                            }
                        }
                        """,
                        "This becomes input cleanup before your toolkit greets or stores user data."
                ),
                lesson(
                        "classes-and-objects",
                        "A class is a blueprint. An object is a real thing created from that blueprint. Fields store object state, and methods define object behavior. This is how large programs stay understandable: instead of loose variables everywhere, related data and actions live together.",
                        """
                        class Student {
                            String name;
                            int marks;

                            void printReport() {
                                System.out.println(name + " scored " + marks);
                            }
                        }

                        public class Main {
                            public static void main(String[] args) {
                                Student student = new Student();
                                student.name = "Neha";
                                student.marks = 88;
                                student.printReport();
                            }
                        }
                        """,
                        "What is an object?",
                        List.of("A real instance created from a class", "Only a method", "Only a loop", "A compiler command"),
                        0,
                        "The class describes the shape. The object is the created instance with actual values.",
                        "Student Object",
                        "Group related data and behavior into one class.",
                        "Create a Student class with name, marks, and a method that prints a report.",
                        List.of("Create a Student class.", "Add name and marks fields.", "Add a printReport method.", "Create two Student objects in main."),
                        """
                        class Student {
                            String name;
                        }

                        public class Main {
                            public static void main(String[] args) {
                            }
                        }
                        """,
                        "Your toolkit starts moving from scripts to real project structure."
                ),
                lesson(
                        "constructors",
                        "A constructor runs when an object is created. It is used to put the object into a valid starting state. If a Student must always have a name, the constructor can require it. This prevents half-created objects from moving around your program.",
                        """
                        class Student {
                            String name;
                            int marks;

                            Student(String name, int marks) {
                                this.name = name;
                                this.marks = marks;
                            }
                        }
                        """,
                        "When does a constructor run?",
                        List.of("When an object is created", "When a loop ends", "Only during compilation", "When a String is printed"),
                        0,
                        "The constructor is called during object creation with new.",
                        "Safe Student Creation",
                        "Force objects to start with required values.",
                        "Create a constructor that accepts name and marks, then print the created object data.",
                        List.of("Add fields to Student.", "Create a constructor.", "Use this.field to assign values.", "Create at least two students."),
                        """
                        class Student {
                            Student(String name, int marks) {
                            }
                        }
                        """,
                        "Your project objects now start correctly without manual field filling everywhere."
                ),
                lesson(
                        "inheritance",
                        "Inheritance lets one class reuse and specialize another class. A child class gets accessible behavior from the parent class. Use it when there is a real is-a relationship. For example, a SavingsAccount is an Account. Do not use inheritance just to avoid typing.",
                        """
                        class Account {
                            void showType() {
                                System.out.println("General account");
                            }
                        }

                        class SavingsAccount extends Account {
                            void addInterest() {
                                System.out.println("Interest added");
                            }
                        }
                        """,
                        "Which keyword creates inheritance in Java?",
                        List.of("extends", "inherits", "parent", "copies"),
                        0,
                        "extends creates a child class from a parent class.",
                        "Account Types",
                        "Model shared and special behavior clearly.",
                        "Create Account and SavingsAccount classes, then call methods from both.",
                        List.of("Create a parent Account class.", "Create SavingsAccount extends Account.", "Add one common method and one child-only method.", "Create a SavingsAccount object and call both."),
                        """
                        class Account {
                        }

                        class SavingsAccount extends Account {
                        }
                        """,
                        "This gives your toolkit a path toward larger domain models like accounts, users, or courses."
                ),
                lesson(
                        "polymorphism",
                        "Polymorphism means one method call can behave differently based on the actual object. This is useful when your program knows the general type but not the exact subtype. Java chooses the overridden method at runtime.",
                        """
                        class Notification {
                            void send() {
                                System.out.println("Sending notification");
                            }
                        }

                        class EmailNotification extends Notification {
                            @Override
                            void send() {
                                System.out.println("Sending email");
                            }
                        }
                        """,
                        "When an overridden method is chosen based on the actual object, that is called:",
                        List.of("Runtime polymorphism", "Compilation", "Indexing", "String pooling"),
                        0,
                        "Java resolves overridden methods dynamically at runtime.",
                        "Notification Sender",
                        "Use one command to trigger different behavior.",
                        "Create a parent Notification class and two child classes with different send behavior.",
                        List.of("Create the parent class.", "Override send in two child classes.", "Store a child object in a parent reference.", "Call send and observe the child behavior."),
                        """
                        class Notification {
                            void send() {
                            }
                        }
                        """,
                        "Your toolkit can support plug-in style actions where one menu option triggers different implementations."
                ),
                lesson(
                        "encapsulation",
                        "Encapsulation protects object data by keeping fields private and exposing controlled methods. Instead of allowing any code to set invalid values, setters can validate. This is one of the simplest ways to make a Java project safer.",
                        """
                        class BankAccount {
                            private double balance;

                            void deposit(double amount) {
                                if (amount > 0) {
                                    balance += amount;
                                }
                            }

                            double getBalance() {
                                return balance;
                            }
                        }
                        """,
                        "Why make fields private?",
                        List.of("To control how data changes", "To make code slower", "To delete methods", "To avoid classes"),
                        0,
                        "Private fields can be changed only through controlled class methods.",
                        "Protected Bank Balance",
                        "Prevent invalid balance updates.",
                        "Create a BankAccount class where balance can only change through deposit and withdraw methods.",
                        List.of("Make balance private.", "Add deposit with validation.", "Add withdraw with validation.", "Print balance using a getter."),
                        """
                        class BankAccount {
                            private double balance;
                        }
                        """,
                        "Your project begins using rules inside objects instead of trusting every caller."
                ),
                lesson(
                        "abstraction",
                        "Abstraction hides details and exposes the useful action. The user of your code should know what to call, not every internal step. In Java, abstract classes and interfaces help define this shape. The benefit is focus: callers depend on behavior, not implementation details.",
                        """
                        abstract class Payment {
                            abstract void pay(double amount);
                        }

                        class UpiPayment extends Payment {
                            void pay(double amount) {
                                System.out.println("Paid by UPI: " + amount);
                            }
                        }
                        """,
                        "What does abstraction mainly hide?",
                        List.of("Implementation details", "All code", "Class names", "The JVM"),
                        0,
                        "Abstraction keeps the important action visible and the internal details hidden.",
                        "Payment Action",
                        "Design a clear action without exposing all internals.",
                        "Create an abstract Payment class and one concrete payment type.",
                        List.of("Create an abstract class.", "Add an abstract pay method.", "Create a child class.", "Call pay from main."),
                        """
                        abstract class Payment {
                            abstract void pay(double amount);
                        }
                        """,
                        "This prepares your toolkit for features where different implementations share one public action."
                ),
                lesson(
                        "interfaces",
                        "An interface is a contract. It says what a class can do without deciding how it does it. Interfaces are perfect when unrelated classes share a capability, like Printable, Payable, or Searchable.",
                        """
                        interface Printable {
                            void print();
                        }

                        class Invoice implements Printable {
                            public void print() {
                                System.out.println("Printing invoice");
                            }
                        }
                        """,
                        "Which keyword does a class use for an interface?",
                        List.of("implements", "extends only", "interfaceof", "contract"),
                        0,
                        "A class implements an interface and provides the required methods.",
                        "Printable Reports",
                        "Make different reports follow one print contract.",
                        "Create a Printable interface and two classes that implement it.",
                        List.of("Create Printable with print method.", "Create StudentReport.", "Create BillReport.", "Call print on both."),
                        """
                        interface Printable {
                            void print();
                        }
                        """,
                        "Your toolkit can now add report types without changing how printing is called."
                ),
                lesson(
                        "try-catch-block",
                        "Exceptions are Java objects that represent something going wrong while the program runs. try contains risky code. catch handles a specific problem. finally runs cleanup. Good exception handling does not hide errors; it gives the user a safe message and keeps the program under control.",
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
                        """,
                        "Where should risky code go?",
                        List.of("try block", "class name", "import line", "package folder"),
                        0,
                        "Risky runtime code belongs in try so matching catch blocks can handle failures.",
                        "Safe Division",
                        "Stop one bad calculation from crashing the whole program.",
                        "Create a divide operation that handles division by zero with a clear message.",
                        List.of("Create numerator and denominator variables.", "Put division inside try.", "Catch ArithmeticException.", "Print a friendly error message."),
                        """
                        public class Main {
                            public static void main(String[] args) {
                                int a = 10;
                                int b = 0;
                            }
                        }
                        """,
                        "Your calculator becomes safer for real user input."
                ),
                lesson(
                        "custom-exceptions",
                        "A custom exception gives a business rule its own name. Instead of throwing a vague RuntimeException, you can throw InvalidMarksException or InsufficientBalanceException. This makes failures easier to understand and handle.",
                        """
                        class InvalidMarksException extends RuntimeException {
                            InvalidMarksException(String message) {
                                super(message);
                            }
                        }
                        """,
                        "Why create a custom exception?",
                        List.of("To describe a project-specific error clearly", "To avoid all errors", "To replace classes", "To run loops faster"),
                        0,
                        "Custom exceptions make domain rules visible and meaningful.",
                        "Invalid Marks Rule",
                        "Give one validation failure a clear name.",
                        "Throw InvalidMarksException when marks are below 0 or above 100.",
                        List.of("Create a custom exception class.", "Write a validateMarks method.", "Throw the exception for invalid values.", "Catch it and print the message."),
                        """
                        class InvalidMarksException extends RuntimeException {
                        }
                        """,
                        "Your toolkit gains project-grade validation instead of silent wrong data."
                )
        );
    }

    private LessonSeed lesson(
            String slug,
            String explanation,
            String code,
            String quizQuestion,
            List<String> quizOptions,
            int correctAnswer,
            String quizExplanation,
            String taskTitle,
            String taskBrief,
            String taskGoal,
            List<String> taskSteps,
            String starterCode,
            String projectConnection
    ) {
        return new LessonSeed(
                slug,
                explanation,
                code,
                quizQuestion,
                quizOptions,
                correctAnswer,
                quizExplanation,
                taskTitle,
                taskBrief,
                taskGoal,
                taskSteps,
                starterCode,
                projectConnection
        );
    }

    private record LessonSeed(
            String slug,
            String explanation,
            String code,
            String quizQuestion,
            List<String> quizOptions,
            int correctAnswer,
            String quizExplanation,
            String taskTitle,
            String taskBrief,
            String taskGoal,
            List<String> taskSteps,
            String starterCode,
            String projectConnection
    ) {
    }
}
