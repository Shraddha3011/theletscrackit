package com.letscrackitt.backend.config;

import com.letscrackitt.backend.entity.*;
import com.letscrackitt.backend.entity.Module;
import com.letscrackitt.backend.entity.enums.BlockType;
import com.letscrackitt.backend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReactCurriculumSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final ContentBlockRepository contentBlockRepository;
    private final QuizRepository quizRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        Topic react = topicRepository.findBySlug("react")
                .orElseGet(() -> topicRepository.save(
                        Topic.builder()
                                .slug("react")
                                .title("React")
                                .category("Frontend")
                                .description("Build component-driven user interfaces with hooks and state management.")
                                .icon("React")
                                .color("#3b82f6")
                                .orderIndex(3)
                                .build()
                ));

        react.setTitle("React");
        react.setCategory("Frontend");
        react.setDescription("Build component-driven user interfaces with hooks and state management.");
        react.setIcon("React");
        react.setColor("#3b82f6");
        topicRepository.save(react);

        if (currentCurriculumInstalled(react.getId())) {
            return;
        }

        wipeReactData(react.getId());

        Course course = courseRepository.save(
                Course.builder()
                        .title("React: Complete Beginner to Advanced")
                        .slug("react")
                        .description("Master React from basics to advanced concepts including hooks, state, and component patterns.")
                        .icon("React")
                        .color("#3b82f6")
                        .topicId(react.getId())
                        .build()
        );

        seedModules(course);
        seedReactQuizzes(react);
    }

    private boolean currentCurriculumInstalled(Long topicId) {
        long reactCourses = ((Number) entityManager
                .createNativeQuery("select count(*) from course where slug = 'react'")
                .getSingleResult())
                .longValue();

        long reactLessons = ((Number) entityManager
                .createNativeQuery("""
                        select count(*) from lesson l
                        join module m on l.module_id = m.id
                        join course c on m.course_id = c.id
                        where c.slug = 'react'
                        """)
                .getSingleResult())
                .longValue();

        return reactCourses == 1 && reactLessons >= 8;
    }

    private void wipeReactData(Long topicId) {
        entityManager.createNativeQuery("DELETE FROM content_block").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM lesson").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM module WHERE course_id IN (SELECT id FROM course WHERE topic_id = :tid)")
                .setParameter("tid", topicId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM course WHERE topic_id = :tid")
                .setParameter("tid", topicId).executeUpdate();
    }

    private void seedModules(Course course) {
        // Module 1: Introduction to React
        Module mod1 = moduleRepository.save(Module.builder()
                .title("Introduction to React")
                .displayOrder(1)
                .course(course)
                .build());
        createLesson(mod1, 1, "What is React?", "what-is-react",
                "Learn what React is and why it's the most popular frontend library.",
                createBlocks(BlockType.TEXT, "{\"story\":\"React is a JavaScript library for building user interfaces. It was developed by Facebook and is now used by millions of developers worldwide.\",\"content\":\"React is a JavaScript library for building user interfaces. It was developed by Facebook (now Meta) and released in 2013.\\n\\n**Why React?**\\n\\n- **Component-Based**: Build encapsulated components that manage their own state\\n- **Declarative**: Design simple views for each state in your application\\n- **Learn Once, Write Anywhere**: Develop new features without rewriting existing code\\n\\n**Key Features:**\\n- Virtual DOM for optimal performance\\n- JSX for writing HTML-like code in JavaScript\\n- One-way data binding\\n- Rich ecosystem of tools and libraries\",\"points\":[\"React is a JavaScript library, not a framework\",\"Created by Jordan Walke at Facebook\",\"React uses a virtual DOM for efficient updates\",\"JSX allows writing HTML in JavaScript\"]}"));

        createLesson(mod1, 2, "The DOM Explained", "the-dom",
                "Understand the Document Object Model and how React interacts with it.",
                createBlocks(BlockType.TEXT, "{\"content\":\"The DOM (Document Object Model) is a programming interface that represents a web page as a structured tree of objects.\\n\\n**How DOM Works:**\\n\\n1. Browser parses HTML and creates a tree of nodes\\n2. Each element, attribute, and text becomes a node\\n3. JavaScript can access and modify these nodes\\n\\n**Problem with Traditional DOM:**\\n\\n- Every change triggers re-rendering\\n- Large apps become slow\\n- Complex to manage\\n\\n**React's Solution - Virtual DOM:**\\n\\n- Lightweight copy of real DOM\\n- Changes happen in virtual DOM first\\n- React calculates minimal changes needed\\n- Updates only what changed in real DOM\\n\\nThis makes React extremely fast and efficient!\",\"points\":[\"DOM is a tree representation of HTML\",\"Traditional DOM is slow for frequent updates\",\"Virtual DOM is React's optimization\",\"React minimizes real DOM updates\"]}"));

        createLesson(mod1, 3, "Setting Up React", "setting-up-react",
                "Learn how to set up a React development environment.",
                createBlocks(BlockType.TEXT, "{\"content\":\"**Ways to Create a React App:**\\n\\n1. **Create React App (CRA)**\\n   - npx create-react-app my-app\\n   - Official method, but being replaced\\n\\n2. **Vite (Recommended)**\\n   - npm create vite@latest my-app -- --template react\\n   - Faster, modern approach\\n\\n3. **Using CDN (Not recommended for development)**\\n   - Add React script tags directly\\n\\n**After setup:**\\n\\n```bash\\ncd my-app\\nnpm install\\nnpm run dev\\n```\\n\\n**Project Structure:**\\n- `src/App.jsx` - Main component\\n- `src/main.jsx` - Entry point\\n- `index.html` - HTML template\",\"points\":[\"Vite is the recommended way to create React apps\",\"npm create vite@latest --template react\",\"npm run dev starts development server\",\"src folder contains your React code\"]}"));

        // Module 2: JSX and Components
        Module mod2 = moduleRepository.save(Module.builder()
                .title("JSX and Components")
                .displayOrder(2)
                .course(course)
                .build());
        createLesson(mod2, 1, "What is JSX?", "what-is-jsx",
                "Learn about JSX - JavaScript XML for writing HTML in React.",
                createBlocks(BlockType.TEXT, "{\"content\":\"JSX is JavaScript XML — it lets you write HTML-like syntax inside JavaScript.\\n\\n**Why JSX?**\\n\\n- Makes code more readable\\n- Combines HTML and logic in one place\\n- React can optimize it\\n\\n**How JSX Works:**\\n\\nBabel (a JavaScript compiler) converts JSX to `React.createElement()` calls at build time.\\n\\n**Example:**\\n\\n```jsx\\n// JSX\\nconst element = <h1>Hello!</h1>;\\n\\n// Compiled to:\\nconst element = React.createElement('h1', null, 'Hello!');\\n```\\n\\n**Embedding JavaScript:**\\n\\n```jsx\\nconst name = 'Rahul';\\nconst element = <h1>Hello, {name}!</h1>;\\n```\\n\\nYou can use any JavaScript expression inside curly braces {}.\",\"points\":[\"JSX stands for JavaScript XML\",\"JSX is not HTML - it's JavaScript\",\"Babel compiles JSX to React.createElement\",\"Use curly braces {} for JavaScript in JSX\"]}"));

        createLesson(mod2, 2, "Functional Components", "functional-components",
                "Learn about functional components - the modern way to write React components.",
                createBlocks(BlockType.TEXT, "{\"content\":\"A simple JavaScript function that returns JSX.\\n\\n**Function Component:**\\n\\n```jsx\\nfunction Greeting() {\\n  return <h1>Hello Rahul</h1>;\\n}\\n```\\n\\n**Arrow Function Version:**\\n\\n```jsx\\nconst Greeting = () => {\\n  return <h1>Hello Rahul</h1>;\\n};\\n```\\n\\n**With Props:**\\n\\n```jsx\\nfunction Greeting({ name }) {\\n  return <h1>Hello {name}!</h1>;\\n}\\n\\n// Usage\\n<Greeting name=\\\"Rahul\\\" />\\n```\\n\\n**Why Functional Components?**\\n\\n- Less code than class components\\n- Easier to understand\\n- Better performance\\n- Works with React Hooks\\n\\nSince React 16.8, functional components can do everything class components can do using hooks.\",\"points\":[\"Functional components are just JavaScript functions\",\"They must return JSX or null\",\"Arrow functions work as components\",\"Props are passed as arguments\"]}"));

        createLesson(mod2, 3, "Class Components", "class-components",
                "Learn about class components - the older way to write React components.",
                createBlocks(BlockType.TEXT, "{\"content\":\"A JavaScript class that extends React.Component and has a render method.\\n\\n**Class Component Example:**\\n\\n```jsx\\nimport React from \\\"react\\\";\\n\\nclass Greeting extends React.Component {\\n  render() {\\n    return <h1>Hello Rahul</h1>;\\n  }\\n}\\n```\\n\\n**With Props:**\\n\\n```jsx\\nclass Greeting extends React.Component {\\n  render() {\\n    return <h1>Hello {this.props.name}!</h1>;\\n  }\\n}\\n```\\n\\n**Lifecycle Methods:**\\n\\n- `constructor()` - Initialize state\\n- `componentDidMount()` - After first render\\n- `componentDidUpdate()` - After updates\\n- `componentWillUnmount()` - Before removal\\n\\n**Note:** Functional components with hooks are now preferred over class components.\",\"points\":[\"Class components extend React.Component\",\"Must have a render() method\",\"Access props via this.props\",\"Lifecycle methods available\"]}"));

        createLesson(mod2, 4, "JSX Rules", "jsx-rules",
                "Important rules to follow when writing JSX.",
                createBlocks(BlockType.TEXT, "{\"content\":\"**JSX Rules:**\\n\\n**1. Must return one parent element**\\n\\n```jsx\\n// Wrong\\nreturn (\\n  <h1>Title</h1>\\n  <p>Text</p>\\n);\\n\\n// Correct - wrap in div or use Fragment\\nreturn (\\n  <div>\\n    <h1>Title</h1>\\n    <p>Text</p>\\n  </div>\\n);\\n```\\n\\n**2. Use Fragment for no extra DOM nodes**\\n\\n```jsx\\nreturn (\\n  <>\\n    <h1>Title</h1>\\n    <p>Text</p>\\n  </>\\n);\\n```\\n\\n**3. class becomes className**\\n\\n```jsx\\n// Wrong - class is reserved in JS\\n<div class=\\\"container\\\">\\n\\n// Correct\\n<div className=\\\"container\\\">\\n```\\n\\n**4. JavaScript inside curly braces**\\n\\n```jsx\\nconst name = 'Rahul';\\n<div>{name}</div>\\n<div>{2 + 2}</div>\\n<div>{arr.map(item => <p>{item}</p>)}</div>\\n```\\n\\n**5. Self closing tags must close**\\n\\n```jsx\\n<br />\\n<img src=\\\"...\\\" />\\n<input />\\n```\",\"points\":[\"JSX must have one parent element\",\"Use className instead of class\",\"Use {} for JavaScript expressions\",\"Self-closing tags need />\"]}"));

        // Module 3: React Hooks
        Module mod3 = moduleRepository.save(Module.builder()
                .title("React Hooks")
                .displayOrder(3)
                .course(course)
                .build());
        createLesson(mod3, 1, "Introduction to Hooks", "intro-to-hooks",
                "Learn what React Hooks are and why they were introduced.",
                createBlocks(BlockType.TEXT, "{\"content\":\"**What are Hooks?**\\n\\nHooks are functions that let you use state and other React features in functional components.\\n\\n**Why Were Hooks Introduced?**\\n\\nBefore hooks, we had to use class components to manage state and lifecycle methods. This had problems:\\n\\n- Complex code with this keyword\\n- Hard to share logic between components\\n- Boilerplate code\\n\\nHooks were introduced in React 16.8 to let functional components do everything class components could do — but with cleaner, simpler code.\\n\\n**Benefits of Hooks:**\\n\\n1. **Cleaner Code** - No more 'this' keyword\\n2. **Reusable Logic** - Custom hooks share logic\\n3. **Better Organization** - Related code together\\n4. **Easier Testing** - Functions are easier to test\\n\\n**Important Points:**\\n\\n- State updates are asynchronous\\n- React schedules updates for next render\\n- Multiple updates are batched together\\n- Hooks can only be called at the top level\",\"points\":[\"Hooks let functional components have state\",\"Introduced in React 16.8\",\"State updates are asynchronous and batched\",\"Custom hooks share logic between components\"]}"));

        createLesson(mod3, 2, "useState Hook", "usestate-hook",
                "Learn how to add state to functional components with useState.",
                createBlocks(BlockType.TEXT, "{\"content\":\"useState is a hook that adds state to functional components.\\n\\n**Basic Syntax:**\\n\\n```jsx\\nimport { useState } from 'react';\\n\\nfunction Counter() {\\n  const [count, setCount] = useState(0);\\n  \\n  return (\\n    <div>\\n      <p>Count: {count}</p>\\n      <button onClick={() => setCount(count + 1)}>\\n        Increment\\n      </button>\\n    </div>\\n  );\\n}\\n```\\n\\n**How it works:**\\n\\n- `useState(0)` - Initial value is 0\\n- Returns array: [currentState, setterFunction]\\n- `count` - current state value\\n- `setCount` - function to update state\\n\\n**Key Points:**\\n\\n- When setter is called, React re-renders the component\\n- State updates are asynchronous\\n- Multiple updates are batched\\n- State is isolated per component\\n\\n**Multiple States:**\\n\\n```jsx\\nconst [name, setName] = useState('');\\nconst [age, setAge] = useState(0);\\nconst [isActive, setIsActive] = useState(false);\\n```\",\"points\":[\"useState returns [state, setter] array\",\"Initial value passed to useState\",\"setter function triggers re-render\",\"State is independent per component\"]}"));

        createLesson(mod3, 3, "useEffect Hook", "useeffect-hook",
                "Learn how to perform side effects with useEffect.",
                createBlocks(BlockType.TEXT, "{\"content\":\"useEffect lets you perform side effects in functional components.\\n\\n**What are Side Effects?**\\n\\n- Fetching data\\n- Setting up subscriptions\\n- Manually changing DOM\\n- Timers\\n\\n**Basic Syntax:**\\n\\n```jsx\\nimport { useEffect, useState } from 'react';\\n\\nfunction App() {\\n  const [data, setData] = useState(null);\\n  \\n  useEffect(() => {\\n    // This runs after every render\\n    fetchData();\\n  });\\n}\\n```\\n\\n**With Cleanup:**\\n\\n```jsx\\nuseEffect(() => {\\n  const timer = setInterval(() => {\\n    console.log('Tick');\\n  }, 1000);\\n  \\n  // Cleanup function\\n  return () => clearInterval(timer);\\n}, []); // empty dependency array\\n```\\n\\n**Dependency Array:**\\n\\n- `[]` - Runs only on mount (like componentDidMount)\\n- `[value]` - Runs when value changes\\n- No array - Runs on every render\\n\\n**Common Use Cases:**\\n\\n- Fetching API data\\n- Setting up subscriptions\\n- Timer management\",\"points\":[\"useEffect runs after render\",\"Return cleanup function for unmounting\",\"Dependency array controls when effect runs\",\"Run on mount = empty array []\"]}"));

        createLesson(mod3, 4, "Other Important Hooks", "other-hooks",
                "Learn about useContext, useReducer, useMemo, useCallback, and useRef.",
                createBlocks(BlockType.TEXT, "{\"content\":\"**useContext**\\n\\nAccess global data without prop drilling:\\n\\n```jsx\\nconst ThemeContext = createContext();\\n\\nfunction App() {\\n  return (\\n    <ThemeContext.Provider value=\\\"dark\\\">\\n      <Component />\\n    </ThemeContext.Provider>\\n  );\\n}\\n\\nfunction Component() {\\n  const theme = useContext(ThemeContext);\\n}\\n```\\n\\n**useReducer**\\n\\nComplex state management:\\n\\n```jsx\\nconst [state, dispatch] = useReducer(reducer, initialState);\\n```\\n\\n**useMemo**\\n\\nMemoize expensive calculations:\\n\\n```jsx\\nconst value = useMemo(() => {\\n  return expensiveCalculation(a, b);\\n}, [a, b]);\\n```\\n\\n**useCallback**\\n\\nMemoize functions:\\n\\n```jsx\\nconst handleClick = useCallback(() => {\\n  // function logic\\n}, [dependencies]);\\n```\\n\\n**useRef**\\n\\nReference DOM elements or persist values:\\n\\n```jsx\\nconst inputRef = useRef(null);\\ninputRef.current.focus(); // Access DOM node\\n```\",\"points\":[\"useContext for global state\",\"useReducer for complex state\",\"useMemo for expensive calculations\",\"useCallback to prevent function recreation\",\"useRef for DOM access and value persistence\"]}"));

        // Module 4: Advanced Concepts
        Module mod4 = moduleRepository.save(Module.builder()
                .title("Advanced Concepts")
                .displayOrder(4)
                .course(course)
                .build());
        createLesson(mod4, 1, "Higher Order Components", "higher-order-components",
                "Learn about HOCs - functions that take a component and return a new component.",
                createBlocks(BlockType.TEXT, "{\"content\":\"**What are Higher Order Components?**\\n\\nA Higher Order Component (HOC) is a function that takes a component and returns a new enhanced component.\\n\\n**Purpose:**\\n\\n- Reuse component logic\\n- Add shared functionality\\n- Modify component behavior\\n\\n**Example:**\\n\\n```jsx\\n// HOC that adds loading state\\nfunction withLoading(Component) {\\n  return function WithLoading({ isLoading, ...props }) {\\n    if (isLoading) return <div>Loading...</div>;\\n    return <Component {...props} />;\\n  };\\n}\\n\\n// Usage\\nconst UserProfileWithLoading = withLoading(UserProfile);\\n\\n<UserProfileWithLoading isLoading={true} user={user} />\\n```\\n\\n**Common HOC Patterns:**\\n\\n- Authentication (withAuth)\\n- Data fetching (withData)\\n- Error handling (withError)\\n\\n**Note:** Custom hooks are now preferred over HOCs for most use cases.\",\"points\":[\"HOC is a function that takes a component\",\"Returns a new enhanced component\",\"Used for code reusability\",\"Custom hooks are modern alternative\"]}"));

        createLesson(mod4, 2, "Component Lifecycle", "component-lifecycle",
                "Learn about the three phases of React component lifecycle.",
                createBlocks(BlockType.TEXT, "{\"content\":\"**React Component Lifecycle**\\n\\nReact components go through three main phases:\\n\\n**1. MOUNTING**\\n\\nComponent is created and added to DOM.\\n\\nIn functional components with useEffect:\\n- `useEffect(() => {}, [])` - Runs on mount\\n\\n**2. UPDATING**\\n\\nState or props change, component re-renders.\\n\\nIn functional components:\\n- `useEffect(() => {})` - Runs on every update\\n- `useEffect(() => {}, [dep])` - Runs when dependency changes\\n\\n**3. UNMOUNTING**\\n\\nComponent is removed from DOM.\\n\\nIn functional components:\\n- `useEffect(() => { return () => {} }, [])` - Cleanup function runs on unmount\\n\\n**Class Component Methods:**\\n\\n- constructor()\\n- componentDidMount()\\n- componentDidUpdate()\\n- componentWillUnmount()\\n\\n**Key Concept:**\\n\\nState and Props drive the entire lifecycle. When state or props change, React re-renders the component.\",\"points\":[\"Mounting = component created and added to DOM\",\"Updating = state/props change triggers re-render\",\"Unmounting = component removed from DOM\",\"useEffect handles all three phases\"]}"));

        createLesson(mod4, 3, "State vs Props", "state-vs-props",
                "Understand the difference between state and props in React.",
                createBlocks(BlockType.TEXT, "{\"content\":\"**STATE**\\n\\nInternal data that component manages itself.\\n\\n- Defined inside component\\n- Can be changed by component\\n- Triggers re-render when updated\\n- Private to the component\\n\\n**Example:**\\n\\n```jsx\\nfunction Counter() {\\n  const [count, setCount] = useState(0);\\n  // count is state - managed inside component\\n}\\n```\\n\\n**PROPS**\\n\\nData passed from parent to child component.\\n\\n- Received from parent\\n- Read-only (should not be modified)\\n- Makes components reusable\\n- Flow down from parent\\n\\n**Example:**\\n\\n```jsx\\nfunction User({ name, age }) {\\n  // name and age are props - passed from parent\\n  return <h1>{name}</h1>;\\n}\\n\\n<User name=\\\"Rahul\\\" age={25} />\\n```\\n\\n**Key Differences:**\\n\\n| State | Props |\\n|-------|-------|\\n| Internal | External |\\n| Mutable | Read-only |\\n| Component's own | Passed from parent |\\n| Triggers render | Causes render |\\n\\n**Golden Rule:** Props flow down, state is local!\",\"points\":[\"State is internal, managed by component\",\"Props are external, passed from parent\",\"State triggers re-render when changed\",\"Props should not be modified by child\"]}"));
    }

    private ContentBlock[] createBlocks(BlockType type, String data) {
        return new ContentBlock[]{
                ContentBlock.builder()
                        .type(type)
                        .data(data)
                        .displayOrder(1)
                        .build()
        };
    }

    private void createLesson(Module module, int order, String title, String slug, String description, ContentBlock[] blocks) {
        Lesson lesson = lessonRepository.save(Lesson.builder()
                .title(title)
                .slug(slug)
                .description(description)
                .displayOrder(order)
                .module(module)
                .build());

        for (ContentBlock block : blocks) {
            block.setLesson(lesson);
        }
        contentBlockRepository.saveAll(List.of(blocks));
    }

    private void seedReactQuizzes(Topic react) {
        quizRepository.saveAll(List.of(
                quiz(react, "What is JSX?", "JavaScript XML - HTML-like syntax in JavaScript", "JavaScript Extra", "JavaScript Markup", "Java Syntax", "A", "JSX lets you write HTML-like syntax inside JavaScript."),
                quiz(react, "Which hook manages state in functional components?", "useState", "useEffect", "useContext", "useRef", "A", "useState is the hook for managing state in functional components."),
                quiz(react, "What does useEffect with empty dependency array do?", "Runs on every render", "Runs only on mount", "Runs on unmount only", "Never runs", "B", "Empty dependency array [] means the effect runs only once on mount."),
                quiz(react, "What is the Virtual DOM?", "A browser API", "Lightweight copy of real DOM", "A CSS framework", "A JavaScript library", "B", "Virtual DOM is a lightweight JavaScript representation of the real DOM."),
                quiz(react, "How do you pass data to a child component?", "Using state", "Using props", "Using effects", "Using refs", "B", "Props are used to pass data from parent to child components.")
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
                .difficulty(com.letscrackitt.backend.entity.enums.Difficulty.BEGINNER)
                .build();
    }
}