import { useEffect, useState } from 'react'

import {
  createQuizApi,
  deleteQuizApi,
  getQuizApi,
} from '../../api/quizApi'

import { getTopicsApi } from '../../api/topicsApi'

export default function ManageQuizzes() {
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] =
    useState('')

  const [quizzes, setQuizzes] = useState([])

  const [form, setForm] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
    difficulty: 'BEGINNER',
    xpReward: 5,
  })

  /* FETCH TOPICS */
  useEffect(() => {
    getTopicsApi()
      .then(({ data }) => {
        setTopics(data)

        if (data.length > 0) {
          setSelectedTopic(data[0].id)
        }
      })
      .catch(() => {
        setTopics([])
      })
  }, [])

  /* FETCH QUIZZES */
  useEffect(() => {
    if (!selectedTopic) return

    fetchQuizzes()
  }, [selectedTopic])

  const fetchQuizzes = () => {
    getQuizApi(selectedTopic)
      .then(({ data }) => {
        setQuizzes(data || [])
      })
      .catch(() => {
        setQuizzes([])
      })
  }

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  /* CREATE QUIZ */
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createQuizApi({
        ...form,
        topicId: selectedTopic,
      })

      setForm({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        explanation: '',
        difficulty: 'BEGINNER',
        xpReward: 5,
      })

      fetchQuizzes()
    } catch (err) {
      console.error(err)
    }
  }

  /* DELETE */
  const handleDelete = async (id) => {
    try {
      await deleteQuizApi(id)

      fetchQuizzes()
    } catch (err) {
      console.error(err)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#f8fafc',
    outline: 'none',
    fontSize: 15,
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            color: '#00dc82',
            fontWeight: 700,
            marginBottom: 10,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontSize: 13,
          }}
        >
          Admin Panel
        </p>

        <h1
          style={{
            fontSize: 'clamp(34px,5vw,52px)',
            fontWeight: 900,
            marginBottom: 14,
            color: '#f8fafc',
            lineHeight: 1.1,
          }}
        >
          Manage Quiz Questions 🎯
        </h1>

        <p
          style={{
            color: 'rgba(240,238,232,0.65)',
            fontSize: 16,
            maxWidth: 700,
            lineHeight: 1.8,
          }}
        >
          Organize topic-wise quiz questions,
          explanations, XP rewards, and
          difficulty levels.
        </p>
      </div>

      {/* TOPIC BAR */}
{/* TOPIC SELECTOR */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 30,
    flexWrap: 'wrap',
  }}
>
  <div>
    <p
      style={{
        color: 'rgba(240,238,232,0.6)',
        marginBottom: 8,
        fontSize: 14,
      }}
    >
      Current Topic
    </p>

    {/* CUSTOM SELECT */}
    <div
      style={{
        position: 'relative',
        width: 280,
      }}
    >
      <select
        value={selectedTopic}
        onChange={(e) =>
          setSelectedTopic(e.target.value)
        }
        style={{
          width: '100%',

          padding: '14px 18px',

          paddingRight: 50,

          borderRadius: 16,

          border:
            '1px solid rgba(255,255,255,0.08)',

          background:
            'linear-gradient(180deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))',

          color: '#f8fafc',

          outline: 'none',

          fontSize: 15,

          fontWeight: 600,

          backdropFilter: 'blur(12px)',

          WebkitAppearance: 'none',

          MozAppearance: 'none',

          appearance: 'none',

          cursor: 'pointer',

          boxShadow:
            '0 10px 30px rgba(0,0,0,0.18)',
        }}
      >
        {topics.map((topic) => (
          <option
            key={topic.id}
            value={topic.id}
            style={{
              background: '#0f172a',
              color: '#f8fafc',
            }}
          >
            {topic.title}
          </option>
        ))}
      </select>

      {/* CUSTOM ARROW */}
      <div
        style={{
          position: 'absolute',
          right: 18,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'rgba(255,255,255,0.55)',
          fontSize: 13,
        }}
      >
        ▼
      </div>
    </div>
  </div>

  {/* STATS CARD */}
  <div
    style={{
      padding: '14px 18px',
      borderRadius: 18,

      background:
        'linear-gradient(135deg, rgba(0,220,130,0.14), rgba(0,184,255,0.08))',

      border:
        '1px solid rgba(0,220,130,0.14)',

      backdropFilter: 'blur(10px)',
    }}
  >
    <p
      style={{
        color: '#00dc82',
        fontWeight: 800,
        fontSize: 22,
        marginBottom: 4,
      }}
    >
      {quizzes.length}
    </p>

    <p
      style={{
        color: 'rgba(240,238,232,0.65)',
        fontSize: 13,
      }}
    >
      Questions Added
    </p>
  </div>
