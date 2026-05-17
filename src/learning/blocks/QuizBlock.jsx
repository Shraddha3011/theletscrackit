import {
  useState,
} from 'react'

export default function QuizBlock({
  data,
}) {

  const [selected, setSelected] =
    useState(null)

  const [submitted, setSubmitted] =
    useState(false)

  const isCorrect =
    selected === data.correctAnswer

  return (

    <div
      className="
        rounded-[32px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        p-8
      "
    >

      <div className="mb-8">

        <p
          className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-emerald-400
            font-semibold
            mb-4
          "
        >

          Interactive Quiz

        </p>

        <h2
          className="
            text-3xl
            font-black
            leading-[1.3]
            text-white
          "
        >

          {data.question}

        </h2>

      </div>

      <div className="space-y-4">

        {data.options.map(
          (
            option,
            index
          ) => (

            <button

              key={index}

              onClick={() =>
                setSelected(index)
              }

              className={`
                w-full
                rounded-2xl
                border
                p-5
                text-left
                transition-all
                duration-300

                ${
                  selected === index

                    ? 'border-emerald-400 bg-emerald-500/10'

                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                }
              `}
            >

              <div className="flex items-center gap-4">

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    font-bold

                    ${
                      selected === index

                        ? 'bg-emerald-400 text-black'

                        : 'bg-white/10 text-white'
                    }
                  `}
                >

                  {String.fromCharCode(
                    65 + index
                  )}

                </div>

                <span
                  className="
                    text-lg
                    text-white
                  "
                >

                  {option}

                </span>

              </div>

            </button>
          )
        )}

      </div>

      {/* submit */}

      <button

        onClick={() =>
          setSubmitted(true)
        }

        disabled={selected === null}

        className="
          mt-8
          rounded-2xl
          bg-[#06d96e]
          px-6
          py-4
          font-bold
          text-black
          transition-all
          hover:scale-[1.02]
          disabled:opacity-40
        "
      >

        Submit Answer

      </button>

      {/* result */}

      {submitted && (

        <div
          className={`
            mt-8
            rounded-2xl
            border
            p-6

            ${
              isCorrect

                ? 'border-emerald-400/30 bg-emerald-500/10'

                : 'border-red-400/30 bg-red-500/10'
            }
          `}
        >

          <h3
            className="
              mb-3
              text-2xl
              font-black
            "
          >

            {
              isCorrect
                ? 'Correct 🎉'
                : 'Incorrect ❌'
            }

          </h3>

          <p className="text-slate-300 leading-8">

            {data.explanation}

          </p>

        </div>

      )}

    </div>
  )
}