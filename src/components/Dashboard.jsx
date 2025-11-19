import { useState } from 'react'
import { Mic, Scissors, Gamepad2, UploadCloud, Clock, Link2, CheckCircle2, AlertTriangle, Sparkles, FileText, Tag } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

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
          <UploadCloud className="w-4 h-4" /> Upload / Link
        </button>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function JSONBlock({ data }) {
  return (
    <pre className="mt-4 w-full overflow-auto rounded-lg bg-black/40 p-4 text-xs text-emerald-200 border border-emerald-500/20">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

export default function Dashboard() {
  const [active, setActive] = useState('voice')
  const [videoURL, setVideoURL] = useState('')
  const [cookieHeader, setCookieHeader] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [urlStatus, setUrlStatus] = useState({ state: 'idle' }) // idle | checking | ok | error
  const [ingestedVideoId, setIngestedVideoId] = useState(null)
  const [extractedInfo, setExtractedInfo] = useState(null)
  const [jobResult, setJobResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Upload state
  const [uploadFileObj, setUploadFileObj] = useState(null)
  const defaultCategories = ['uncategorized','tutorials','gaming','podcast','vlog','education','music','review']
  const [categoryMode, setCategoryMode] = useState('pick') // pick | custom
  const [uploadCategory, setUploadCategory] = useState('uncategorized')
  const [customCategory, setCustomCategory] = useState('')
  const [lastUploadedCategory, setLastUploadedCategory] = useState(null)
  const [uploading, setUploading] = useState(false)

  const currentCategory = categoryMode === 'custom' ? (customCategory || 'uncategorized') : uploadCategory

  const validateURL = async () => {
    if (!videoURL) return
    setUrlStatus({ state: 'checking' })
    try {
      const res = await fetch(`${BACKEND}/api/validate-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoURL })
      })
      const data = await res.json()
      if (data.ok) {
        setUrlStatus({ state: 'ok', details: data })
      } else {
        setUrlStatus({ state: 'error', details: data })
      }
    } catch (e) {
      setUrlStatus({ state: 'error', details: { reason: String(e) } })
    }
  }

  const ingestURL = async () => {
    if (!videoURL) return alert('Paste a YouTube/video URL first')
    try {
      const res = await fetch(`${BACKEND}/api/ingest/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoURL, ...(cookieHeader ? { cookie_header: cookieHeader } : {}) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Failed to ingest')
      setIngestedVideoId(data.video_id)
      setExtractedInfo(data.extracted || null)
      setUrlStatus({ state: data.validation?.ok ? 'ok' : 'error', details: data.validation })
      setLastUploadedCategory(null) // URL ingest has no category
      alert('Video ready!')
      return data.video_id
    } catch (e) {
      alert('Error: ' + String(e))
    }
  }

  const uploadLocalFile = async () => {
    if (!uploadFileObj) return alert('Choose a file to upload')
    const cat = currentCategory.trim()
    if (!cat) return alert('Please pick or enter a category')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', uploadFileObj)
      form.append('category', cat)
      const res = await fetch(`${BACKEND}/api/ingest/upload`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Upload failed')
      setIngestedVideoId(data.video_id)
      setExtractedInfo(null)
      setLastUploadedCategory(data?.upload?.category || cat)
      setUrlStatus({ state: 'ok', details: { ok: true, reason: null, content_type: data?.upload?.content_type || 'upload', content_length: data?.upload?.size_bytes || null } })
      alert('Upload queued!')
    } catch (e) {
      alert('Upload error: ' + String(e))
    } finally {
      setUploading(false)
    }
  }

  const createJob = async (job_type, params = {}) => {
    if ((job_type === 'clip_cutter' || job_type === 'dopamine_story') && !ingestedVideoId) {
      alert('Use Video or Upload first to attach the media')
      return
    }
    setLoading(true)
    setJobResult(null)
    try {
      const res = await fetch(`${BACKEND}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_type, video_id: ingestedVideoId, params })
      })
      const data = await res.json()
      setJobResult(data)
    } catch (e) {
      setJobResult({ error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  const runClipCutter = async () => {
    await createJob('clip_cutter', {
      target_duration_s: 40,
      font: 'Inter',
      platforms: ['tiktok','youtube_shorts','instagram_reels']
    })
  }

  const runDopamineStory = async () => {
    await createJob('dopamine_story', {
      style: 'reddit',
      beats: 8,
      platform: 'tiktok'
    })
  }

  const runAIScriptWriter = async () => {
    await createJob('ai_script_writer', {
      topic: 'unexpected twist in a normal day',
      tone: 'fast_paced',
      max_lines: 10
    })
  }

  return (
    <section id="dashboard" className="relative bg-slate-950 text-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Tab label="Voice Sync" active={active==='voice'} onClick={() => setActive('voice')} />
            <Tab label="Clip Cutter" active={active==='clip'} onClick={() => setActive('clip')} />
            <Tab label="Dopamine Story" active={active==='story'} onClick={() => setActive('story')} />
            <Tab label="AI Script Writer" active={active==='script'} onClick={() => setActive('script')} />
            <Tab label="Viral Clips" active={active==='viral'} onClick={() => setActive('viral')} />
            <Tab label="Minecraft Story" active={active==='mc'} onClick={() => setActive('mc')} />
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-6">
            <div className="flex flex-col gap-4">
              {/* URL row */}
              <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                  <Link2 className="w-4 h-4 text-white/70" />
                  <input value={videoURL} onChange={e=>setVideoURL(e.target.value)} placeholder="Paste a video or YouTube URL" className="w-full md:w-[460px] px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none placeholder-white/50" />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={validateURL} className="px-3 py-2 rounded-lg bg-white text-slate-900 font-semibold">Check Link</button>
                  <button onClick={ingestURL} className="px-3 py-2 rounded-lg bg-emerald-400 text-emerald-900 font-semibold">Use Video</button>
                </div>
                {urlStatus.state === 'checking' && <span className="text-white/70 text-sm">Checking...</span>}
                {urlStatus.state === 'ok' && (
                  <span className="inline-flex items-center gap-1 text-emerald-300 text-sm"><CheckCircle2 className="w-4 h-4"/> Valid video</span>
                )}
                {urlStatus.state === 'error' && (
                  <span className="inline-flex items-center gap-1 text-rose-300 text-sm"><AlertTriangle className="w-4 h-4"/> {urlStatus?.details?.reason || 'Invalid URL'}</span>
                )}
              </div>

              {/* Advanced toggle for cookies */}
              <div className="flex items-center justify-between">
                <button onClick={() => setShowAdvanced(v=>!v)} className="text-xs text-white/70 underline underline-offset-4">
                  {showAdvanced ? 'Hide advanced' : 'Show advanced (YouTube cookies)'}
                </button>
              </div>
              {showAdvanced && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
                  <p className="text-xs text-white/80 mb-2">If a YouTube link needs sign-in/consent, paste your browser's Cookie header for youtube.com.</p>
                  <textarea value={cookieHeader} onChange={e=>setCookieHeader(e.target.value)} rows={3} placeholder="Cookie: VISITOR_INFO1_LIVE=...; SID=...; HSID=...; ..." className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none placeholder-white/50"></textarea>
                </div>
              )}

              {/* Upload row */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-white/70" />
                      <input type="file" accept="video/*,audio/*" onChange={e=>setUploadFileObj(e.target.files?.[0] || null)} className="text-sm" />
                    </div>

                    {/* Category picker */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-xs text-white/60 flex items-center gap-1"><Tag className="w-3 h-3"/> Category</label>
                      <div className="flex items-center gap-2">
                        <select value={categoryMode === 'custom' ? 'custom' : uploadCategory} onChange={e => {
                          if (e.target.value === 'custom') {
                            setCategoryMode('custom')
                          } else {
                            setCategoryMode('pick')
                            setUploadCategory(e.target.value)
                          }
                        }} className="px-2 py-2 rounded-lg bg-white/10 border border-white/10 text-sm">
                          {defaultCategories.map(c => <option key={c} value={c}>{c}</option>)}
                          <option value="custom">Custom…</option>
                        </select>
                        {categoryMode === 'custom' && (
                          <input value={customCategory} onChange={e=>setCustomCategory(e.target.value)} placeholder="type a category" className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none placeholder-white/50 text-sm" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button disabled={uploading} onClick={uploadLocalFile} className="px-3 py-2 rounded-lg bg-white text-slate-900 font-semibold disabled:opacity-60">
                        {uploading ? 'Uploading…' : 'Upload File'}
                      </button>
                    </div>
                  </div>

                  {uploadFileObj && (
                    <p className="text-xs text-white/60">Selected: {uploadFileObj.name} ({Math.round(uploadFileObj.size/1024)} KB)</p>
                  )}
                </div>
              </div>

              {(extractedInfo || ingestedVideoId) && (
                <div className="mt-2 text-xs text-white/80">
                  {ingestedVideoId && (
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span>Attached Media: <span className="font-mono text-emerald-300">{ingestedVideoId}</span></span>
                      {lastUploadedCategory && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                          <Tag className="w-3 h-3"/> {lastUploadedCategory}
                        </span>
                      )}
                    </div>
                  )}
                  {extractedInfo && (
                    <div className="grid sm:grid-cols-3 gap-2">
                      <div className="rounded-md bg-white/5 border border-white/10 p-2">Container: {extractedInfo.container || 'n/a'}</div>
                      <div className="rounded-md bg-white/5 border border-white/10 p-2">Resolution: {extractedInfo.resolution || 'n/a'}</div>
                      <div className="rounded-md bg-white/5 border border-white/10 p-2">Duration: {extractedInfo.duration ? `${extractedInfo.duration}s` : 'n/a'}</div>
                      <div className="rounded-md bg-white/5 border border-white/10 p-2">Audio: {extractedInfo.has_audio ? `yes (${extractedInfo.audio_codec||'?'})` : 'no'}</div>
                      <div className="rounded-md bg-white/5 border border-white/10 p-2">Video: {extractedInfo.has_video ? `yes (${extractedInfo.video_codec||'?'})` : 'no'}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {active === 'voice' && (
            <Panel
              title="Voice Synced Word Display"
              description="Upload audio or video. We'll align words to speech and generate captions."
              onUpload={() => ingestURL()}
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

          {active === 'clip' && (
            <Panel
              title="Clip Cutter"
              description="Auto-build a ~40s final cut: trims, removes silence, stabilizes and balances audio."
              onUpload={() => runClipCutter()}
            >
              <div className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Scissors className="w-5 h-5" /> Finds the strongest moments and assembles a final cut.
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <button disabled={loading} onClick={runClipCutter} className="px-3 py-2 rounded-lg bg-white text-slate-900 font-semibold inline-flex items-center gap-2 disabled:opacity-60">
                    <Sparkles className="w-4 h-4" /> {loading ? 'Processing…' : 'Generate Cut'}
                  </button>
                </div>
                {jobResult && <JSONBlock data={jobResult} />}
              </div>
            </Panel>
          )}

          {active === 'story' && (
            <Panel
              title="Dopamine Story"
              description="Writes a short, punchy Reddit-style story, narrates it, syncs subtitles, and overlays on your video."
              onUpload={() => runDopamineStory()}
            >
              <div className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Sparkles className="w-5 h-5" /> Fast-paced narration with tight visual loops.
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <button disabled={loading} onClick={runDopamineStory} className="px-3 py-2 rounded-lg bg-white text-slate-900 font-semibold inline-flex items-center gap-2 disabled:opacity-60">
                    <Sparkles className="w-4 h-4" /> {loading ? 'Building…' : 'Create Story'}
                  </button>
                </div>
                {jobResult && <JSONBlock data={jobResult} />}
              </div>
            </Panel>
          )}

          {active === 'script' && (
            <Panel
              title="AI Script Writer"
              description="Produces short, fast-paced scripts with clean structure and zero filler."
              onUpload={() => runAIScriptWriter()}
            >
              <div className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3 text-white/80">
                  <FileText className="w-5 h-5" /> Generates a script ready for voice and subtitle sync.
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <button disabled={loading} onClick={runAIScriptWriter} className="px-3 py-2 rounded-lg bg-white text-slate-900 font-semibold inline-flex items-center gap-2 disabled:opacity-60">
                    <Sparkles className="w-4 h-4" /> {loading ? 'Writing…' : 'Write Script'}
                  </button>
                </div>
                {jobResult && <JSONBlock data={jobResult} />}
              </div>
            </Panel>
          )}

          {active === 'viral' && (
            <Panel
              title="Viral Moment Detection"
              description="Score clips for energy, pacing, and keywords. Auto-cut the best moments."
              onUpload={() => ingestURL()}
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
              onUpload={() => ingestURL()}
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
