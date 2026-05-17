package com.letscrackitt.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.letscrackitt.backend.entity.ContentBlock;
import com.letscrackitt.backend.entity.Course;
import com.letscrackitt.backend.entity.Lesson;
import com.letscrackitt.backend.entity.Module;
import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.Quiz;
import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.entity.enums.BlockType;
import com.letscrackitt.backend.entity.enums.Difficulty;
import com.letscrackitt.backend.repository.ContentBlockRepository;
import com.letscrackitt.backend.repository.CourseRepository;
import com.letscrackitt.backend.repository.LessonRepository;
import com.letscrackitt.backend.repository.ModuleRepository;
import com.letscrackitt.backend.repository.NoteRepository;
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
@Order(4)
@RequiredArgsConstructor
public class ReactCurriculumSeeder implements CommandLineRunner {

    private final EntityManager entityManager;
    private final ObjectMapper objectMapper;

    private final TopicRepository topicRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final ContentBlockRepository contentBlockRepository;
    private final NoteRepository noteRepository;
    private final QuizRepository quizRepository;

    @Override
    @Transactional
    public void run(String... args) {

        Topic react = topicRepository.findBySlug("react")
                .orElseGet(() -> topicRepository.save(

                        Topic.builder()
                                .slug("react")
                                .title("React")
                                .category("Frontend")
                                .description("Learn React from absolute beginner to advanced frontend developer.")
                                .icon("React")
                                .color("#06b6d4")
                                .orderIndex(3)
                                .build()
                ));

        wipeReactData();

        Course course = courseRepository.save(

                Course.builder()
                        .title("React")
                        .slug("react")
                        .description("A complete beginner-first React curriculum.")
                        .icon("⚛️")
                        .color("#06b6d4")
                        .topicId(react.getId())
                        .build()
        );

        seedModules(course);

        seedNotes(react);

        seedQuizzes(react);
    }

    private void wipeReactData() {

        execute("""
                delete from content_block where lesson_id in (
                    select l.id from lesson l
                    join module m on l.module_id = m.id
                    join course c on m.course_id = c.id
                    where c.slug = 'react'
                )
                """);

        execute("""
                delete from lesson where module_id in (
                    select m.id from module m
                    join course c on m.course_id = c.id
                    where c.slug = 'react'
                )
                """);

        execute("""
                delete from module where course_id in (
                    select id from course where slug = 'react'
                )
                """);

        execute("delete from course where slug = 'react'");
    }

    private void execute(String sql) {
        entityManager.createNativeQuery(sql).executeUpdate();
    }

