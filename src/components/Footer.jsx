export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">© 2025 AIVid. Privacy-safe processing with timed auto deletion.</p>
        <div className="flex items-center gap-4 text-sm">
          <a href="/test" className="hover:text-white">System Status</a>
          <a href="#" className="hover:text-white">API Docs</a>
          <a href="#" className="hover:text-white">Security</a>
        </div>
      </div>
    </footer>
  )
}
