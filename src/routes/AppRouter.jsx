import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './ProtectedRoute'
import Skeleton from '../components/common/Skeleton'

const Home              = lazy(() => import('../pages/Home'))
const Login             = lazy(() => import('../pages/Login'))
const Signup            = lazy(() => import('../pages/Signup'))
const Dashboard         = lazy(() => import('../pages/Dashboard'))
const Topics            = lazy(() => import('../pages/Topics'))
const TopicDetail       = lazy(() => import('../pages/TopicDetail'))
const NoteDetail        = lazy(() => import('../pages/NoteDetail'))
const InterviewQuestions= lazy(() => import('../pages/InterviewQuestions'))
const Quiz              = lazy(() => import('../pages/Quiz'))
const RevisionHub       = lazy(() => import('../pages/RevisionHub'))
const Leaderboard       = lazy(() => import('../pages/Leaderboard'))
const Profile           = lazy(() => import('../pages/Profile'))
const Search            = lazy(() => import('../pages/Search'))
const AdminDashboard    = lazy(() => import('../pages/admin/AdminDashboard'))
const ManageTopics      = lazy(() => import('../pages/admin/ManageTopics'))
const ManageNotes       = lazy(() => import('../pages/admin/ManageNotes'))
const ManageQuizzes     = lazy(() => import('../pages/admin/ManageQuizzes'))
const ManageUsers       = lazy(() => import('../pages/admin/ManageUsers'))
const QuizTopics        = lazy(() => import('../pages/QuizTopics'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-5 h-5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-5 h-5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
)

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/"                      element={<Home />} />
        <Route path="/login"                 element={<Login />} />
        <Route path="/signup"                element={<Signup />} />
        <Route path="/topics"                element={<Topics />} />
        <Route path="/topics/:slug"          element={<TopicDetail />} />
        <Route path="/notes/:slug"           element={<NoteDetail />} />
        <Route path="/interview-questions"   element={<InterviewQuestions />} />
        <Route path="/leaderboard"           element={<Leaderboard />} />
        <Route path="/search"                element={<Search />} />

        {/* Authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"  element={<Dashboard />} />
<Route path="/quiz" element={<QuizTopics />} />
<Route path="/quiz/:id" element={<Quiz />} /> 
          
          <Route path="/revision"   element={<RevisionHub />} />
          <Route path="/profile"    element={<Profile />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin"                element={<AdminDashboard />} />
          <Route path="/admin/topics"         element={<ManageTopics />} />
          <Route path="/admin/notes"          element={<ManageNotes />} />
          <Route path="/admin/quizzes"        element={<ManageQuizzes />} />
          <Route path="/admin/users"          element={<ManageUsers />} />
        </Route>
      </Routes>
    </Suspense>
  )
}