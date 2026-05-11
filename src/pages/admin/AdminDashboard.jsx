import { Link } from 'react-router-dom'
import PageWrapper from '../../components/layout/PageWrapper'

const adminLinks = [
  {
    to: '/admin/topics',
    title: 'Manage Topics',
    description: 'Add, edit, and delete topic categories shown on the Topics page.',
  },
  {
    to: '/admin/notes',
    title: 'Manage Notes',
    description: 'Create and organize learning notes for each topic.',
  },
  {
    to: '/admin/quizzes',
    title: 'Manage Quizzes',
    description: 'Prepare quiz content for topic practice.',
  },
  {
    to: '/admin/users',
    title: 'Manage Users',
    description: 'Review learner accounts and admin access.',
  },
]

export default function AdminDashboard() {
  return (
    <PageWrapper>
      <div className="page-container py-10">
        <div className="mb-8">
          <p className="section-label mb-2">Admin</p>
          <h1 className="font-display font-bold text-3xl text-primary">Admin Dashboard</h1>
          <p className="text-secondary text-sm mt-2">
            Choose what you want to manage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card p-5 group"
            >
              <h2 className="font-semibold text-primary group-hover:text-brand-400 transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