    private void seedModules(Course course) {

        Module fundamentals = saveModule(
                course,
                "React Fundamentals",
                1
        );

        seedLesson(
                fundamentals,
                1,
                "what-is-react",
                "What Is React",
                """
                React is a JavaScript library used to build user interfaces.

                Instead of manually updating the DOM again and again,
                React updates only the changed parts efficiently using
                the Virtual DOM.

                React is component based.
                Every UI is divided into reusable pieces called components.

                Big applications become easier to manage because UI
                is split into smaller reusable blocks.
                """,
                """
                function App() {
                  return <h1>Hello React</h1>;
                }

                export default App;
                """
        );

        seedLesson(
                fundamentals,
                2,
                "dom-and-virtual-dom",
                "DOM And Virtual DOM",
                """
                The DOM represents the webpage as a tree structure.

                Updating the real DOM repeatedly is expensive.

                React solves this using the Virtual DOM.

                React creates a lightweight copy of the DOM,
                compares changes using diffing,
                then updates only the changed elements.

                This makes React applications fast.
                """,
                """
                function App() {

                  const name = "Rahul";

                  return (
                    <div>
                      <h1>{name}</h1>
                    </div>
                  );
                }
                """
        );

        seedLesson(
                fundamentals,
                3,
                "what-is-jsx",
                "What Is JSX",
                """
                JSX means JavaScript XML.

                JSX allows HTML-like syntax inside JavaScript.

                Babel converts JSX into React.createElement()
                calls during build time.

                JSX makes UI easier to read and write.
                """,
                """
                const element = <h1>Hello React</h1>;
                """
        );

        seedLesson(
                fundamentals,
                4,
                "jsx-rules",
                "JSX Rules",
                """
                JSX follows important rules.

                - Must return one parent element
                - class becomes className
                - JavaScript goes inside curly braces
                - Self closing tags must close

                These rules help React understand UI structure correctly.
                """,
                """
                function App() {

                  return (
                    <>
                      <h1>Hello</h1>
                      <p>Learning React</p>
                    </>
                  );
                }
                """
        );

        Module components = saveModule(
                course,
                "Components",
                2
        );

        seedLesson(
                components,
                1,
                "functional-components",
                "Functional Components",
                """
                Functional Components are simple JavaScript functions
                that return JSX.

                Modern React mainly uses functional components.

                Hooks work inside functional components.
                """,
                """
                function Greeting() {
                  return <h1>Hello Rahul</h1>;
                }

                export default Greeting;
                """
        );

        seedLesson(
                components,
                2,
                "class-components",
                "Class Components",
                """
                Class Components are older React components
                based on ES6 classes.

                Before Hooks,
                state and lifecycle features were mainly handled
                using class components.
                """,
                """
                import React from "react";

                class Greeting extends React.Component {

                  render() {
                    return <h1>Hello Rahul</h1>;
                  }

                }

                export default Greeting;
                """
        );

        seedLesson(
                components,
                3,
                "props-in-react",
                "Props In React",
                """
                Props are used to pass data from parent
                components to child components.

                Props are read-only.

                They help components become reusable.
                """,
                """
                function Welcome(props) {
                  return <h1>Hello {props.name}</h1>;
                }

                export default Welcome;
                """
        );

        seedLesson(
                components,
                4,
                "state-in-react",
                "State In React",
                """
                State stores dynamic data inside components.

                When state changes,
                React re-renders the component.

                State makes UI interactive.
                """,
                """
                import { useState } from "react";

                function Counter() {

                  const [count, setCount] = useState(0);

                  return (
                    <button onClick={() => setCount(count + 1)}>
                      {count}
                    </button>
                  );
                }
                """
        );

        Module hooks = saveModule(
                course,
                "React Hooks",
                3
        );

        seedLesson(
                hooks,
                1,
                "introduction-to-hooks",
                "Introduction To Hooks",
                """
                Hooks were introduced in React 16.8.

                Before Hooks,
                developers used class components for state and lifecycle logic.

                Hooks allow functional components to use:
                - state
                - lifecycle features
                - context
                - refs

                Hooks make React cleaner and reusable.
                """,
                """
                import { useState } from "react";

                function App() {

                  const [count, setCount] = useState(0);

                  return (
                    <button onClick={() => setCount(count + 1)}>
                      {count}
                    </button>
                  );
                }
                """
        );

        seedLesson(
                hooks,
                2,
                "react-usestate",
                "useState Hook",
                """
                useState adds state to functional components.

                It returns:
                - current state value
                - setter function

                State updates are asynchronous and batched.
                """,
                """
                import { useState } from "react";

                function Counter() {

                  const [count, setCount] = useState(0);

                  return (
                    <button onClick={() => setCount(count + 1)}>
                      {count}
                    </button>
                  );
                }
                """
        );

        seedLesson(
                hooks,
                3,
                "react-useeffect",
                "useEffect Hook",
                """
                useEffect handles side effects.

                Examples:
                - API calls
                - timers
                - subscriptions
                - event listeners

                React first renders UI,
                then useEffect runs after rendering.
                """,
                """
                import { useEffect } from "react";

                function App() {

                  useEffect(() => {
                    console.log("Component Mounted");
                  }, []);

                  return <h1>Hello</h1>;
                }
                """
        );

        seedLesson(
                hooks,
                4,
                "react-usecontext",
                "useContext Hook",
                """
                useContext shares data globally.

                It avoids prop drilling.

                Common use cases:
                - authentication
                - theme
                - language
                """,
                """
                const value = useContext(UserContext);
                """
        );

        seedLesson(
                hooks,
                5,
                "react-usereducer",
                "useReducer Hook",
                """
                useReducer manages complex state logic.

                It works similarly to Redux reducers.

                Best for:
                - large state
                - multiple related updates
                """,
                """
                const [state, dispatch] = useReducer(
                  reducer,
                  initialState
                );
                """
        );

        seedLesson(
                hooks,
                6,
                "react-useref",
                "useRef Hook",
                """
                useRef accesses DOM elements directly.

                It can also store mutable values
                without re-rendering components.
                """,
                """
                import { useRef } from "react";

                function App() {

                  const inputRef = useRef();

                  return <input ref={inputRef} />;
                }
                """
        );

        seedLesson(
                hooks,
                7,
                "react-usememo",
                "useMemo Hook",
                """
                useMemo memoizes calculated values.

                It prevents unnecessary recalculations
                during re-renders.

                It is used for performance optimization.
                """,
                """
                const expensiveValue = useMemo(() => {
                  return heavyCalculation(data);
                }, [data]);
                """
        );

        seedLesson(
                hooks,
                8,
                "react-usecallback",
                "useCallback Hook",
                """
                useCallback memoizes functions.

                It prevents unnecessary recreation
                of functions during rendering.
                """,
                """
                const handleClick = useCallback(() => {
                  console.log("Clicked");
                }, []);
                """
        );

        Module advanced = saveModule(
                course,
                "Advanced React",
                4
        );

        seedLesson(
                advanced,
                1,
                "higher-order-components",
                "Higher Order Components",
                """
                Higher Order Components are functions
                that take a component
                and return an enhanced component.

                HOCs are used for reusable logic.
                """,
                """
                const EnhancedComponent =
                  higherOrderComponent(MyComponent);
                """
        );

        seedLesson(
                advanced,
                2,
                "react-lifecycle",
                "React Lifecycle",
                """
                React components go through lifecycle phases.

                Mounting:
                component created and added to DOM

                Updating:
                component re-renders because of state or props changes

                Unmounting:
                component removed from DOM
                """,
                """
                componentDidMount()

                componentDidUpdate()

                componentWillUnmount()
                """
        );

        seedLesson(
                advanced,
                3,
                "conditional-rendering",
                "Conditional Rendering",
                """
                React can render UI conditionally.

                Different UI appears based on conditions.
                """,
                """
                {
                  isLoggedIn
                    ? <Home />
                    : <Login />
                }
                """
        );

        seedLesson(
                advanced,
                4,
                "lists-and-keys",
                "Lists And Keys",
                """
                React uses keys to identify elements efficiently.

                Keys help React update lists correctly.
                """,
                """
                items.map(item => (
                  <li key={item.id}>
                    {item.name}
                  </li>
                ))
                """
        );
    }