</div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 28,
          borderRadius: 28,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border:
            '1px solid rgba(255,255,255,0.08)',
          marginBottom: 40,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(280px,1fr))',
            gap: 18,
          }}
        >
          <div
            style={{
              gridColumn: '1 / -1',
            }}
          >
            <textarea
              name="question"
              placeholder="Enter quiz question..."
              value={form.question}
              onChange={handleChange}
              required
              rows={4}
              style={{
                ...inputStyle,
                resize: 'vertical',
              }}
            />
          </div>

          <input
            name="optionA"
            placeholder="Option A"
            value={form.optionA}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="optionB"
            placeholder="Option B"
            value={form.optionB}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="optionC"
            placeholder="Option C"
            value={form.optionC}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="optionD"
            placeholder="Option D"
            value={form.optionD}
            onChange={handleChange}
            required
            style={inputStyle}
          />

<div>
  <p
    style={{
      color: 'rgba(240,238,232,0.7)',
      marginBottom: 10,
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    Correct Answer
  </p>

  <div
    style={{
      position: 'relative',
    }}
  >
    <select
      name="correctAnswer"
      value={form.correctAnswer}
      onChange={handleChange}
      required
      style={{
        ...inputStyle,

        paddingRight: 50,

        background:
          'linear-gradient(180deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))',

        WebkitAppearance: 'none',

        MozAppearance: 'none',

        appearance: 'none',

        cursor: 'pointer',
      }}
    >
      <option
        value=""
        style={{
          background: '#0f172a',
          color: '#f8fafc',
        }}
      >
        Select Correct Answer
      </option>

      {form.optionA && (
        <option
          value={form.optionA}
          style={{
            background: '#0f172a',
            color: '#f8fafc',
          }}
        >
          Option A — {form.optionA}
        </option>
      )}

      {form.optionB && (
        <option
          value={form.optionB}
          style={{
            background: '#0f172a',
            color: '#f8fafc',
          }}
        >
          Option B — {form.optionB}
        </option>
      )}

      {form.optionC && (
        <option
          value={form.optionC}
          style={{
            background: '#0f172a',
            color: '#f8fafc',
          }}
        >
          Option C — {form.optionC}
        </option>
      )}

      {form.optionD && (
        <option
          value={form.optionD}
          style={{
            background: '#0f172a',
            color: '#f8fafc',
          }}
        >
          Option D — {form.optionD}
        </option>
      )}
    </select>

    <div
      style={{
        position: 'absolute',
        right: 18,
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: 'rgba(255,255,255,0.55)',
        fontSize: 13,
      }}
    >
      ▼
    </div>
  </div>
</div>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="BEGINNER">
              BEGINNER
            </option>

            <option value="MEDIUM">
              MEDIUM
            </option>

            <option value="HARD">
              HARD
            </option>
          </select>

          <input
            type="number"
            name="xpReward"
            placeholder="XP Reward"
            value={form.xpReward}
            onChange={handleChange}
            style={inputStyle}
          />

          <div
            style={{
              gridColumn: '1 / -1',
            }}
          >
            <textarea
              name="explanation"
              placeholder="Optional explanation..."
              value={form.explanation}
              onChange={handleChange}
              rows={4}
              style={{
                ...inputStyle,
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: 24,
            padding: '14px 22px',
            borderRadius: 14,
            border: 'none',
            background:
              'linear-gradient(135deg,#00dc82,#00b8ff)',
            color: '#04130c',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: 15,
            boxShadow:
              '0 10px 30px rgba(0,220,130,0.18)',
          }}
        >
          Add Quiz Question
        </button>
      </form>

      {/* QUESTIONS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(320px,1fr))',
          gap: 20,
        }}
      >
        {quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            style={{
              padding: 22,
              borderRadius: 24,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',

              border:
                '1px solid rgba(255,255,255,0.08)',

              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background:
                    'rgba(0,220,130,0.12)',
                  color: '#00dc82',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {quiz.difficulty}
              </span>

              <span
                style={{
                  color:
                    'rgba(240,238,232,0.5)',
                  fontSize: 13,
                }}
              >
                +{quiz.xpReward} XP
              </span>
            </div>

            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#f8fafc',
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              {index + 1}. {quiz.question}
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 18,
              }}
            >
              {[
                quiz.optionA,
                quiz.optionB,
                quiz.optionC,
                quiz.optionD,
              ].map((option) => (
                <div
                  key={option}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background:
                      option ===
                      quiz.correctAnswer
                        ? 'rgba(0,220,130,0.12)'
                        : 'rgba(255,255,255,0.03)',

                    border:
                      option ===
                      quiz.correctAnswer
                        ? '1px solid rgba(0,220,130,0.2)'
                        : '1px solid rgba(255,255,255,0.05)',

                    color:
                      option ===
                      quiz.correctAnswer
                        ? '#00dc82'
                        : '#f8fafc',
                  }}
                >
                  {option}
                </div>
              ))}
            </div>

            {quiz.explanation && (
              <div
                style={{
                  padding: 14,
                  borderRadius: 14,
                  background:
                    'rgba(255,255,255,0.03)',
                  marginBottom: 18,
                }}
              >
                <p
                  style={{
                    color:
                      'rgba(240,238,232,0.68)',
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  {quiz.explanation}
                </p>
              </div>
            )}

            <button
              onClick={() =>
                handleDelete(quiz.id)
              }
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                border: 'none',
                background:
                  'rgba(255,77,79,0.12)',
                color: '#ff6b6b',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Delete Question
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}