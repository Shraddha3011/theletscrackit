import { useEffect, useState } from 'react'
import { getQuestionsApi } from '../api/questionApi'
import { getTopicsApi } from '../api/topicsApi'

export default function InterviewQuestions() {
  const [topics, setTopics] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  /* ───────── FETCH TOPICS ───────── */
  useEffect(() => {
    getTopicsApi()
      .then(({ data }) => {
        setTopics(data)

        // auto-select first topic
        if (data.length > 0) {
          setSelectedCategory(data[0].slug)
        }
      })
      .catch(() => {
        setTopics([])
      })
  }, [])

  /* ───────── FETCH QUESTIONS ───────── */
  useEffect(() => {
    if (!selectedCategory) return

    setLoading(true)

    getQuestionsApi(selectedCategory)
      .then(({ data }) => {
        setQuestions(data)
      })
      .catch(() => {
        setQuestions([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [selectedCategory])

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 'clamp(32px,5vw,48px)',
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          Interview Questions 🎯
        </h1>

        <p
          style={{
            color: 'rgba(240,238,232,0.6)',
            fontSize: 16,
            lineHeight: 1.7,
            maxWidth: 700,
          }}
        >
          Explore commonly asked interview questions across technologies.
        </p>
      </div>

      {/* Categories */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 40,
        }}
      >
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedCategory(topic.slug)}
            style={{
              padding: '10px 18px',
              borderRadius: 999,

              border:
                selectedCategory === topic.slug
                  ? '1px solid #00dc82'
                  : '1px solid rgba(255,255,255,0.1)',

              background:
                selectedCategory === topic.slug
                  ? 'rgba(0,220,130,0.12)'
                  : 'rgba(255,255,255,0.03)',

              color:
                selectedCategory === topic.slug
                  ? '#00dc82'
                  : '#f0eee8',

              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Questions */}
      {loading ? (
        <p style={{ color: '#aaa' }}>
          Loading questions...
        </p>
      ) : questions.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {questions.map((item, index) => (
            <div
              key={item.id}
              style={{
                padding: '24px',
                borderRadius: 14,
                border:
                  '1px solid rgba(255,255,255,0.08)',

                background:
                  'rgba(255,255,255,0.03)',
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                {index + 1}. {item.questionText}
              </h2>

              <p
                style={{
                  color: 'rgba(240,238,232,0.65)',
                  lineHeight: 1.8,
                  fontSize: 15,
                }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#aaa' }}>
          No questions found.
        </p>
      )}
    </div>
  )
}