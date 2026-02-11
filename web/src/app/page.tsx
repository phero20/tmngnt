export default function Home() {
  return (
    <main className="min-h-screen relative bg-black selection:bg-primary selection:text-white overflow-hidden">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent opacity-30 blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Eyebrow */}
        <span className="text-primary text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6 animate-fade-in-up hover:text-white transition-colors duration-300 cursor-default">
          The Ultimate Escape
        </span>

        {/* Main Heading */}
        <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tight mb-8 leading-tight max-w-6xl mx-auto">
          UNFORGETTABLE
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-transparent italic font-light">
            Luxury.
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-xl mx-auto text-neutral-400 text-sm md:text-base leading-relaxed mb-12 tracking-wide">
          Experience the pinnacle of modern hospitality. Where silence meets
          design, and every detail is curated for your absolute comfort.
        </p>

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <button className="group relative px-8 py-4 bg-primary text-white text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 shadow-[0_0_40px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.6)]">
            Book Your Stay
          </button>

          <button className="px-8 py-4 bg-transparent border border-white/10 text-white text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white/5 hover:border-white/30 hover:text-primary">
            Explore Rooms
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </main>
  );
}
