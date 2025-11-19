import { Cloud, Scissors, Text, Film, ShieldCheck, Wand2, Download, Image } from 'lucide-react'

export default function Features() {
  const items = [
    {
      icon: Text,
      title: 'Voice Synced Word Display',
      desc: 'Extract speech with high accuracy, edit timings at the word level, and export clean subtitles or kinetic text.',
    },
    {
      icon: Scissors,
      title: 'Viral Moment Detection',
      desc: 'Score energy, pacing, and keywords to auto-cut the best parts into short, publish-ready clips.',
    },
    {
      icon: Film,
      title: 'Minecraft Story Generation',
      desc: 'Analyze gameplay events to build a narrative with scenes, transitions, and voiceover text.',
    },
    {
      icon: Cloud,
      title: 'Cloud Processing',
      desc: 'Speedy pipeline with privacy-safe storage and timed auto deletion.',
    },
    {
      icon: Download,
      title: 'Multi-format Export',
      desc: 'Render for YouTube, TikTok, Reels, and more with platform-optimized templates.',
    },
    {
      icon: Image,
      title: 'Auto Thumbnails',
      desc: 'Generate engaging, on-brand thumbnails automatically for each output.',
    },
    {
      icon: ShieldCheck,
      title: 'Audio Cleanup',
      desc: 'Noise removal and loudness correction for broadcast-ready sound.',
    },
    {
      icon: Wand2,
      title: 'Automation API',
      desc: 'Integrate via API to trigger jobs and fetch results in your pipeline.',
    },
  ]

  return (
    <section id="features" className="relative bg-slate-950 text-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Built for speed and results</h2>
        <p className="mt-3 text-white/70 max-w-2xl">Three powerful tools in a single dashboard, backed by cloud processing and smart defaults.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition">
              <Icon className="w-6 h-6 text-white" />
              <h3 className="mt-4 font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-white/70 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
