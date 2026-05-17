import { useEffect, useMemo, useState } from 'react'

import { Link, useParams } from 'react-router-dom'

import { motion } from 'framer-motion'

import {
  ChevronRight,
  Search,
  Clock,
  Layers,
  BookOpen,
  ArrowRight,
  Hammer,
  Play,
  CheckCircle2,
} from 'lucide-react'

import { getCourseBySlugApi } from '../api/courseApi'

import PageWrapper from '../components/layout/PageWrapper'

/* ======================================================
   MODULE COLORS
====================================================== */

const MODULE_ACCENTS = [
  '#06d96e',
  '#06b6d4',
  '#a78bfa',
  '#f472b6',
  '#fb923c',
  '#facc15',
]

/* ======================================================
   ORB
====================================================== */

function Orb({ color, style }) {

  return (

    <div
      className="
        pointer-events-none
        absolute
        rounded-full
        blur-[130px]
        opacity-20
      "
      style={{
        background: color,
        ...style,
      }}
    />

  )
}

/* ======================================================
   LESSON CARD
====================================================== */

function MissionCard({
  lesson,
  index,
  moduleIndex,
}) {

  const accent =
    MODULE_ACCENTS[
      moduleIndex %
      MODULE_ACCENTS.length
    ]

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        delay: index * 0.05,
      }}

    >

      <Link

        to={`/lesson/${lesson.slug}`}

        className="
          group
          relative
          flex
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-white/10
          bg-white/[0.04]
          p-6
          transition-all
          duration-500
          hover:-translate-y-1
        "

      >

        {/* glow */}

        <div
          className="
            absolute
            -right-10
            -top-10
            h-32
            w-32
            rounded-full
            blur-3xl
            opacity-10
          "
          style={{
            background: accent,
          }}
        />

        {/* top */}

        <div
          className="
            mb-5
            flex
            items-center
            justify-between
          "
        >

          <div

            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              font-black
            "

            style={{
              background: `${accent}20`,
              color: accent,
              border: `1px solid ${accent}40`,
            }}

          >

            {index + 1}

          </div>

          <div
            className="
              rounded-full
              px-3
              py-1
              text-[10px]
              font-bold
            "
            style={{
              background: `${accent}15`,
              color: accent,
            }}
          >
            +50 XP
          </div>

        </div>

        {/* title */}

        <h3
          className="
            mb-3
            text-xl
            font-black
            text-white
          "
        >
          {lesson.title}
        </h3>

        {/* description */}

        <p
          className="
            text-sm
            leading-7
            text-slate-400
          "
        >
          {lesson.description}
        </p>

        {/* task */}

        {
          lesson.taskTitle && (

            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-pink-500/20
                bg-pink-500/10
                p-4
              "
            >

              <Hammer
                className="
                  mt-0.5
                  h-4
                  w-4
                  text-pink-400
                "
              />

              <div>

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-pink-400
                  "
                >
                  Build Task
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  {lesson.taskTitle}
                </p>

              </div>

            </div>

          )
        }

        {/* footer */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-bold
            "
            style={{
              color: accent,
            }}
          >

            <Play className="h-4 w-4" />

            Start Lesson

          </div>

          <ArrowRight
            className="
              h-4
              w-4
              text-white/40
              transition-all
              duration-300
              group-hover:translate-x-1
            "
          />

        </div>

      </Link>

    </motion.div>

  )
}

/* ======================================================
   MODULE SECTION
====================================================== */

function ModuleSection({
  module,
  search,
  moduleIndex,
}) {

  const lessons =
    (module.lessons || []).filter(
      (lesson) =>
        lesson.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    )

  if (!lessons.length) {
    return null
  }

  const accent =
    MODULE_ACCENTS[
      moduleIndex %
      MODULE_ACCENTS.length
    ]

  return (

    <section>

      {/* module header */}

      <div
        className="
          mb-8
          flex
          items-end
          justify-between
          gap-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div

            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
            "

            style={{
              background: `${accent}20`,
              color: accent,
              border: `1px solid ${accent}40`,
            }}

          >

            <Layers className="h-5 w-5" />

          </div>

          <div>

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.3em]
                text-slate-500
              "
            >
              MODULE {moduleIndex + 1}
            </p>

            <h2
              className="
                mt-1
                text-3xl
                font-black
                text-white
              "
            >
              {module.title}
            </h2>

          </div>

        </div>

        <div
          className="
            rounded-full
            px-4
            py-2
            text-xs
            font-bold
          "
          style={{
            background: `${accent}15`,
            color: accent,
          }}
        >
          {lessons.length} Lessons
        </div>

      </div>

      {/* lessons */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {
          lessons.map(
            (lesson, index) => (

              <MissionCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                moduleIndex={moduleIndex}
              />

            )
          )
        }

      </div>

    </section>

  )
}

/* ======================================================
   MAIN
====================================================== */

