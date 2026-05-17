import { useMemo, useState } from 'react'
import {
  Search,
  Code2,
  Layers3,
  Blocks,
  Cloud,
  Database,
  GitBranch,
  Shield,
  BrainCircuit,
  Smartphone,
  Palette,
  Globe,
  Server,
  Gamepad2,
} from 'lucide-react'

import { motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'

const categories = [
  {
    title: 'Programming Languages',
    icon: Code2,
    color: '#00ffae',
    items: [
      'Java',
      'JavaScript',
      'TypeScript',
      'Python',
      'Go',
      'Rust',
      'C',
      'C++',
      'C#',
      'Kotlin',
      'Swift',
      'Dart',
      'PHP',
      'Ruby',
      'Scala',
      'R',
      'MATLAB',
      'Perl',
      'Lua',
      'Haskell',
      'Elixir',
      'Clojure',
      'F#',
      'Objective-C',
      'Shell',
      'Bash',
      'PowerShell',
      'Assembly',
      'Fortran',
      'COBOL',
      'Julia',
      'Groovy',
      'Ada',
      'Prolog',
      'Erlang',
      'OCaml',
      'Nim',
      'Crystal',
      'Zig',
      'Solidity',
    ],
  },

  {
    title: 'Frontend',
    icon: Globe,
    color: '#8b5cf6',
    items: [
      'HTML',
      'CSS',
      'Sass',
      'SCSS',
      'Responsive Design',
      'Accessibility',
      'SEO',
      'Web APIs',
      'Animations',
      'Progressive Web Apps',
    ],
  },

  {
    title: 'Frameworks',
    icon: Layers3,
    color: '#06b6d4',
    items: [
      'Angular',
      'Flutter',
      'Spring Boot',
      'Next.js',
      'Vue',
      'Nuxt.js',
      'NestJS',
      'Express',
      'Django',
      'Flask',
      'FastAPI',
      'Ruby on Rails',
      'ASP.NET',
      'Laravel',
      'Symfony',
      'Ktor',
      'Quarkus',
      'Micronaut',
      'React Native',
      'SwiftUI',
      'Jetpack Compose',
    ],
  },

  {
    title: 'Libraries',
    icon: Blocks,
    color: '#f97316',
    items: [
      'React',
      'Redux',
      'Framer Motion',
      'Three.js',
      'TensorFlow',
      'PyTorch',
      'NumPy',
      'Pandas',
      'Matplotlib',
      'jQuery',
      'Axios',
      'RxJS',
      'Lodash',
      'Socket.IO',
      'Hibernate',
      'JUnit',
      'OpenCV',
      'D3.js',
      'Tailwind CSS',
    ],
  },

  {
    title: 'Databases',
    icon: Database,
    color: '#10b981',
    items: [
      'PostgreSQL',
      'MongoDB',
      'MySQL',
      'Redis',
      'Firebase',
      'Oracle',
      'SQLite',
      'MariaDB',
      'Cassandra',
      'DynamoDB',
      'Neo4j',
      'ElasticSearch',
      'Supabase',
      'CockroachDB',
    ],
  },

  {
    title: 'Cloud',
    icon: Cloud,
    color: '#f59e0b',
    items: [
      'AWS',
      'Azure',
      'Google Cloud',
      'DigitalOcean',
      'Vercel',
      'Netlify',
      'Cloudflare',
      'Heroku',
      'Firebase Hosting',
      'Render',
      'Railway',
    ],
  },

  {
    title: 'DevOps',
    icon: Server,
    color: '#38bdf8',
    items: [
      'Docker',
      'Kubernetes',
      'CI/CD',
      'Linux',
      'Terraform',
      'Nginx',
      'Apache',
      'Jenkins',
      'GitHub Actions',
      'Prometheus',
      'Grafana',
      'Ansible',
      'Microservices',
      'Serverless',
    ],
  },

  {
    title: 'Developer Tools',
    icon: GitBranch,
    color: '#ef4444',
    items: [
      'Git',
      'GitHub',
      'GitLab',
      'Bitbucket',
      'VS Code',
      'IntelliJ IDEA',
      'Android Studio',
      'Xcode',
      'Postman',
      'Swagger',
      'Figma',
      'Jira',
      'Slack',
      'Webpack',
      'Vite',
      'npm',
      'Yarn',
      'pnpm',
    ],
  },

  {
    title: 'Artificial Intelligence',
    icon: BrainCircuit,
    color: '#ec4899',
    items: [
      'Machine Learning',
      'Deep Learning',
      'Computer Vision',
      'NLP',
      'Generative AI',
      'LLMs',
      'Prompt Engineering',
      'AI Agents',
      'Neural Networks',
      'Data Science',
    ],
  },

  {
    title: 'Cyber Security',
    icon: Shield,
    color: '#ff3b5c',
    items: [
      'Ethical Hacking',
      'Encryption',
      'OWASP',
      'OAuth',
      'JWT',
      'Firewalls',
      'Penetration Testing',
      'Threat Detection',
      'Digital Forensics',
      'Network Security',
    ],
  },

  {
    title: 'Mobile Development',
    icon: Smartphone,
    color: '#22d3ee',
    items: [
      'Android',
      'iOS',
      'Cross Platform Apps',
      'Native Apps',
      'Push Notifications',
      'Offline Storage',
      'Mobile Security',
      'App Store Publishing',
      'Play Store Publishing',
    ],
  },

  {
    title: 'UI / UX Design',
    icon: Palette,
    color: '#fb7185',
    items: [
      'Figma',
      'Wireframing',
      'Typography',
      'Color Theory',
      'Design Systems',
      'Prototyping',
      'Interaction Design',
      'User Experience',
      'Accessibility',
    ],
  },

  {
    title: 'Game Development',
    icon: Gamepad2,
    color: '#a855f7',
    items: [
      'Unity',
      'Unreal Engine',
      'Godot',
      'Game Physics',
      'Shaders',
      '3D Rendering',
      '2D Rendering',
      'Collision Detection',
      'Animation Systems',
      'Multiplayer Networking',
    ],
  },
]

export default function SoftwareUniverse() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(
    categories[0].title
  )

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter(
        (category) =>
          category.title
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          category.items.length > 0
      )
  }, [search])

  const activeData =
    filteredCategories.find(
      (category) => category.title === activeCategory
    ) || filteredCategories[0]

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* HERO */}
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />

            <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="text-center"
            >
              <h1
                className="
                  text-[clamp(2.8rem,6vw,6rem)]
                  font-black
                  tracking-[-5px]
                  leading-none
                "
              >
                Software{' '}
                <span
                  className="
                    bg-gradient-to-r
                    from-emerald-400
                    via-cyan-400
                    to-violet-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  Universe
                </span>
              </h1>

              <p className="mt-5 text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Explore the complete ecosystem of software
                engineering. Programming languages,
                frameworks, cloud, databases, AI,
                cybersecurity, developer tools and more.
              </p>

              {/* SEARCH */}
              <div className="mt-10 flex justify-center">
                <div className="relative w-full max-w-2xl">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                  <input
                    type="text"
                    placeholder="Search Java, React, Flutter, AWS, MongoDB..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      backdrop-blur-2xl
                      pl-14
                      pr-6
                      py-4
                      text-white
                      outline-none
                      text-lg
                      placeholder:text-slate-500
                      focus:border-emerald-400/40
                      transition-all
                    "
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* MAIN LAYOUT */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-[320px_1fr] gap-8">
            {/* SIDEBAR */}
            <div
              className="
                lg:sticky
                lg:top-6
                h-fit
                rounded-3xl
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                p-4
              "
            >
              <div className="mb-4 px-3">
                <h2 className="text-xl font-bold">
                  Categories
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Explore software engineering ecosystem
                </p>
              </div>

              <div className="space-y-2">
                {filteredCategories.map((category) => {
                  const Icon = category.icon
                  const active =
                    activeCategory === category.title

                  return (
                    <button
                      key={category.title}
                      onClick={() =>
                        setActiveCategory(category.title)
                      }
                      className={`
                        w-full
                        rounded-2xl
                        border
                        transition-all
                        duration-300
                        p-4
                        text-left
                        ${
                          active
                            ? 'border-white/20 bg-white/[0.08]'
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{
                            background: `${category.color}20`,
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{
                              color: category.color,
                            }}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-white">
                            {category.title}
                          </div>

                          <div className="text-sm text-slate-500">
                            {category.items.length} items
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CONTENT */}
            {activeData && (
              <motion.div
                key={activeData.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  backdrop-blur-xl
                  p-8
                "
              >
                {/* HEADER */}
                <div className="flex items-center gap-5">
                  <div
                    className="w-20 h-20 rounded-[24px] flex items-center justify-center"
                    style={{
                      background: `${activeData.color}20`,
                    }}
                  >
                    <activeData.icon
                      className="w-10 h-10"
                      style={{
                        color: activeData.color,
                      }}
                    />
                  </div>

                  <div>
                    <h2 className="text-5xl font-black tracking-[-3px]">
                      {activeData.title}
                    </h2>

                    <p className="mt-2 text-slate-400 text-lg">
                      {activeData.items.length} technologies
                    </p>
                  </div>
                </div>

                {/* GRID */}
                <div className="mt-10 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeData.items.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.02,
                      }}
                      whileHover={{
                        y: -6,
                        scale: 1.02,
                      }}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        backdrop-blur-xl
                        p-5
                        transition-all
                      "
                    >
                      <div
                        className="absolute top-0 left-0 h-1 w-full"
                        style={{
                          background: activeData.color,
                        }}
                      />

                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={{
                          background: `radial-gradient(circle at top left, ${activeData.color}20, transparent 60%)`,
                        }}
                      />

                      <div className="relative z-10">
                        <div className="text-lg font-bold text-white">
                          {item}
                        </div>

                        <div className="mt-2 text-sm text-slate-500">
                          Explore ecosystem
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}