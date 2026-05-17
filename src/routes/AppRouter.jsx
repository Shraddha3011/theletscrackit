import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import ProtectedRoute from './ProtectedRoute'

const Home               = lazy(() => import('../pages/Home'))
const Login              = lazy(() => import('../pages/Login'))
const Signup             = lazy(() => import('../pages/Signup'))
const Dashboard          = lazy(() => import('../pages/Dashboard'))
const Topics             = lazy(() => import('../pages/Topics'))
const NoteDetail         = lazy(() => import('../pages/NoteDetail'))
const InterviewQuestions = lazy(() => import('../pages/InterviewQuestions'))
const Quiz               = lazy(() => import('../pages/Quiz'))
const Profile            = lazy(() => import('../pages/Profile'))
const Search             = lazy(() => import('../pages/Search'))
const Projects           = lazy(() => import('../pages/Projects'))
const ProjectDetail      = lazy(() => import('../pages/ProjectDetail'))

/* =========================
   NEW LESSON PAGE
========================= */

const SubTopics         = lazy(() => import('../pages/SubTopics'))
const LessonPage = lazy(
  () => import('../pages/LessonPage')
)

/* =========================
   CS PATH (Roadmap)
========================= */
const CSPath             = lazy(() => import('../pages/CSPath'))
const About              = lazy(() => import('../pages/About'))

/* =========================
   ADMIN
========================= */

const AdminDashboard     = lazy(() => import('../pages/admin/AdminDashboard'))
const ManageTopics       = lazy(() => import('../pages/admin/ManageTopics'))
const ManageNotes        = lazy(() => import('../pages/admin/ManageNotes'))
const ManageQuizzes      = lazy(() => import('../pages/admin/ManageQuizzes'))
const ManageUsers        = lazy(() => import('../pages/admin/ManageUsers'))

const QuizTopics         = lazy(() => import('../pages/QuizTopics'))

/* =========================
   PAGE LOADER
========================= */

const PageLoader = () => (

  <div className="min-h-screen flex items-center justify-center bg-[#050816]">

    <div className="flex items-center gap-3">

      <div
        className="w-5 h-5 rounded-full bg-emerald-400 animate-bounce"
        style={{
          animationDelay: '0ms',
        }}
      />

      <div
        className="w-5 h-5 rounded-full bg-emerald-400 animate-bounce"
        style={{
          animationDelay: '150ms',
        }}
      />

      <div
        className="w-5 h-5 rounded-full bg-emerald-400 animate-bounce"
        style={{
          animationDelay: '300ms',
        }}
      />

    </div>

  </div>
)

/* =========================
   ROUTER
========================= */

export default function AppRouter() {

  return (

    <Suspense fallback={<PageLoader />}>

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/topics"
          element={<Topics />}
        />

        <Route
          path="/notes/:slug"
          element={<NoteDetail />}
        />

        <Route
          path="/interview-questions"
          element={<InterviewQuestions />}
        />

        <Route
          path="/cs-path"
          element={<CSPath />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/projects/:slug"
          element={<ProjectDetail />}
        />

        {/* =========================
            NEW DYNAMIC LESSON PAGE
        ========================= */}

        <Route

          path="/lessons/:slug"

          element={<SubTopics />}

        />

        {/* ===================================
           SINGLE LESSON PAGE
        =================================== */}

        <Route

          path="/lesson/:slug"

          element={<LessonPage />}

        />
        {/* =========================
            AUTH ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/quiz"
            element={<QuizTopics />}
          />

          <Route
            path="/quiz/:id"
            element={<Quiz />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['ADMIN']}
            />
          }
        >

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/topics"
            element={<ManageTopics />}
          />

          <Route
            path="/admin/notes"
            element={<ManageNotes />}
          />

          <Route
            path="/admin/quizzes"
            element={<ManageQuizzes />}
          />

          <Route
            path="/admin/users"
            element={<ManageUsers />}
          />

        </Route>

      </Routes>

    </Suspense>
  )
}
