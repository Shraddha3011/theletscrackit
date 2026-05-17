import {
  motion,
} from 'framer-motion'

export default function MemoryVisualizer({
  data,
}) {

  /* ============================================
     SAFETY
  ============================================ */

  if (
    !data ||
    !data.steps ||
    !data.steps.length
  ) {

    return null
  }

  /* ============================================
     CURRENT STEP
  ============================================ */

  const step =
    data.steps?.[0]

  if (!step) {

    return null
  }

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

      {/* ======================================
         HEADER
      ====================================== */}

      <div className="mb-12">

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

          Interactive Visualizer

        </p>

        <h2
          className="
            text-4xl
            font-black
            leading-[1.2]
          "
        >

          {data.title}

        </h2>

      </div>

      {/* ======================================
         MEMORY GRID
      ====================================== */}

      <div
        className="
          grid
          lg:grid-cols-2
          gap-8
        "
      >

        {/* ====================================
           STACK MEMORY
        ==================================== */}

        <div
          className="
            rounded-[28px]
            border
            border-emerald-400/20
            bg-emerald-500/5
            p-6
          "
        >

          <div className="mb-8">

            <h3
              className="
                text-3xl
                font-black
                text-emerald-300
                mb-3
              "
            >

              Stack Memory

            </h3>

            <p className="text-slate-400">

              Stores references & local variables

            </p>

          </div>

          <div className="space-y-5">

            {step.stack?.map(
              (
                item,
                index
              ) => (

                <motion.div

                  key={index}

                  initial={{
                    opacity: 0,
                    y: 30,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay:
                      index * 0.15,
                  }}

                  className="
                    rounded-2xl
                    border
                    border-emerald-400/20
                    bg-black/20
                    p-5
                  "
                >

                  <div className="flex items-center justify-between">

                    <p
                      className="
                        text-lg
                        font-bold
                        text-white
                      "
                    >

                      {item.variable}

                    </p>

                    <p
                      className="
                        text-emerald-300
                        font-semibold
                      "
                    >

                      {item.value}

                    </p>

                  </div>

                </motion.div>
              )
            )}

          </div>

        </div>

        {/* ====================================
           HEAP MEMORY
        ==================================== */}

        <div
          className="
            rounded-[28px]
            border
            border-cyan-400/20
            bg-cyan-500/5
            p-6
          "
        >

          <div className="mb-8">

            <h3
              className="
                text-3xl
                font-black
                text-cyan-300
                mb-3
              "
            >

              Heap Memory

            </h3>

            <p className="text-slate-400">

              Stores dynamically allocated objects

            </p>

          </div>

          <div className="space-y-5">

            {step.heap?.map(
              (
                obj,
                index
              ) => (

                <motion.div

                  key={index}

                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}

                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}

                  transition={{
                    delay:
                      index * 0.2,
                  }}

                  className="
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-black/20
                    p-6
                  "
                >

                  {/* object title */}

                  <div className="mb-6">

                    <h4
                      className="
                        text-2xl
                        font-black
                        text-white
                        mb-2
                      "
                    >

                      {obj.type}

                    </h4>

                    <p className="text-cyan-300">

                      {obj.id}

                    </p>

                  </div>

                  {/* fields */}

                  <div className="space-y-4">

                    {Object.entries(
                      obj.fields || {}
                    ).map(
                      ([key, value]) => (

                        <div

                          key={key}

                          className="
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            bg-white/[0.04]
                            px-4
                            py-3
                          "
                        >

                          <p className="text-slate-300">

                            {key}

                          </p>

                          <p
                            className="
                              font-semibold
                              text-white
                            "
                          >

                            {value}

                          </p>

                        </div>
                      )
                    )}

                  </div>

                </motion.div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  )
}