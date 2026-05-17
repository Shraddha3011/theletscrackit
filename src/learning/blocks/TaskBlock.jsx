import { useMemo, useState } from 'react'
import { Check, Code2, Flag, Rocket } from 'lucide-react'

export default function TaskBlock({ data }) {
  const [done, setDone] = useState({})
  const steps = data.steps || []
  const completed = useMemo(() => Object.values(done).filter(Boolean).length, [done])
  const progress = steps.length ? Math.round((completed / steps.length) * 100) : 0

  return (
    <div className="overflow-hidden rounded-[28px] border border-emerald-400/20 bg-[#07110d]">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-white/10 bg-emerald-500/[0.08] p-7 lg:border-b-0 lg:border-r">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
            <Rocket className="h-4 w-4" />
            Mission
          </div>

          <h2 className="mb-4 text-3xl font-black leading-tight text-white">{data.title}</h2>
          <p className="mb-6 text-base leading-7 text-slate-300">{data.brief}</p>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              <Flag className="h-4 w-4 text-emerald-200" />
              Goal
            </div>
            <p className="leading-7 text-slate-100">{data.goal}</p>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              <span>Mission progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-7">
          {steps.length > 0 && (
            <div className="mb-6 space-y-3">
              {steps.map((step, index) => {
                const checked = Boolean(done[index])
                return (
                  <button
                    key={step}
                    onClick={() => setDone((current) => ({ ...current, [index]: !checked }))}
                    className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition ${
                      checked
                        ? 'border-emerald-300/30 bg-emerald-300/10'
                        : 'border-white/10 bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-black ${
                      checked ? 'bg-emerald-300 text-black' : 'bg-white/10 text-white'
                    }`}>
                      {checked ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <span className="text-slate-200">{step}</span>
                  </button>
                )
              })}
            </div>
          )}

          {data.starterCode && (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-5 py-3 text-sm font-semibold text-slate-300">
                <Code2 className="h-4 w-4 text-emerald-200" />
                Starter code
              </div>
              <pre className="max-h-[320px] overflow-x-auto bg-[#020806] p-5 text-sm leading-7 text-emerald-100">
                <code>{data.starterCode}</code>
              </pre>
            </div>
          )}

          {data.projectConnection && (
            <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-200/70">
                Project connection
              </p>
              <p className="leading-7 text-violet-100">{data.projectConnection}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
