import { useState } from 'react'
import { Mic, Scissors, Gamepad2, UploadCloud, Settings, Clock } from 'lucide-react'

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition border ${active ? 'bg-white text-slate-900 border-white' : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'}`}
    >
      {label}
    </button>
  )
}

function Panel({ title, description, onUpload, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-white/70 text-sm mt-1">{description}</p>
        </div>
        <button onClick={onUpload} className="inline-flex items-center gap-2 rounded-lg bg-white text-slate-900 px-3 py-2 font-semibold shadow hover:shadow-md transition">
          <UploadCloud className="w-4 h-4" /> Upload
        </button>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}

export default function Dashboard() {
  const [active, setActive] = useState('voice')

  return (
    <section id="dashboard" className="relative bg-slate-950 text-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Tab label="Voice Sync" active={active==='voice'} onClick={() => setActive('voice')} />
            <Tab label="Viral Clips" active={active==='viral'} onClick={() => setActive('viral')} />
            <Tab label="Minecraft Story" active={active==='mc'} onClick={() => setActive('mc')} />
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {active === 'voice' && (
            <Panel
              title="Voice Synced Word Display"
              description="Upload audio or video. We'll align words to speech and generate captions."
              onUpload={() => alert('Upload placeholder - connect API later')}
            >
              <div className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Mic className="w-5 h-5" /> High-accuracy transcription, word-level timings, timing correction.
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-white/70">
                  <div className="rounded-lg bg-white/5 p-3">Export: SRT, VTT, JSON, Kinetic Text</div>
                  <div className="rounded-lg bg-white/5 p-3">Templates: TikTok, Reels, Shorts</div>
                </div>
              </div>
            </Panel>
          )}

          {active === 'viral' && (
            <Panel
              title="Viral Moment Detection"
              description="Score clips for energy, pacing, and keywords. Auto-cut the best moments."
              onUpload={() => alert('Upload placeholder - connect API later')}
            >
              <div className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Scissors className="w-5 h-5" /> Generates a timeline of the most engaging segments.
                </div>
                <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm text-white/70">
                  <div className="rounded-lg bg-white/5 p-3">Auto Cuts</div>
                  <div className="rounded-lg bg-white/5 p-3">Simple Timeline Editor</div>
                  <div className="rounded-lg bg-white/5 p-3 flex items-center gap-2"><Clock className="w-4 h-4"/>Pacing Adjustments</div>
                </div>
              </div>
            </Panel>
          )}

          {active === 'mc' && (
            <Panel
              title="Minecraft Story Generation"
              description="Analyze gameplay events and turn them into a structured narrative."
              onUpload={() => alert('Upload placeholder - connect API later')}
            >
              <div className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Gamepad2 className="w-5 h-5" /> Scene breakdown, transitions, and voiceover script draft.
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-white/70">
                  <div className="rounded-lg bg-white/5 p-3">Narrative Outline</div>
                  <div className="rounded-lg bg-white/5 p-3">Auto Sequence</div>
                </div>
              </div>
            </Panel>
          )}

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold">Export Presets</p>
                <p className="text-white/70 text-sm">One-click templates for each platform</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-lg border border-white/10 bg-white/5">TikTok 9:16</span>
                <span className="px-3 py-1 rounded-lg border border-white/10 bg-white/5">YouTube 16:9</span>
                <span className="px-3 py-1 rounded-lg border border-white/10 bg-white/5">Reels 9:16</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