    private Module saveModule(
            Course course,
            String title,
            int order
    ) {

        return moduleRepository.save(

                Module.builder()
                        .title(title)
                        .displayOrder(order)
                        .course(course)
                        .build()
        );
    }

    private void seedLesson(
            Module module,
            int order,
            String slug,
            String title,
            String explanation,
            String code
    ) {

        Lesson lesson = lessonRepository.save(

                Lesson.builder()
                        .title(title)
                        .slug(slug)
                        .description(explanation)
                        .displayOrder(order)
                        .module(module)
                        .likes(0)
                        .build()
        );

        contentBlockRepository.saveAll(

                List.of(

                        block(
                                lesson,
                                BlockType.TEXT,
                                1,
                                Map.of(
                                        "content", explanation
                                )
                        ),

                        block(
                                lesson,
                                BlockType.CODE,
                                2,
                                Map.of(
                                        "language", "jsx",
                                        "code", code
                                )
                        ),

                        block(
                                lesson,
                                BlockType.QUIZ,
                                3,
                                quizData(title)
                        ),

                        block(
                                lesson,
                                BlockType.TASK,
                                4,
                                taskData(title, code)
                        )
                )
        );
    }

    private Map<String, Object> quizData(String title) {

        Map<String, Object> data = new LinkedHashMap<>();

        data.put(
                "question",
                "What is the main purpose of " + title + "?"
        );

        data.put(
                "options",
                List.of(
                        "React concept",
                        "Database",
                        "Operating System",
                        "Browser"
                )
        );

        data.put("correctAnswer", 0);

        data.put(
                "explanation",
                title + " is an important React concept."
        );

        return data;
    }

