import { useState } from 'react'
import { BookOpen, Lightbulb, MousePointerClick, Theater } from 'lucide-react'

export default function TextBlock({ data }) {
  const [mode, setMode] = useState(data.story ? 'story' : 'concept')
  const [revealed, setRevealed] = useState(false)

  const modes = [
    { key: 'story', label: 'Story', icon: Theater, show: Boolean(data.story) },
    { key: 'concept', label: 'Concept', icon: BookOpen, show: true },
    { key: 'try', label: 'Try', icon: MousePointerClick, show: true },
  ].filter((item) => item.show)

  const activeText =
    mode === 'story'
      ? data.story
      : mode === 'try'
        ? data.interactionPrompt || 'Change one value in the example, predict the output, then run it and check your thinking.'
        : data.content

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07110d]">
      <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-[260px] border-b border-white/10 bg-gradient-to-br from-emerald-400/20 via-[#101c18] to-cyan-400/10 p-7 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_75%_70%,rgba(6,217,110,0.18),transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
                Scene mode
              </p>
              <div className="space-y-3">
                {modes.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                      mode === key
                        ? 'border-emerald-300/40 bg-emerald-300/15 text-white'
                        : 'border-white/10 bg-black/20 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-emerald-200" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                <Lightbulb className="h-4 w-4 text-amber-200" />
                Brain checkpoint
              </div>
              <button
                onClick={() => setRevealed((value) => !value)}
                className="text-left text-sm leading-6 text-slate-200"
              >
                {revealed
                  ? data.checkpoint || 'If you can explain the output before running the code, you are learning the flow.'
                  : 'Tap to reveal the tiny thing your brain should notice here.'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-7">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">
            {mode === 'story' ? 'Learning through story' : mode === 'try' ? 'Interactive prompt' : 'Simple explanation'}
          </p>
          <p className="text-lg leading-[1.85] text-slate-200">
            {activeText}
          </p>
        </div>
      </div>
    </div>
  )
}
