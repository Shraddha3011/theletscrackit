import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getTopicsApi } from '../api/topicsApi'

import PageWrapper from '../components/layout/PageWrapper'

export default function QuizTopics() {
  const [topics, setTopics] = useState([])

  useEffect(() => {
    getTopicsApi()
      .then(({ data }) => {
        setTopics(data)
      })
      .catch(() => {
        setTopics([])
      })
  }, [])

  return (
    <PageWrapper>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(32px,5vw,48px)',
            fontWeight: 800,
            marginBottom: 40,
          }}
        >
          Choose a Quiz Topic 🎯
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(240px,1fr))',
            gap: 20,
          }}
        >
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/quiz/${topic.id}`}
              style={{
                padding: 24,
                borderRadius: 18,
                textDecoration: 'none',

                border:
                  '1px solid rgba(255,255,255,0.08)',

                background:
                  'rgba(255,255,255,0.03)',

                color: '#f0eee8',
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  marginBottom: 16,
                }}
              >
                {topic.icon || '📘'}
              </div>

              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                {topic.title}
              </h2>

              <p
                style={{
                  color:
                    'rgba(240,238,232,0.65)',
                  lineHeight: 1.6,
                }}
              >
                Start quiz questions for{' '}
                {topic.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}