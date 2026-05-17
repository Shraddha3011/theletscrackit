import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import {
  Trophy,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  SearchX,
} from 'lucide-react'

import { motion } from 'framer-motion'

import {
  getQuizApi,
  submitQuizApi,
} from '../api/quizApi'

import { useDispatch } from 'react-redux'

import { syncUserXp } from '../app/slices/authSlice'

import { useAuth } from '../hooks/useAuth'

import PageWrapper from '../components/layout/PageWrapper'

/* =========================================================
   PARTICLES
========================================================= */

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({
        length: 20,
      }).map((_, i) => (
        <span
          key={i}
          className="
            absolute
            w-1
            h-1
            rounded-full
            bg-white/40
          "
          style={{
            left: `${i * 5}%`,
            top: `${100 + i * 2}%`,
            animation: `float ${
              12 + i
            }s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* =========================================================
   MAIN
========================================================= */

export default function Quiz() {
  const { id } = useParams()

  const dispatch = useDispatch()

  const { isAuthenticated } =
    useAuth()

  const [questions, setQuestions] =
    useState([])

  const [
    selectedAnswers,
    setSelectedAnswers,
  ] = useState({})

  const [submitted, setSubmitted] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

  const [result, setResult] =
    useState(null)

  useEffect(() => {
    setLoading(true)

    getQuizApi(id)
      .then(({ data }) => {
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

  const handleSelect = (
    questionId,
    answer
  ) => {
    if (submitted) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const isCorrect = (q, option) => {
    if (option === q.correctAnswer)
      return true

    if (q.correctAnswer === 'A')
      return option === q.optionA

    if (q.correctAnswer === 'B')
      return option === q.optionB

    if (q.correctAnswer === 'C')
      return option === q.optionC

    if (q.correctAnswer === 'D')
      return option === q.optionD

    return false
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setSubmitted(true)
      return
    }

    try {
      const { data } =
        await submitQuizApi(
          id,
          selectedAnswers
        )

      setResult(data)

      dispatch(
        syncUserXp({
          xpPoints: data.xpPoints,
        })
      )
    } catch {
      // local review still works
    }

    setSubmitted(true)
  }

  const score =
    result?.score ??
    questions.reduce((acc, q) => {
      return isCorrect(
        q,
        selectedAnswers[q.id]
      )
        ? acc + 1
        : acc
    }, 0)

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <PageWrapper>
        <div
          className="
            min-h-screen
            bg-[#080809]
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              h-16
              w-16
              rounded-full
              border-[3px]
              border-[#06d96e]
              border-t-transparent
              animate-spin
            "
          />
        </div>
      </PageWrapper>
    )
  }

  /* =========================================================
     NO QUIZ
  ========================================================= */

  if (!loading && questions.length === 0) {
    return (
      <PageWrapper>
        <div
          className="
            relative
            min-h-screen
            overflow-hidden
            bg-[#080809]
            px-6
            text-white
          "
        >
          {/* gradients */}

          <div
            className="
              absolute
              left-[-200px]
              top-[-200px]
              h-[500px]
              w-[500px]
              rounded-full
              bg-[#06d96e]/10
              blur-[120px]
            "
          />

          <div
            className="
              absolute
              bottom-[-200px]
              right-[-200px]
              h-[500px]
              w-[500px]
              rounded-full
              bg-cyan-400/10
              blur-[120px]
            "
          />

          <FloatingParticles />

          <div
            className="
              relative
              z-10
              flex
              min-h-screen
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div
              className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.05]
                backdrop-blur-xl
              "
            >
              <SearchX
                size={40}
                className="text-[#06d96e]"
              />
            </div>

            <h1
              className="
                mt-8
                text-[clamp(2.2rem,6vw,4.5rem)]
                font-black
                leading-[1]
                tracking-[-0.05em]
              "
            >
              No Quiz

              <span
                className="
                  block
                  bg-gradient-to-r
                  from-[#06d96e]
                  to-cyan-400
                  bg-clip-text
                  text-transparent
                "
              >
                Available
              </span>
            </h1>

            <p
              className="
                mt-5
                max-w-[560px]
                text-[0.95rem]
                leading-[1.8]
                text-[#97a0cb]
              "
            >
              This topic currently does not
              have any quiz questions
              available.
            </p>
          </div>

          <style>{`
            @keyframes float{
              from{
                transform:translateY(0);
                opacity:0;
              }

              10%{
                opacity:1;
              }

              to{
                transform:translateY(-130vh);
                opacity:0;
              }
            }
          `}</style>
        </div>
      </PageWrapper>
    )
  }

  /* =========================================================
     QUIZ PAGE
  ========================================================= */

  return (
    <PageWrapper>
      <div
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#080809]
          px-4
          md:px-6
          pb-24
          pt-6
          text-white
        "
      >
        {/* gradients */}

        <div
          className="
            absolute
            left-[-200px]
            top-[-200px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#06d96e]/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-[-200px]
            right-[-200px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/10
            blur-[120px]
          "
        />

        <FloatingParticles />

        {/* TOP BAR */}

        <section
          className="
            relative
            z-10
            mx-auto
            mb-6
            max-w-[1000px]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              rounded-[24px]
              border
              border-white/10
              bg-white/[0.04]
              p-4
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div>
                <h1
                  className="
                    text-[1.05rem]
                    md:text-[1.2rem]
                    font-black
                    tracking-[-0.03em]
                    text-white
                  "
                >
                  Quiz Challenge
                </h1>

                <p
                  className="
                    mt-1
                    text-[0.82rem]
                    text-[#8a93b2]
                  "
                >
                  Answer all questions
                </p>
              </div>

              <div
                className="
                  flex
                  h-10
                  min-w-[52px]
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#06d96e]/10
                  px-3
                  text-[0.82rem]
                  font-bold
                  text-[#06d96e]
                "
              >
                {
                  Object.keys(
                    selectedAnswers
                  ).length
                }
                /{questions.length}
              </div>
            </div>

            {/* progress */}

            <div
              className="
                h-[7px]
                overflow-hidden
                rounded-full
                bg-white/5
              "
            >
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${
                    questions.length === 0
                      ? 0
                      : (Object.keys(
                          selectedAnswers
                        ).length /
                          questions.length) *
                        100
                  }%`,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#06d96e]
                  via-[#2df28a]
                  to-cyan-400
                "
              />
            </div>
          </div>
        </section>

        {/* QUESTIONS */}

        <section
          className="
            relative
            z-10
            mx-auto
            flex
            max-w-[1000px]
            flex-col
            gap-3.5
          "
        >
          {questions.map((q, i) => {
            const options = [
              q.optionA,
              q.optionB,
              q.optionC,
              q.optionD,
            ]

            return (
              <motion.div
                key={q.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: i * 0.04,
                }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-white/10
                  bg-white/[0.04]
                  backdrop-blur-xl
                  p-3.5
                  md:p-4
                "
              >
                {/* glow */}

                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    transition-all
                    duration-700
                    group-hover:opacity-100
                    bg-gradient-to-br
                    from-[#06d96e]/5
                    to-cyan-400/5
                  "
                />

                {/* TOP */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  {/* question number */}

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-gradient-to-br
                      from-[#06d96e]
                      to-cyan-400
                      text-[0.72rem]
                      font-black
                      text-black
                    "
                  >
                    {i + 1}
                  </div>

                  {/* tag */}

                  <div
                    className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/[0.05]
                      px-3
                      py-1
                      text-[0.65rem]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[#97a0cb]
                    "
                  >
                    Question
                  </div>
                </div>

                {/* QUESTION */}

                <h2
                  className="
                    relative
                    z-10
                    mt-3
                    text-[0.98rem]
                    md:text-[1.08rem]
                    font-black
                    leading-[1.45]
                    tracking-[-0.03em]
                    text-white
                  "
                >
                  {q.question}
                </h2>

                {/* OPTIONS */}

                <div
                  className="
                    relative
                    z-10
                    mt-4
                    flex
                    flex-col
                    gap-2.5
                  "
                >
                  {options.map(
                    (
                      option,
                      optionIndex
                    ) => {
                      const isSelected =
                        selectedAnswers[
                          q.id
                        ] === option

                      const isCorrectOption =
                        isCorrect(
                          q,
                          option
                        )

                      const isWrong =
                        submitted &&
                        isSelected &&
                        !isCorrectOption

                      return (
                        <button
                          key={option}
                          onClick={() =>
                            handleSelect(
                              q.id,
                              option
                            )
                          }
                          className={`
                            rounded-[16px]
                            border
                            p-3
                            text-left
                            transition-all
                            duration-300
                            ${
                              submitted
                                ? isCorrectOption
                                  ? 'border-[#06d96e]/40 bg-[#06d96e]/10'
                                  : isWrong
                                  ? 'border-red-500/40 bg-red-500/10'
                                  : 'border-white/10 bg-white/[0.03]'
                                : isSelected
                                ? 'border-[#06d96e]/40 bg-[#06d96e]/10'
                                : 'border-white/10 bg-white/[0.03] hover:border-[#06d96e]/20 hover:bg-white/[0.05]'
                            }
                          `}
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >
                            <div className="flex items-center gap-3">
                              {/* option letter */}

                              <div
                                className={`
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-[0.7rem]
                                  font-bold
                                  ${
                                    isSelected
                                      ? 'bg-[#06d96e] text-black'
                                      : 'bg-white/5 text-white'
                                  }
                                `}
                              >
                                {String.fromCharCode(
                                  65 +
                                    optionIndex
                                )}
                              </div>

                              {/* option text */}

                              <span
                                className="
                                  text-[0.85rem]
                                  md:text-[0.9rem]
                                  leading-[1.55]
                                  text-white
                                "
                              >
                                {option}
                              </span>
                            </div>

                            {/* status */}

                            {submitted &&
                              isCorrectOption && (
                                <CheckCircle2
                                  size={18}
                                  className="
                                    shrink-0
                                    text-[#06d96e]
                                  "
                                />
                              )}

                            {submitted &&
                              isWrong && (
                                <XCircle
                                  size={18}
                                  className="
                                    shrink-0
                                    text-red-400
                                  "
                                />
                              )}
                          </div>
                        </button>
                      )
                    }
                  )}
                </div>

                {/* EXPLANATION */}

                {submitted &&
                  q.explanation && (
                    <div
                      className="
                        relative
                        z-10
                        mt-3
                        rounded-[16px]
                        border
                        border-cyan-400/10
                        bg-cyan-400/5
                        p-3
                      "
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles
                          size={13}
                          className="text-cyan-300"
                        />

                        <span
                          className="
                            text-[0.68rem]
                            font-semibold
                            uppercase
                            tracking-[0.1em]
                            text-cyan-300
                          "
                        >
                          Explanation
                        </span>
                      </div>

                      <p
                        className="
                          mt-2
                          text-[0.82rem]
                          leading-[1.65]
                          text-[#b7c0e0]
                        "
                      >
                        {q.explanation}
                      </p>
                    </div>
                  )}
              </motion.div>
            )
          })}
        </section>

        {/* FOOTER */}

        <section
          className="
            relative
            z-10
            mx-auto
            mt-10
            max-w-[1000px]
          "
        >
          {submitted ? (
            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-[#06d96e]/20
                bg-gradient-to-br
                from-[#06d96e]/10
                to-cyan-400/10
                p-6
                md:p-8
                text-center
              "
            >
              <div className="relative z-10">
                <div
                  className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-[#06d96e]/15
                    text-[#06d96e]
                  "
                >
                  <Trophy size={28} />
                </div>

                <h2
                  className="
                    mt-5
                    text-[1.7rem]
                    md:text-[2.2rem]
                    font-black
                    tracking-[-0.05em]
                  "
                >
                  Quiz Completed
                </h2>

                <div
                  className="
                    mt-4
                    text-[3rem]
                    md:text-[4rem]
                    font-black
                    leading-none
                    bg-gradient-to-r
                    from-[#06d96e]
                    to-cyan-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  {score}/
                  {questions.length}
                </div>

                {result?.xpEarned >
                  0 && (
                  <div
                    className="
                      mt-4
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-yellow-400/20
                      bg-yellow-400/10
                      px-4
                      py-2.5
                      text-[0.85rem]
                      text-yellow-300
                    "
                  >
                    <Sparkles size={15} />
                    +
                    {result.xpEarned} XP
                    Earned
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="
                  group
                  flex
                  items-center
                  gap-2.5
                  rounded-[18px]
                  bg-gradient-to-r
                  from-[#06d96e]
                  to-cyan-400
                  px-7
                  py-3.5
                  text-[0.9rem]
                  font-bold
                  text-black
                  transition-all
                  duration-300
                  hover:scale-105
                "
              >
                Submit Quiz

                <ArrowRight
                  size={17}
                  className="
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>
            </div>
          )}
        </section>

        <style>{`
          @keyframes float{
            from{
              transform:translateY(0);
              opacity:0;
            }

            10%{
              opacity:1;
            }

            to{
              transform:translateY(-130vh);
              opacity:0;
            }
          }
        `}</style>
      </div>
    </PageWrapper>
  )
}