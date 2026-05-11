import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import {
  fetchTopicBySlug,
} from '../app/slices/topicsSlice'

import {
  getNotesApi,
} from '../api/notesApi'

import PageWrapper from '../components/layout/PageWrapper'

import {
  Search,
  Trophy,
  BookOpen,
  Brain,
  Eye,
  ArrowRight,
} from 'lucide-react'

const FILTERS = [
  'ALL',
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
]

function Particles() {

  return (

    <div className="particles">

      {Array.from({
        length: 20,
      }).map((_, i) => (

        <span
          key={i}
          className="particle"
          style={{
            '--i': i,
          }}
        />

      ))}

    </div>
  )
}

function NoteCard({
  note,
  index,
}) {

  const difficulty =
    note.difficulty || 'BEGINNER'

const accent =
  difficulty === 'ADVANCED'
    ? '#22c55e'
    : difficulty === 'INTERMEDIATE'
    ? '#34d399'
    : '#00ff99'

  return (

    <Link
      to={`/notes/${note.slug}`}
      className="note-card"
      style={{
        '--accent': accent,
        '--delay':
          `${index * 70}ms`,
      }}
    >

      <div className="note-glow" />

      <div className="note-shine" />

      <div className="note-top">

        <div
          className="difficulty-badge"
          style={{
            color: accent,
            borderColor:
              `${accent}40`,
            background:
              `${accent}12`,
          }}
        >

          {difficulty}

        </div>

        <div className="note-arrow">

          <ArrowRight size={15} />

        </div>

      </div>

      <h3>

        {note.title}

      </h3>

      {note.tags?.length > 0 && (

        <div className="tags-wrap">

          {note.tags
            .slice(0, 4)
            .map((tag) => (

              <span
                key={tag}
                className="tag-pill"
              >

                #{tag}

              </span>
            ))}

        </div>
      )}

      <div className="note-footer">

        <div className="note-stat">

          <Eye size={14} />

          <span>
            {note.viewCount || 0}
          </span>

        </div>

      </div>

      <div
        className="note-line"
        style={{
          background: accent,
        }}
      />

    </Link>
  )
}