export default function SubTopics() {

  const { slug } =
    useParams()

  const [course, setCourse] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState('')

  /* ======================================================
     FIXED API CALL
  ====================================================== */

  useEffect(() => {

    let ignore = false

    const fetchCourse = async () => {

      try {

        setLoading(true)

        const { data } =
          await getCourseBySlugApi(slug)

        if (!ignore) {

          setCourse(data)
        }

      } catch (error) {

        console.log(error)

        if (!ignore) {

          setCourse(null)
        }

      } finally {

        if (!ignore) {

          setLoading(false)
        }
      }
    }

    fetchCourse()

    return () => {

      ignore = true
    }

  }, [slug])

  /* ======================================================
     LESSONS
  ====================================================== */

  const allLessons =
    useMemo(() => {

      return course?.modules?.flatMap(
        (m) => m.lessons || []
      ) || []

    }, [course])

  const accent =
    course?.color ||
    '#06d96e'

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading) {

    return (

      <PageWrapper>

        <div
          className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#050816]
          "
        >

          <motion.div

            animate={{
              rotate: 360,
            }}

            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear',
            }}

            className="
              h-14
              w-14
              rounded-full
              border-4
              border-t-transparent
            "

            style={{
              borderColor:
                `${accent} transparent transparent transparent`,
            }}

          />

        </div>

      </PageWrapper>

    )
  }

  /* ======================================================
     NOT FOUND
  ====================================================== */

  if (!course) {

    return (

      <PageWrapper>

        <div
          className="
            flex
            min-h-screen
            flex-col
            items-center
            justify-center
            gap-5
            bg-[#050816]
            text-white
          "
        >

          <h1
            className="
              text-4xl
              font-black
            "
          >
            Topic Not Found
          </h1>

          <Link

            to="/topics"

            className="
              rounded-2xl
              px-6
              py-3
              font-bold
              text-black
            "

            style={{
              background: accent,
            }}

          >

            Back To Topics

          </Link>

        </div>

      </PageWrapper>

    )
  }

  /* ======================================================
     MAIN UI
  ====================================================== */

  return (

    <PageWrapper>

      <div
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#050816]
          pb-32
          pt-24
          text-white
        "
      >

        {/* background */}

        <Orb
          color={accent}
          style={{
            top: '-10%',
            left: '-10%',
            width: 700,
            height: 700,
          }}
        />

        <Orb
          color="#06b6d4"
          style={{
            bottom: '-10%',
            right: '-10%',
            width: 600,
            height: 600,
          }}
        />

        <section
          className="
            relative
            z-10
            mx-auto
            max-w-7xl
            px-6
          "
        >

          {/* breadcrumb */}

          <Link

            to="/topics"

            className="
              mb-8
              inline-flex
              items-center
              gap-2
              text-sm
              text-slate-400
            "

          >

            <ChevronRight
              className="
                h-4
                w-4
                rotate-180
              "
            />

            All Topics

          </Link>

          {/* hero */}

          <div className="mb-14">

            <h1
              className="
                mb-5
                text-[clamp(2.5rem,5vw,5rem)]
                font-black
                leading-[1.05]
              "
            >
              {course.title}
            </h1>

            <p
              className="
                max-w-3xl
                text-lg
                leading-8
                text-slate-400
              "
            >
              {course.description}
            </p>

          </div>

          {/* stats */}

          <div
            className="
              mb-10
              grid
              gap-5
              md:grid-cols-3
            "
          >

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/[0.05]
                p-6
              "
            >

              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-3
                "
              >

                <Layers
                  className="h-5 w-5"
                  style={{
                    color: accent,
                  }}
                />

                <span
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  Modules
                </span>

              </div>

              <h2
                className="
                  text-4xl
                  font-black
                "
              >
                {course.modules?.length || 0}
              </h2>

            </div>

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/[0.05]
                p-6
              "
            >

              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-3
                "
              >

                <BookOpen
                  className="h-5 w-5 text-cyan-400"
                />

                <span
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  Lessons
                </span>

              </div>

              <h2
                className="
                  text-4xl
                  font-black
                "
              >
                {allLessons.length}
              </h2>

            </div>

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/[0.05]
                p-6
              "
            >

              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-3
                "
              >

                <Clock
                  className="h-5 w-5 text-violet-400"
                />

                <span
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  Duration
                </span>

              </div>

              <h2
                className="
                  text-4xl
                  font-black
                "
              >
                ~{allLessons.length * 8}m
              </h2>

            </div>

          </div>

          {/* search */}

          <div
            className="
              mb-14
              flex
              max-w-xl
              items-center
              gap-3
              rounded-2xl
              border
              border-white/10
              bg-white/[0.05]
              px-5
              py-4
            "
          >

            <Search
              className="
                h-5
                w-5
                text-slate-500
              "
            />

            <input

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

              placeholder="Search lessons..."

              className="
                flex-1
                bg-transparent
                text-white
                outline-none
                placeholder:text-slate-500
              "

            />

          </div>

          {/* modules */}

          <div className="space-y-20">

            {
              course.modules?.map(
                (
                  module,
                  index
                ) => (

                  <ModuleSection
                    key={module.id}
                    module={module}
                    moduleIndex={index}
                    search={search}
                  />

                )
              )
            }

          </div>

        </section>

      </div>

    </PageWrapper>

  )
}