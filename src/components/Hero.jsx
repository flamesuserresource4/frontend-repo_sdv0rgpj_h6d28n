import Spline from '@splinetool/react-spline';
import { Play, Upload } from 'lucide-react';

export default function Hero() {
  const handleScroll = () => {
    const el = document.getElementById('dashboard');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center">
      {/* Spline cover background */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Gradient and vignette overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(236,72,153,0.25),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            AI Driven Video Enhancement
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight text-white">
            Create sharper, faster content with AI automation
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-white/80">
            Voice-synced captions, viral moment detection, and Minecraft story generation — all in one streamlined workspace.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={handleScroll} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-slate-900 px-5 py-3 font-semibold shadow hover:shadow-lg transition">
              <Upload className="w-4 h-4" /> Try with your clip
            </button>
            <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 text-white px-5 py-3 font-semibold border border-white/15 hover:bg-white/15 transition">
              <Play className="w-4 h-4" /> See what it does
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 text-sm text-white/70 max-w-xl">
            <div>
              <p className="font-semibold text-white">Voice Synced Word Display</p>
              <p className="text-white/70">Word-level timing, editable captions, kinetic text export.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Viral Moment Detection</p>
              <p className="text-white/70">Auto-cut highlights optimized for short formats.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Minecraft Story Generation</p>
              <p className="text-white/70">Analyze gameplay and generate voiceover-ready stories.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Cloud Processing</p>
              <p className="text-white/70">Fast, privacy-safe processing with timed auto deletion.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
