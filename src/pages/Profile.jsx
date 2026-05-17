import { motion } from 'framer-motion'
import {
  Mail,
  Sparkles,
  User2,
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import PageWrapper from '../components/layout/PageWrapper'

export default function Profile() {
  const { user } = useAuth()

  const accent = '#06d96e'

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />

          <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <div className="relative z-10 px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="
                relative
                overflow-hidden
                rounded-[2.8rem]
                border
                border-white/10
                bg-white/[0.04]
                p-10
                backdrop-blur-2xl
                md:p-14
              "
            >
              {/* glow */}
              <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]" />

              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3">
                  <Sparkles className="h-5 w-5 text-emerald-300" />

                  <span className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">
                    Developer Profile
                  </span>
                </div>

                <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                  <div
                    className="
                      relative
                      flex
                      h-32
                      w-32
                      items-center
                      justify-center
                      rounded-[2.5rem]
                      border
                      border-white/10
                      bg-white/[0.05]
                    "
                  >
                    <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-500/10 blur-2xl" />

                    <User2
                      className="relative z-10 h-14 w-14"
                      style={{ color: accent }}
                    />
                  </div>

                  <div>
                    <h1 className="text-5xl font-black tracking-tight md:text-6xl">
                      {user?.username || 'Developer'}
                    </h1>

                    <div className="mt-5 flex items-center gap-3 text-slate-400">
                      <Mail className="h-5 w-5" />

                      <span className="text-lg">
                        {user?.email}
                      </span>
                    </div>

                    <p className="mt-8 max-w-2xl text-lg leading-[2] text-slate-400">
                      Continue your cinematic learning journey and master
                      concepts visually through projects, runtime animations,
                      and guided developer experiences.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}