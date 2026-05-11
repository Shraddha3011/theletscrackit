import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Link } from 'react-router-dom'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import {
  Search,
  ArrowUpRight,
  Brain,
  BookOpen,
  Trophy,
} from 'lucide-react'

import {
  fetchTopics,
} from '../app/slices/topicsSlice'

import PageWrapper from '../components/layout/PageWrapper'

/* =========================================================
   3D MAGNETIC TILT
========================================================= */

function useMagneticTilt(ref) {

  useEffect(() => {

    const el = ref.current

    if (!el) return

    const handleMove = (e) => {

      const rect =
        el.getBoundingClientRect()

      const x =
        e.clientX - rect.left

      const y =
        e.clientY - rect.top

      const centerX =
        rect.width / 2

      const centerY =
        rect.height / 2

      const rotateX =
        ((y - centerY) / centerY) * -10

      const rotateY =
        ((x - centerX) / centerX) * 10

      el.style.transform = `
        perspective(1400px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
      `

      el.style.setProperty(
        '--x',
        `${x}px`
      )

      el.style.setProperty(
        '--y',
        `${y}px`
      )
    }

    const reset = () => {

      el.style.transform = `
        perspective(1400px)
        rotateX(0deg)
        rotateY(0deg)
        translateY(0px)
      `
    }

    el.addEventListener(
      'mousemove',
      handleMove
    )

    el.addEventListener(
      'mouseleave',
      reset
    )

    return () => {

      el.removeEventListener(
        'mousemove',
        handleMove
      )

      el.removeEventListener(
        'mouseleave',
        reset
      )
    }

  }, [ref])
}

/* =========================================================
   PARTICLES
========================================================= */

function FloatingParticles() {

  return (

    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {
        Array.from({
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
              animate-pulse
            "
            style={{
              left: `${i * 5}%`,
              top: `${100 + i * 2}%`,
              animation:
                `float ${12 + i}s linear infinite`,
            }}
          />

        ))
      }

    </div>
  )
}

/* =========================================================
   STATS CARD
========================================================= */