export default function TopicDetail() {

  const { slug } =
    useParams()

  const dispatch =
    useDispatch()

  const {
    current: topic,
    loading:
      topicLoading,
  } = useSelector(
    (s) => s.topics
  )

  const [notes, setNotes] =
    useState([])

  const [
    notesLoading,
    setNotesLoading,
  ] = useState(true)

  const [filter, setFilter] =
    useState('ALL')

  const [search, setSearch] =
    useState('')

  const [page, setPage] =
    useState(0)

  const [
    totalPages,
    setTotalPages,
  ] = useState(1)

  useEffect(() => {

    dispatch(
      fetchTopicBySlug(slug)
    )

  }, [slug, dispatch])

  useEffect(() => {

    if (!topic) return

    setNotesLoading(true)

    const params = {

      topic: topic.id,

      page,

      size: 12,
    }

    if (filter !== 'ALL') {

      params.difficulty =
        filter
    }

    getNotesApi(params)

      .then(({ data }) => {

        setNotes(
          data.content ||
          data ||
          []
        )

        setTotalPages(
          data.totalPages || 1
        )
      })

      .catch(() => {

        setNotes([])
      })

      .finally(() => {

        setNotesLoading(false)
      })

  }, [
    topic,
    filter,
    page,
  ])

  const filteredNotes =
    useMemo(() => {

      return notes.filter((n) =>

        n.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )

    }, [notes, search])

  if (topicLoading) {

    return (

      <PageWrapper>

        <div className="topic-page">

          <div className="notes-grid">

            {Array.from({
              length: 6,
            }).map((_, i) => (

              <div
                key={i}
                className="skeleton-card"
              />

            ))}

          </div>

        </div>

      </PageWrapper>
    )
  }

  if (!topic) {

    return (

      <PageWrapper>

        <div className="topic-page">

          <div className="empty-state">

            <div className="empty-icon">

              🌌

            </div>

            <h2>

              Topic Not Found

            </h2>

            <Link
              to="/topics"
              className="back-btn"
            >

              Back to Topics

            </Link>

          </div>

        </div>

      </PageWrapper>
    )
  }

  return (

    <PageWrapper>

      <div className="topic-page">

        <Particles />

        {/* HERO */}

        <section className="neo-hero">

          <div className="hero-aura hero-aura-1" />

          <div className="hero-aura hero-aura-2" />

          <div className="hero-grid" />

          <div className="hero-mini-top">

            <div className="hero-breadcrumbs">

              <Link
                to="/topics"
                className="breadcrumb"
              >

                Topics

              </Link>

              <span>/</span>

              <span className="breadcrumb-current">

                {topic.title}

              </span>

            </div>

            <button className="hero-floating-btn">

              <div className="btn-glow" />

              <Trophy size={17} />

              <span>

                Start Quiz

              </span>

            </button>

          </div>

          <div className="neo-main">

            <div className="neo-left">

              {/* icon */}

              <div className="neo-icon">

                <div className="neo-icon-bg" />

                <span className="neo-icon-text">

                  {
                    topic.icon
                      ? topic.icon.length > 2
                        ? topic.icon.slice(0, 3)
                        : topic.icon
                      : '🚀'
                  }

                </span>

              </div>

              {/* content */}

              <div className="neo-content">

                <div className="title-badge">

                  <span />

                  <p>

                    Knowledge Path

                  </p>

                </div>

                <h1>

                  {topic.title}

                </h1>

                <p className="topic-desc">

                  {
                    topic.description ||
                    `Master ${topic.title} with immersive cinematic learning experiences.`
                  }

                </p>

              </div>

            </div>

            {/* stats */}

            <div className="floating-stats">

              <div className="floating-stat">

                <BookOpen size={18} />

                <div>

                  <h3>

                    {notes.length}

                  </h3>

                  <span>

                    Notes

                  </span>

                </div>

              </div>

              <div className="floating-stat">

                <Brain size={18} />

                <div>

                  <h3>

                    {topic.quizCount || 0}

                  </h3>

                  <span>

                    Quizzes

                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* CONTROLS */}

        <section className="controls-wrap">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="filters-wrap">

            {FILTERS.map((f) => (

              <button
                key={f}
                onClick={() => {

                  setFilter(f)

                  setPage(0)
                }}
                className={
                  filter === f
                    ? 'filter-btn active'
                    : 'filter-btn'
                }
              >

                {f}

              </button>

            ))}

          </div>

        </section>

        {/* NOTES */}

        {notesLoading ? (

          <div className="notes-grid">

            {Array.from({
              length: 6,
            }).map((_, i) => (

              <div
                key={i}
                className="skeleton-card"
              />

            ))}

          </div>

        ) : filteredNotes.length > 0 ? (

          <div className="notes-grid">

            {filteredNotes.map(
              (note, index) => (

                <NoteCard
                  key={note.id}
                  note={note}
                  index={index}
                />
              )
            )}

          </div>

        ) : (

          <div className="empty-state">

            <div className="empty-icon">

              📚

            </div>

            <h2>

              No Notes Found

            </h2>

          </div>
        )}

      </div>

      <style>{`

@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');

*{
  box-sizing:border-box;
}

.topic-page{

  min-height:100vh;

  position:relative;

  overflow:hidden;

  padding:18px 24px 120px;

  background:

    radial-gradient(
      circle at top left,
      rgba(124,92,255,0.10),
      transparent 24%
    ),

    radial-gradient(
      circle at bottom right,
      rgba(255,120,80,0.08),
      transparent 24%
    ),

    #06070f;

  color:white;

  font-family:
    'Space Grotesk',
    sans-serif;
}

/* particles */

.particles{
  position:absolute;
  inset:0;
  overflow:hidden;
  pointer-events:none;
}

.particle{
  position:absolute;
  width:3px;
  height:3px;
  border-radius:50%;
  background:rgba(255,255,255,0.4);
  left:calc(var(--i) * 5%);
  top:110%;
  animation:
    floatParticle
    calc(12s + var(--i) * 1s)
    linear infinite;
}

@keyframes floatParticle{

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

/* hero */

.neo-hero{

  position:relative;

  max-width:1300px;

  margin:auto auto 28px;

  border-radius:36px;

  overflow:hidden;

  padding:34px;

  background:

    linear-gradient(
      145deg,
      rgba(11,13,24,0.95),
      rgba(6,8,16,0.92)
    );

  border:
    1px solid rgba(255,255,255,0.06);

  backdrop-filter:
    blur(24px);

  box-shadow:
    0 30px 90px rgba(0,0,0,0.45);
}

/* aura */

.hero-aura{
  position:absolute;
  border-radius:50%;
  filter:blur(120px);
  opacity:0.45;
}

.hero-aura-1{
  width:420px;
  height:420px;
  background:rgba(124,92,255,0.18);
  top:-160px;
  left:-120px;
}

.hero-aura-2{
  width:320px;
  height:320px;
  background:rgba(255,140,100,0.10);
  right:-100px;
  bottom:-120px;
}

/* grid */

.hero-grid{
  position:absolute;
  inset:0;

  background-image:

    linear-gradient(
      rgba(255,255,255,0.02) 1px,
      transparent 1px
    ),

    linear-gradient(
      90deg,
      rgba(255,255,255,0.02) 1px,
      transparent 1px
    );

  background-size:
    42px 42px;

  opacity:0.35;
}

/* top */

.hero-mini-top{

  position:relative;

  z-index:5;

  display:flex;

  justify-content:space-between;

  align-items:center;

  margin-bottom:40px;
}

.hero-breadcrumbs{

  display:flex;

  align-items:center;

  gap:10px;

  color:#7f89b3;

  font-size:0.82rem;
}

.breadcrumb{
  color:#9ba8ff;
  text-decoration:none;
}

.breadcrumb-current{
  color:white;
}

/* button */

.hero-floating-btn{

  height:52px;

  padding:0 24px;

  border-radius:999px;

  border:
    1px solid rgba(255,255,255,0.08);

  cursor:pointer;

  display:flex;

  align-items:center;

  gap:12px;

  position:relative;

  overflow:hidden;

  background:

    linear-gradient(
      135deg,
      #7c5cff,
      #9b6dff
    );

  color:white;

  font-size:0.86rem;

  font-weight:600;

  transition:
    all .35s ease;

  box-shadow:
    0 10px 35px rgba(124,92,255,0.28);
}

.hero-floating-btn:hover{

  transform:
    translateY(-4px);

  box-shadow:
    0 20px 50px rgba(124,92,255,0.4);
}

/* main */

.neo-main{

  position:relative;

  z-index:5;

  display:flex;

  justify-content:space-between;

  align-items:flex-end;

  gap:40px;

  flex-wrap:wrap;
}

.neo-left{

  display:flex;

  align-items:center;

  gap:28px;
}

/* icon */

.neo-icon{

  width:118px;
  height:118px;

  min-width:118px;

  border-radius:34px;

  position:relative;

  overflow:hidden;

  display:flex;

  align-items:center;

  justify-content:center;

  background:

    linear-gradient(
      145deg,
      rgba(124,92,255,0.16),
      rgba(255,255,255,0.03)
    );

  border:
    1px solid rgba(255,255,255,0.07);

  box-shadow:

    inset 0 1px 0 rgba(255,255,255,0.05),

    0 20px 60px rgba(0,0,0,0.4);
}

.neo-icon-bg{

  position:absolute;

  inset:-20%;

  background:
    radial-gradient(
      circle,
      rgba(124,92,255,0.28),
      transparent 70%
    );

  filter:blur(40px);
}

.neo-icon-text{

  position:relative;

  z-index:2;

  font-size:3rem;

  font-weight:700;

  color:white;

  letter-spacing:-0.06em;
}

/* content */

.title-badge{

  display:flex;

  align-items:center;

  gap:10px;

  margin-bottom:18px;
}

.title-badge span{

  width:36px;
  height:1px;

  background:
    linear-gradient(
      90deg,
      #7c5cff,
      transparent
    );
}

.title-badge p{

  font-size:0.75rem;

  letter-spacing:0.18em;

  text-transform:uppercase;

  color:#8f97be;

  margin:0;
}

.neo-content h1{

  font-size:
    clamp(2.8rem,6vw,5rem);

  line-height:0.92;

  letter-spacing:-0.08em;

  margin:0 0 18px;

  font-weight:700;

  color:transparent;

  background:

    linear-gradient(
      135deg,
      #ffffff 0%,
      #ececff 18%,
      #b7a8ff 45%,
      #8b7dff 70%,
      #ffffff 100%
    );

  background-size:
    200% 200%;

  -webkit-background-clip:text;

  background-clip:text;

  -webkit-text-fill-color:transparent;

  animation:
    titleMove 8s ease infinite;

  text-shadow:
    0 0 35px rgba(124,92,255,0.12);
}

@keyframes titleMove{

  0%{
    background-position:0% 50%;
  }

  50%{
    background-position:100% 50%;
  }

  100%{
    background-position:0% 50%;
  }
}

.topic-desc{

  max-width:700px;

  color:#9ea7cb;

  line-height:1.9;

  font-size:1rem;

  margin:0;
}

/* stats */

.floating-stats{

  display:flex;

  gap:16px;

  flex-wrap:wrap;
}

.floating-stat{

  min-width:170px;

  padding:20px;

  border-radius:24px;

  background:
    rgba(255,255,255,0.04);

  border:
    1px solid rgba(255,255,255,0.06);

  backdrop-filter:
    blur(18px);

  display:flex;

  align-items:center;

  gap:14px;

  transition:
    all .35s ease;
}

.floating-stat:hover{

  transform:
    translateY(-5px);

  border-color:
    rgba(124,92,255,0.25);
}

.floating-stat svg{
  color:#8b7dff;
}

.floating-stat h3{

  font-size:1.45rem;

  margin:0 0 4px;
}

.floating-stat span{

  color:#98a1c8;

  font-size:0.8rem;
}

/* controls */

.controls-wrap{

  max-width:1300px;

  margin:auto auto 32px;

  display:flex;

  gap:18px;

  align-items:center;

  justify-content:space-between;

  flex-wrap:wrap;
}

.search-box{

  flex:1;

  min-width:300px;

  display:flex;

  align-items:center;

  gap:12px;

  padding:16px 20px;

  border-radius:22px;

  background:
    rgba(255,255,255,0.04);

  border:
    1px solid rgba(255,255,255,0.06);

  backdrop-filter:
    blur(18px);
}

.search-box input{

  flex:1;

  background:transparent;

  border:none;

  outline:none;

  color:white;

  font-size:0.95rem;

  font-family:
    'Space Grotesk',
    sans-serif;
}

.search-box input::placeholder{
  color:#7d87af;
}

/* filters */

.filters-wrap{

  display:flex;

  gap:10px;

  flex-wrap:wrap;
}

.filter-btn{

  padding:11px 16px;

  border-radius:999px;

  border:
    1px solid rgba(255,255,255,0.06);

  background:
    rgba(255,255,255,0.03);

  color:#cfd6ff;

  cursor:pointer;

  transition:
    all .35s ease;

  font-size:0.78rem;
}

.filter-btn.active{

  background:
    linear-gradient(
      135deg,
      rgba(124,92,255,0.28),
      rgba(255,255,255,0.06)
    );

  border-color:
    rgba(124,92,255,0.3);

  color:white;
}

/* notes */

.notes-grid{

  max-width:1300px;

  margin:auto;

  display:grid;

  grid-template-columns:
    repeat(auto-fill,minmax(285px,1fr));

  gap:20px;
}

.note-card{

  position:relative;

  overflow:hidden;

  min-height:215px;

  border-radius:28px;

  padding:24px;

  text-decoration:none;

  color:white;

  background:

    linear-gradient(
      145deg,
      rgba(255,255,255,0.06),
      rgba(255,255,255,0.025)
    );

  border:
    1px solid rgba(255,255,255,0.06);

  backdrop-filter:
    blur(18px);

  transition:
    all .4s ease;

  animation:
    cardEnter .8s ease both;

  animation-delay:
    var(--delay);
}

.note-card:hover{

  transform:
    translateY(-10px);

  border-color:
    var(--accent);

  box-shadow:
    0 25px 70px rgba(0,0,0,0.4);
}

@keyframes cardEnter{

  from{
    opacity:0;
    transform:
      translateY(40px)
      scale(0.95);
  }

  to{
    opacity:1;
    transform:
      translateY(0)
      scale(1);
  }
}

.note-glow{

  position:absolute;

  inset:-50%;

  background:
    radial-gradient(
      circle at top left,
      color-mix(
        in srgb,
        var(--accent) 18%,
        transparent
      ),
      transparent 55%
    );

  opacity:0;

  filter:blur(120px);

  transition:0.4s;
}

.note-card:hover .note-glow{
  opacity:1;
}

.note-top{

  display:flex;

  justify-content:space-between;

  align-items:center;

  margin-bottom:18px;
}

.difficulty-badge{

  padding:8px 14px;

  border-radius:999px;

  border:1px solid;

  font-size:0.7rem;

  font-weight:600;
}

.note-arrow{

  width:40px;
  height:40px;

  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;

  background:
    rgba(255,255,255,0.04);

  border:
    1px solid rgba(255,255,255,0.06);

  transition:
    all .35s ease;
}

.note-card:hover .note-arrow{

  transform:
    rotate(-45deg);

  background:
    var(--accent);

  color:black;
}

.note-card h3{

  font-size:1.02rem;

  line-height:1.6;

  margin-bottom:18px;

  font-weight:600;
}

.tags-wrap{

  display:flex;

  gap:8px;

  flex-wrap:wrap;

  margin-bottom:26px;
}

.tag-pill{

  padding:7px 11px;

  border-radius:999px;

  background:
    rgba(255,255,255,0.04);

  border:
    1px solid rgba(255,255,255,0.06);

  color:#d4dbff;

  font-size:0.7rem;
}

.note-footer{

  position:absolute;

  left:24px;
  right:24px;
  bottom:20px;

  display:flex;

  justify-content:space-between;

  align-items:center;
}

.note-stat{

  display:flex;

  align-items:center;

  gap:8px;

  color:#c9d0ff;

  font-size:0.8rem;
}

.note-line{

  position:absolute;

  left:0;
  bottom:0;

  width:100%;
  height:4px;
}

/* skeleton */

.skeleton-card{

  height:220px;

  border-radius:30px;

  background:
    rgba(255,255,255,0.05);

  border:
    1px solid rgba(255,255,255,0.08);

  animation:
    pulse 1.4s infinite;
}

@keyframes pulse{

  0%{
    opacity:0.5;
  }

  50%{
    opacity:1;
  }

  100%{
    opacity:0.5;
  }
}
  /* empty state */

.empty-state{

  width:100%;

  min-height:320px;

  display:flex;

  flex-direction:column;

  align-items:center;

  justify-content:center;

  text-align:center;

  margin:40px auto 0;

  padding:40px 20px;

  border-radius:30px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.04),
      rgba(255,255,255,0.02)
    );

  border:
    1px solid rgba(255,255,255,0.06);

  backdrop-filter:
    blur(18px);

  max-width:1300px;
}

.empty-icon{

  font-size:4rem;

  line-height:1;

  margin-bottom:18px;

  filter:
    drop-shadow(
      0 0 30px rgba(0,255,153,0.18)
    );
}

.empty-state h2{

  margin:0;

  font-size:1.5rem;

  color:white;

  font-weight:700;

  letter-spacing:-0.04em;
}

.back-btn{

  margin-top:24px;

  height:48px;

  padding:0 22px;

  border-radius:999px;

  display:flex;

  align-items:center;

  justify-content:center;

  text-decoration:none;

  background:
    linear-gradient(
      135deg,
      #00ff99,
      #00c97b
    );

  color:#04110a;

  font-size:0.88rem;

  font-weight:700;

  box-shadow:
    0 12px 30px rgba(0,255,153,0.22);

  transition:
    all .35s ease;
}

.back-btn:hover{

  transform:
    translateY(-4px);

  box-shadow:
    0 20px 50px rgba(0,255,153,0.28);
}

/* mobile */

@media(max-width:768px){

  .topic-page{
    padding:14px 14px 90px;
  }

  .neo-hero{
    padding:24px;
    border-radius:28px;
  }

  .hero-mini-top{
    flex-direction:column;
    align-items:flex-start;
    gap:18px;
  }

  .neo-main{
    flex-direction:column;
    align-items:flex-start;
  }

  .neo-left{
    flex-direction:column;
    align-items:flex-start;
  }

  .neo-content h1{
    font-size:3rem;
  }

  .floating-stats{
    width:100%;
  }

  .floating-stat{
    flex:1;
  }

  .notes-grid{
    grid-template-columns:1fr;
  }
    
}

      `}</style>

    </PageWrapper>
  )
}