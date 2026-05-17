// src/learning/runtime/ExecutionPlayer.jsx

import {
  useState,
  useEffect,
} from 'react'

import {
  motion,
  AnimatePresence,
} from 'framer-motion'

import {
  Play,
  RotateCcw,
  ArrowRight,
} from 'lucide-react'

export default function ExecutionPlayer({
  lesson,
}) {

  const [currentStep, setCurrentStep] =
    useState(0)

  const [showConnection, setShowConnection] =
    useState(false)

  const step =
    lesson.steps[currentStep]

  /* ============================================
     STEP TRANSITIONS
  ============================================ */

  useEffect(() => {

    setShowConnection(false)

    const timer =
      setTimeout(() => {

        setShowConnection(true)

      }, 1200)

    return () =>
      clearTimeout(timer)

  }, [currentStep])

  /* ============================================
     ACTIONS
  ============================================ */

  const nextStep = () => {

    if (
      currentStep <
      lesson.steps.length - 1
    ) {

      setCurrentStep(
        prev => prev + 1
      )
    }
  }

  const previousStep = () => {

    if (currentStep > 0) {

      setCurrentStep(
        prev => prev - 1
      )
    }
  }

  const restart = () => {

    setCurrentStep(0)
  }

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#020617]
        text-white
      "
    >

      {/* ======================================
         BACKGROUND
      ====================================== */}

      <div className="absolute inset-0">

        <motion.div

          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}

          transition={{
            duration: 5,
            repeat: Infinity,
          }}

          className="
            absolute
            top-[-250px]
            left-[-250px]
            h-[700px]
            w-[700px]
            rounded-full
            bg-emerald-500/10
            blur-[180px]
          "
        />

        <motion.div

          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}

          transition={{
            duration: 6,
            repeat: Infinity,
          }}

          className="
            absolute
            bottom-[-250px]
            right-[-250px]
            h-[700px]
            w-[700px]
            rounded-full
            bg-cyan-500/10
            blur-[180px]
          "
        />

      </div>

      {/* ======================================
         HEADER
      ====================================== */}

      <div
        className="
          sticky
          top-0
          z-50
          border-b
          border-white/10
          bg-black/20
          backdrop-blur-2xl
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-6
            py-5
          "
        >

          <div>

            <p
              className="
                mb-2
                text-xs
                uppercase
                tracking-[0.35em]
                text-emerald-400
              "
            >

              JVM Runtime Simulation

            </p>

            <h1
              className="
                text-3xl
                font-black
                tracking-[-0.05em]
              "
            >

              {lesson.title}

            </h1>

          </div>

          {/* controls */}

          <div className="flex items-center gap-4">

            <button

              onClick={restart}

              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-4
                transition-all
                hover:bg-white/[0.08]
              "
            >

              <RotateCcw size={18} />

            </button>

            <button

              onClick={previousStep}

              disabled={currentStep === 0}

              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                px-5
                py-4
                disabled:opacity-40
              "
            >

              Previous

            </button>

            <button

              onClick={nextStep}

              disabled={
                currentStep ===
                lesson.steps.length - 1
              }

              className="
                flex
                items-center
                gap-3
                rounded-2xl
                bg-emerald-400
                px-6
                py-4
                font-bold
                text-black
                disabled:opacity-40
              "
            >

              <Play size={18} />

              Execute Next

            </button>

          </div>

        </div>

      </div>

      {/* ======================================
         MAIN
      ====================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          py-10
        "
      >

        {/* ====================================
           STEP INFO
        ==================================== */}

        <AnimatePresence mode="wait">

          <motion.div

            key={step.id}

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: -30,
            }}

            transition={{
              duration: 0.5,
            }}

            className="mb-12"
          >

            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-500/10
                px-5
                py-3
              "
            >

              <div
                className="
                  h-3
                  w-3
                  rounded-full
                  bg-cyan-400
                "
              />

              <p
                className="
                  text-sm
                  uppercase
                  tracking-[0.3em]
                  text-cyan-300
                "
              >

                Step {step.id}

              </p>

            </div>

            <h2
              className="
                mb-6
                text-[clamp(2.4rem,4vw,4rem)]
                font-black
                leading-[0.95]
                tracking-[-0.06em]
              "
            >

              {step.title}

            </h2>

            <p
              className="
                max-w-5xl
                text-2xl
                leading-[2]
                text-slate-400
              "
            >

              {step.explanation}

            </p>

          </motion.div>

        </AnimatePresence>

        {/* ====================================
           CODE EXECUTION
        ==================================== */}

        <motion.div

          key={step.code}

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            relative
            mb-12
            overflow-hidden
            rounded-[32px]
            border
            border-emerald-400/20
            bg-[#07111f]
          "
        >

          {/* glowing line */}

          <motion.div

            animate={{
              x: ['-100%', '120%'],
            }}

            transition={{
              duration: 2,
              repeat: Infinity,
            }}

            className="
              absolute
              top-0
              h-full
              w-[200px]
              bg-gradient-to-r
              from-transparent
              via-emerald-400/20
              to-transparent
              blur-2xl
            "
          />

          <div
            className="
              border-b
              border-white/10
              px-6
              py-4
            "
          >

            <p
              className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-emerald-400
              "
            >

              Currently Executing

            </p>

          </div>

          <div
            className="
              flex
              items-start
              gap-6
              p-10
            "
          >

            {/* execution cursor */}

            <motion.div

              animate={{
                opacity: [1, 0.3, 1],
              }}

              transition={{
                duration: 1,
                repeat: Infinity,
              }}

              className="
                mt-2
                h-5
                w-5
                rounded-full
                bg-emerald-400
                shadow-[0_0_30px_rgba(52,211,153,0.8)]
              "
            />

            <pre
              className="
                overflow-x-auto
                text-3xl
                leading-[2]
                text-emerald-300
              "
            >

              <code>

                {step.code}

              </code>

            </pre>

          </div>

        </motion.div>

        {/* ====================================
           MEMORY VISUALIZATION
        ==================================== */}

        <div
          className="
            relative
            grid
            gap-10
            xl:grid-cols-2
          "
        >

          {/* connection beam */}

          {showConnection &&

            step.memoryAfter.stack?.length > 0 &&

            step.memoryAfter.heap?.length > 0 && (

              <motion.div

                initial={{
                  opacity: 0,
                  scaleX: 0,
                }}

                animate={{
                  opacity: 1,
                  scaleX: 1,
                }}

                transition={{
                  duration: 1,
                }}

                className="
                  absolute
                  left-1/2
                  top-1/2
                  z-30
                  hidden
                  h-[4px]
                  w-[220px]
                  -translate-x-1/2
                  rounded-full
                  bg-gradient-to-r
                  from-emerald-400
                  to-cyan-400
                  shadow-[0_0_30px_rgba(34,211,238,0.7)]
                  xl:block
                "
              />
            )}

          {/* ==================================
             STACK MEMORY
          ================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[40px]
              border
              border-emerald-400/20
              bg-emerald-500/[0.05]
              p-8
            "
          >

            {/* animated glow */}

            <motion.div

              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}

              transition={{
                duration: 3,
                repeat: Infinity,
              }}

              className="
                absolute
                right-[-100px]
                top-[-100px]
                h-[250px]
                w-[250px]
                rounded-full
                bg-emerald-400/10
                blur-[100px]
              "
            />

            <div className="relative z-10">

              <div className="mb-10">

                <p
                  className="
                    mb-4
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-emerald-400
                  "
                >

                  Runtime Area

                </p>

                <h3
                  className="
                    mb-3
                    text-5xl
                    font-black
                    tracking-[-0.05em]
                    text-emerald-300
                  "
                >

                  Stack Memory

                </h3>

                <p
                  className="
                    text-lg
                    leading-[1.9]
                    text-slate-400
                  "
                >

                  Function calls, local variables,
                  references and execution frames.

                </p>

              </div>

              <div className="space-y-6">

                {step.memoryAfter.stack.map(
                  (
                    frame,
                    frameIndex
                  ) => (

                    <motion.div

                      key={frameIndex}

                      initial={{
                        opacity: 0,
                        x: -100,
                      }}

                      animate={{
                        opacity: 1,
                        x: 0,
                      }}

                      transition={{
                        duration: 0.7,
                      }}

                      className="
                        rounded-[28px]
                        border
                        border-emerald-400/20
                        bg-black/30
                        p-6
                        shadow-[0_0_60px_rgba(16,185,129,0.08)]
                      "
                    >

                      <div className="mb-6">

                        <p
                          className="
                            mb-2
                            text-xs
                            uppercase
                            tracking-[0.3em]
                            text-emerald-400
                          "
                        >

                          Stack Frame

                        </p>

                        <h4
                          className="
                            text-3xl
                            font-black
                          "
                        >

                          {frame.frame}

                        </h4>

                      </div>

                      <div className="space-y-4">

                        {frame.variables.map(
                          (
                            variable,
                            index
                          ) => (

                            <motion.div

                              key={index}

                              initial={{
                                opacity: 0,
                                x: -40,
                              }}

                              animate={{
                                opacity: 1,
                                x: 0,
                              }}

                              transition={{
                                delay: 0.5,
                              }}

                              className="
                                flex
                                items-center
                                justify-between
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.04]
                                px-5
                                py-4
                              "
                            >

                              <div>

                                <p
                                  className="
                                    mb-1
                                    text-xs
                                    uppercase
                                    tracking-[0.2em]
                                    text-slate-500
                                  "
                                >

                                  Reference Variable

                                </p>

                                <p
                                  className="
                                    text-2xl
                                    font-black
                                  "
                                >

                                  {variable.name}

                                </p>

                              </div>

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-4
                                "
                              >

                                <ArrowRight
                                  className="
                                    text-emerald-400
                                  "
                                />

                                <p
                                  className="
                                    text-2xl
                                    font-black
                                    text-emerald-300
                                  "
                                >

                                  {variable.value}

                                </p>

                              </div>

                            </motion.div>
                          )
                        )}

                      </div>

                    </motion.div>
                  )
                )}

              </div>

            </div>

          </div>

          {/* ==================================
             HEAP MEMORY
          ================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[40px]
              border
              border-cyan-400/20
              bg-cyan-500/[0.05]
              p-8
            "
          >

            {/* glow */}

            <motion.div

              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}

              transition={{
                duration: 4,
                repeat: Infinity,
              }}

              className="
                absolute
                bottom-[-100px]
                left-[-100px]
                h-[250px]
                w-[250px]
                rounded-full
                bg-cyan-400/10
                blur-[100px]
              "
            />

            <div className="relative z-10">

              <div className="mb-10">

                <p
                  className="
                    mb-4
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-cyan-400
                  "
                >

                  Runtime Area

                </p>

                <h3
                  className="
                    mb-3
                    text-5xl
                    font-black
                    tracking-[-0.05em]
                    text-cyan-300
                  "
                >

                  Heap Memory

                </h3>

                <p
                  className="
                    text-lg
                    leading-[1.9]
                    text-slate-400
                  "
                >

                  Dynamically allocated objects
                  created during runtime execution.

                </p>

              </div>

              <div className="space-y-6">

                {step.memoryAfter.heap.map(
                  (
                    object,
                    objectIndex
                  ) => (

                    <motion.div

                      key={objectIndex}

                      initial={{
                        opacity: 0,
                        scale: 0.5,
                        rotate: -8,
                      }}

                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                      }}

                      transition={{
                        duration: 0.8,
                      }}

                      className="
                        relative
                        overflow-hidden
                        rounded-[28px]
                        border
                        border-cyan-400/20
                        bg-black/30
                        p-6
                        shadow-[0_0_60px_rgba(6,182,212,0.08)]
                      "
                    >

                      {/* spawn glow */}

                      <motion.div

                        initial={{
                          scale: 0,
                          opacity: 1,
                        }}

                        animate={{
                          scale: 4,
                          opacity: 0,
                        }}

                        transition={{
                          duration: 1.2,
                        }}

                        className="
                          absolute
                          left-1/2
                          top-1/2
                          h-20
                          w-20
                          -translate-x-1/2
                          -translate-y-1/2
                          rounded-full
                          bg-cyan-400/20
                          blur-2xl
                        "
                      />

                      <div className="relative z-10">

                        <div className="mb-8">

                          <p
                            className="
                              mb-2
                              text-xs
                              uppercase
                              tracking-[0.3em]
                              text-cyan-400
                            "
                          >

                            Allocated Object

                          </p>

                          <h4
                            className="
                              text-4xl
                              font-black
                            "
                          >

                            {object.type}

                          </h4>

                          <p
                            className="
                              mt-3
                              text-2xl
                              font-black
                              text-cyan-300
                            "
                          >

                            {object.address}

                          </p>

                        </div>

                        <div className="space-y-4">

                          {Object.entries(
                            object.fields
                          ).map(
                            ([key, value]) => (

                              <motion.div

                                key={key}

                                initial={{
                                  opacity: 0,
                                  y: 20,
                                }}

                                animate={{
                                  opacity: 1,
                                  y: 0,
                                }}

                                transition={{
                                  delay: 0.5,
                                }}

                                className="
                                  flex
                                  items-center
                                  justify-between
                                  rounded-2xl
                                  border
                                  border-white/10
                                  bg-white/[0.04]
                                  px-5
                                  py-4
                                "
                              >

                                <div>

                                  <p
                                    className="
                                      mb-1
                                      text-xs
                                      uppercase
                                      tracking-[0.2em]
                                      text-slate-500
                                    "
                                  >

                                    Object Field

                                  </p>

                                  <p
                                    className="
                                      text-xl
                                      font-bold
                                    "
                                  >

                                    {key}

                                  </p>

                                </div>

                                <p
                                  className="
                                    text-2xl
                                    font-black
                                  "
                                >

                                  {value}

                                </p>

                              </motion.div>
                            )
                          )}

                        </div>

                      </div>

                    </motion.div>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