function StatCard({
  icon,
  value,
  label,
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-4
        rounded-[28px]
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-xl
        px-6
        py-5
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-[#06d96e]/40
        hover:shadow-[0_15px_50px_rgba(6,217,110,0.18)]
      "
    >

      <div
        className="
          flex
          h-[54px]
          w-[54px]
          items-center
          justify-center
          rounded-[18px]
          bg-gradient-to-br
          from-[#06d96e]/30
          to-cyan-400/10
        "
      >
        {icon}
      </div>

      <div>

        <h4
          className="
            text-2xl
            font-bold
            text-white
          "
        >
          {value}
        </h4>

        <p
          className="
            text-sm
            text-[#97a0cb]
          "
        >
          {label}
        </p>

      </div>

    </div>
  )
}

/* =========================================================
   TOPIC CARD
========================================================= */

function TopicCard({
  topic,
  index,
}) {

  const ref =
    useRef(null)

  useMagneticTilt(ref)

  const accent =
    topic.color ||
    '#06d96e'

  return (

    <Link
      ref={ref}
      to={`/topics/${topic.slug}`}
      className="
        group
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-xl
        p-7
        transition-all
        duration-500
        will-change-transform
      "
      style={{
        animation:
          `cardEnter .7s ease both`,
        animationDelay:
          `${index * 80}ms`,
      }}
    >

      {/* glow */}

      <div
        className="
          absolute
          inset-[-50%]
          opacity-0
          blur-[90px]
          transition-all
          duration-500
          group-hover:opacity-100
        "
        style={{
          background:
            `radial-gradient(circle at var(--x) var(--y), ${accent}55 0%, transparent 60%)`,
        }}
      />

      {/* shine */}

      <div
        className="
          absolute
          inset-0
          -translate-x-[140%]
          skew-x-[-22deg]
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
          group-hover:translate-x-[160%]
          transition-all
          duration-[1400ms]
        "
      />

      {/* top */}

      <div
        className="
          relative
          z-10
          mb-7
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            relative
            flex
            h-[74px]
            w-[74px]
            items-center
            justify-center
            overflow-hidden
            rounded-[24px]
            border
            backdrop-blur-md
            transition-all
            duration-500
            group-hover:scale-105
          "
          style={{
            background:
              `${accent}15`,
            borderColor:
              `${accent}50`,
          }}
        >

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-white/20
              to-transparent
            "
          />

          <span
            className="
              relative
              z-10
              text-[2rem]
            "
          >

            {
              topic.icon
                ? topic.icon.length > 2
                  ? topic.icon.charAt(0)
                  : topic.icon
                : '🚀'
            }

          </span>

        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/[0.06]
            text-[#dfe4ff]
            backdrop-blur-md
            transition-all
            duration-500
            group-hover:rotate-45
          "
          style={{
            background:
              'rgba(255,255,255,0.06)',
          }}
        >

          <ArrowUpRight size={18} />

        </div>

      </div>

      {/* content */}

      <div
        className="
          relative
          z-10
        "
      >

        <h3
          className="
            mb-3
            font-display
            text-[1.3rem]
            font-bold
            leading-[1.2]
            tracking-[-0.03em]
            text-white
            transition-all
            duration-300
            group-hover:text-[#06d96e]
          "
        >
          {topic.title}
        </h3>

        <p
          className="
            text-[0.96rem]
            leading-[1.8]
            text-[#97a0cb]
          "
        >

          {
            topic.description ||

            `Master ${topic.title} with structured learning paths and real-world projects.`
          }

        </p>

      </div>

      {/* footer */}

      <div
        className="
          relative
          z-10
          mt-7
          flex
          flex-wrap
          gap-2.5
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.05]
            px-4
            py-2.5
            text-[0.82rem]
            text-[#d8deff]
            backdrop-blur-md
          "
        >

          <BookOpen size={13} />

          <span>
            {topic.noteCount || 0}
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.05]
            px-4
            py-2.5
            text-[0.82rem]
            text-[#d8deff]
            backdrop-blur-md
          "
        >

          <Brain size={13} />

          <span>
            {topic.quizCount || 0}
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.05]
            px-4
            py-2.5
            text-[0.82rem]
            text-[#d8deff]
            backdrop-blur-md
          "
        >

          <Trophy size={13} />

          <span>
            {topic.questionCount || 0}
          </span>

        </div>

      </div>

      {/* bottom line */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-[4px]
          w-full
        "
        style={{
          background: accent,
        }}
      />

    </Link>
  )
}

/* =========================================================
   SKELETON
========================================================= */

function SkeletonCard() {

  return (

    <div
      className="
        rounded-[30px]
        border
        border-white/10
        bg-white/[0.05]
        p-7
      "
    >

      <div
        className="
          mb-6
          h-[70px]
          w-[70px]
          animate-pulse
          rounded-[24px]
          bg-white/10
        "
      />

      <div
        className="
          mb-3
          h-5
          w-[70%]
          animate-pulse
          rounded-full
          bg-white/10
        "
      />

      <div
        className="
          mb-3
          h-3.5
          animate-pulse
          rounded-full
          bg-white/10
        "
      />

      <div
        className="
          h-3.5
          w-[50%]
          animate-pulse
          rounded-full
          bg-white/10
        "
      />

    </div>
  )
}

/* =========================================================
   MAIN
========================================================= */

export default function Topics() {

  const dispatch =
    useDispatch()

  const {
    list: topics,
    loading,
  } = useSelector(
    (state) => state.topics
  )

  const [search, setSearch] =
    useState('')

  useEffect(() => {

    dispatch(fetchTopics())

  }, [dispatch])

  const totalNotes =
    useMemo(() => {

      return topics.reduce(

        (acc, topic) =>

          acc + (topic.noteCount || 0),

        0
      )

    }, [topics])

  const totalQuizzes =
    useMemo(() => {

      return topics.reduce(

        (acc, topic) =>

          acc + (topic.quizCount || 0),

        0
      )

    }, [topics])

  const filteredTopics =
    useMemo(() => {

      return topics.filter((topic) =>

        topic.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )

    }, [topics, search])

  return (

    <PageWrapper>

      <div
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#080809]
          px-6
          pb-32
          pt-24
          text-white
        "
      >

        {/* gradients */}

        <div
          className="
            absolute
            left-0
            top-0
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
            bottom-0
            right-0
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/10
            blur-[120px]
          "
        />

        <FloatingParticles />

        {/* HERO */}

        <section
          className="
            relative
            z-10
            mx-auto
            max-w-[1200px]
            text-center
          "
        >

          <div className="animate-slide-up">

            <h1
              className="
                font-display
                font-bold
                leading-[1.06]
                tracking-[-0.07em]
                text-[clamp(2.6rem,5.5vw,4.2rem)]
                text-white
              "
            >

              Explore The
              <br />

              <span
                className="
                  relative
                  inline-block
                  bg-gradient-to-r
                  from-[#06d96e]
                  via-[#2df28a]
                  to-cyan-400
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_0_28px_rgba(6,217,110,0.2)]
                "
              >

                Learning Universe

              </span>

            </h1>

          </div>

          <p
            className="
              mx-auto
              mb-10
              mt-6
              max-w-[720px]
              text-[1.05rem]
              leading-[1.8]
              text-[#97a0cb]
            "
          >

            Discover dynamic learning
            paths powered by modern
            technology and immersive
            educational experiences.

          </p>

          {/* search */}

          <div
            className="
              mx-auto
              mb-14
              flex
              max-w-[520px]
              items-center
              gap-3
              rounded-[24px]
              border
              border-white/10
              bg-white/[0.05]
              px-6
              py-4
              backdrop-blur-xl
            "
          >

            <Search
              size={18}
              className="text-[#7d87af]"
            />

            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                flex-1
                bg-transparent
                text-white
                outline-none
                placeholder:text-[#7d87af]
              "
            />

          </div>

          {/* stats */}

          <div
            className="
              mb-20
              grid
              gap-5
              md:grid-cols-3
            "
          >

            <StatCard
              icon={
                <BookOpen size={18} />
              }
              value={topics.length}
              label="Topics"
            />

            <StatCard
              icon={
                <BookOpen size={18} />
              }
              value={totalNotes}
              label="Notes"
            />

            <StatCard
              icon={
                <Brain size={18} />
              }
              value={totalQuizzes}
              label="Quizzes"
            />

          </div>

        </section>

        {/* GRID */}

        <section
          className="
            relative
            z-10
            mx-auto
            grid
            max-w-[1300px]
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {
            loading ? (

              Array.from({
                length: 8,
              }).map((_, i) => (

                <SkeletonCard
                  key={i}
                />

              ))

            ) : filteredTopics.length > 0 ? (

              filteredTopics.map(
                (
                  topic,
                  index
                ) => (

                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={index}
                  />

                )
              )

            ) : (

              <div
                className="
                  col-span-full
                  py-28
                  text-center
                "
              >

                <div
                  className="
                    mb-5
                    text-6xl
                  "
                >
                  🌌
                </div>

                <h2
                  className="
                    mb-2
                    font-display
                    text-3xl
                    font-bold
                  "
                >
                  No Topics Found
                </h2>

                <p
                  className="
                    text-[#97a0cb]
                  "
                >
                  Try another keyword.
                </p>

              </div>

            )
          }

        </section>

        <style>{`

          @keyframes cardEnter{
            from{
              opacity:0;
              transform:
                translateY(30px)
                scale(.96);
            }
            to{
              opacity:1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          @keyframes float{
            from{
              transform:
                translateY(0);
              opacity:0;
            }
            10%{
              opacity:1;
            }
            to{
              transform:
                translateY(-130vh);
              opacity:0;
            }
          }

        `}</style>

      </div>

    </PageWrapper>
  )
}