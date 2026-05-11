import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getQuizApi } from '../api/quizApi'

import PageWrapper from '../components/layout/PageWrapper'

export default function Quiz() {
  const { id } = useParams()

  const [questions, setQuestions] = useState([])

  const [selectedAnswers, setSelectedAnswers] =
    useState({})

  const [submitted, setSubmitted] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

useEffect(() => {
  setLoading(true)

  getQuizApi(id)
    .then(({ data }) => {
      console.log(data)

      setQuestions(data || [])
    })
    .catch((err) => {
      console.error(err)

      setQuestions([])
    })
    .finally(() => {
      setLoading(false)
    })
}, [id])

  const handleSelect = (questionId, answer) => {
    if (submitted) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const score = questions.reduce((acc, q) => {
    return selectedAnswers[q.id] ===
      q.correctAnswer
      ? acc + 1
      : acc
  }, 0)

  if (loading) {
    return (
      <PageWrapper>
        <div className="page-container py-20">
          Loading quiz...
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div
        style={{
          maxWidth: 850,
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        <h1
          style={{
            fontSize:
              'clamp(32px,5vw,48px)',
            fontWeight: 800,
            marginBottom: 40,
          }}
        >
          Quiz
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {questions.map((q, i) => {
            const options = [
              q.optionA,
              q.optionB,
              q.optionC,
              q.optionD,
            ]

            return (
              <div
                key={q.id}
                style={{
                  padding: 24,
                  borderRadius: 18,
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
                    marginBottom: 20,
                    lineHeight: 1.5,
                  }}
                >
                  {i + 1}. {q.question}
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {options.map((option) => {
                    const isSelected =
                      selectedAnswers[q.id] ===
                      option

                    const isCorrect =
                      option ===
                      q.correctAnswer

                    const isWrong =
                      submitted &&
                      isSelected &&
                      !isCorrect

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          handleSelect(
                            q.id,
                            option
                          )
                        }
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding:
                            '16px 18px',
                          borderRadius: 14,
                          cursor:
                            submitted
                              ? 'default'
                              : 'pointer',

                          border: isSelected
                            ? '1px solid #00dc82'
                            : '1px solid rgba(255,255,255,0.08)',

                          background:
                            submitted
                              ? isCorrect
                                ? 'rgba(0,220,130,0.12)'
                                : isWrong
                                ? 'rgba(255,80,80,0.12)'
                                : 'rgba(255,255,255,0.03)'
                              : isSelected
                              ? 'rgba(0,220,130,0.12)'
                              : 'rgba(255,255,255,0.03)',

                          color: '#f0eee8',
                        }}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>

                {submitted &&
                  q.explanation && (
                    <div
                      style={{
                        marginTop: 18,
                        padding: 16,
                        borderRadius: 12,
                        background:
                          'rgba(255,255,255,0.03)',
                      }}
                    >
                      <p
                        style={{
                          color:
                            'rgba(240,238,232,0.7)',
                          lineHeight: 1.7,
                        }}
                      >
                        {q.explanation}
                      </p>
                    </div>
                  )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40 }}>
          {submitted ? (
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: '#00dc82',
              }}
            >
              Score: {score}/
              {questions.length}
            </h2>
          ) : (
            <button
              onClick={() =>
                setSubmitted(true)
              }
              style={{
                padding: '14px 24px',
                borderRadius: 14,
                border: 'none',
                background: '#00dc82',
                color: '#04130c',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}