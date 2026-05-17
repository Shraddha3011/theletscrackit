import { Link } from 'react-router-dom'
import { BookOpen, Code2, Trophy, Info } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="The LetsCrackIT"
            className="h-12 w-12 rounded-2xl object-cover shadow-[0_0_28px_rgba(166,210,92,0.25)]"
          />
          <div>
            <p className="font-display text-lg font-bold">The Lets CrackIT</p>
            <p className="text-sm text-slate-400">Crack concepts. Build confidence.</p>
          </div>
        </Link>

        <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-4">
          <Link to="/topics" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-emerald-300/30 hover:text-white">
            <BookOpen className="h-4 w-4 text-emerald-300" />
            Learn
          </Link>
          <Link to="/projects" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-emerald-300/30 hover:text-white">
            <Code2 className="h-4 w-4 text-emerald-300" />
            Practice
          </Link>
          <Link to="/quiz" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-emerald-300/30 hover:text-white">
            <Trophy className="h-4 w-4 text-emerald-300" />
            Master
          </Link>
          <Link to="/about" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-emerald-300/30 hover:text-white">
            <Info className="h-4 w-4 text-emerald-300" />
            About
          </Link>
        </div>
      </div>
    </footer>
  )
}