    private Map<String, Object> taskData(
            String title,
            String code
    ) {

        Map<String, Object> data = new LinkedHashMap<>();

        data.put(
                "title",
                title + " Practice"
        );

        data.put(
                "brief",
                "Practice the React concept immediately."
        );

        data.put(
                "goal",
                "Build a small working React example."
        );

        data.put(
                "steps",
                List.of(
                        "Run the example.",
                        "Change one value.",
                        "Observe UI updates.",
                        "Explain the result."
                )
        );

        data.put(
                "starterCode",
                code
        );

        data.put(
                "projectConnection",
                "This becomes part of your React learning project."
        );

        return data;
    }

    private ContentBlock block(
            Lesson lesson,
            BlockType type,
            int order,
            Map<String, Object> data
    ) {

        try {

            return ContentBlock.builder()
                    .lesson(lesson)
                    .type(type)
                    .displayOrder(order)
                    .data(objectMapper.writeValueAsString(data))
                    .build();

        } catch (Exception ex) {

            throw new IllegalStateException(
                    "Could not serialize React content",
                    ex
            );
        }
    }

    private void seedNotes(Topic react) {

        noteRepository.save(

                Note.builder()
                        .topic(react)
                        .slug("react-complete-roadmap")
                        .title("React Complete Roadmap")
                        .difficulty(Difficulty.BEGINNER)
                        .tags("react,frontend,javascript,hooks")
                        .content("""
                                # React Complete Roadmap

                                ## Beginner
                                - HTML CSS JavaScript
                                - DOM
                                - Virtual DOM
                                - JSX
                                - Components
                                - Props
                                - State

                                ## Intermediate
                                - Hooks
                                - Routing
                                - API calls
                                - Forms
                                - Context API

                                ## Advanced
                                - Performance optimization
                                - Redux
                                - Architecture
                                - Advanced rendering
                                - Deployment
                                """)
                        .xpReward(25)
                        .viewCount(0)
                        .isPublished(true)
                        .build()
        );
    }

    private void seedQuizzes(Topic react) {

        quizRepository.saveAll(

                List.of(

                        quiz(
                                react,
                                "What does JSX stand for?",
                                "JavaScript XML",
                                "Java Syntax Extension",
                                "JSON XML",
                                "Java Extended Syntax",
                                "A",
                                "JSX means JavaScript XML."
                        ),

                        quiz(
                                react,
                                "Which hook adds state?",
                                "useState",
                                "useEffect",
                                "useRef",
                                "useMemo",
                                "A",
                                "useState adds state to functional components."
                        ),

                        quiz(
                                react,
                                "Which hook handles side effects?",
                                "useEffect",
                                "useState",
                                "useReducer",
                                "useMemo",
                                "A",
                                "useEffect handles side effects."
                        )
                )
        );
    }

    private Quiz quiz(
            Topic topic,
            String question,
            String a,
            String b,
            String c,
            String d,
            String correct,
            String explanation
    ) {

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
}