import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0812] text-white overflow-x-hidden">

      {/* Background grid */}
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Background glow blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full -top-48 -right-24 animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(108,59,255,0.22) 0%, transparent 70%)" }}
        />
        <div className="absolute w-[500px] h-[500px] rounded-full -bottom-24 -left-24"
          style={{ background: "radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)" }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-5 border-b border-purple-900/30 backdrop-blur-md bg-[#0a0812]/60">
        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Rankify
        </span>
        <div className="flex items-center gap-8">
          <span className="text-sm text-purple-200/60 hover:text-white cursor-pointer transition-colors">Features</span>
          <span className="text-sm text-purple-200/60 hover:text-white cursor-pointer transition-colors">Pricing</span>
          <Link href="/login"
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-[0_0_24px_rgba(108,59,255,0.4)] hover:shadow-[0_0_36px_rgba(108,59,255,0.6)] hover:-translate-y-0.5">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-5 flex flex-col items-center text-center px-6 pt-20 pb-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-5 py-2 text-sm text-purple-300 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          The #1 Product Research Tool for Etsy Sellers
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          <span className="text-white">Find Winning Products.</span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Sell Anywhere.
          </span>
        </h1>

        <p className="text-lg text-purple-200/60 max-w-xl leading-relaxed mb-12 font-light">
          Real data. Zero guesswork. Discover high-demand, low-competition products
          for Etsy, Amazon, Redbubble and more — before everyone else does.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 mb-14">
          <Link href="/login"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-500 text-white px-8 py-4 rounded-full font-medium text-base transition-all shadow-[0_8px_32px_rgba(108,59,255,0.45)] hover:shadow-[0_16px_48px_rgba(108,59,255,0.6)] hover:-translate-y-0.5">
            ★ Start for Free
          </Link>
          <button className="flex items-center gap-2 text-purple-200/60 border border-white/10 px-7 py-4 rounded-full text-base transition-all hover:text-white hover:border-purple-500/40 hover:bg-purple-500/06">
            ▶ Watch Demo
          </button>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-8 mb-14">
          {[
            { value: "12,400+", label: "Active sellers" },
            { value: "2.8M", label: "Products analyzed" },
            { value: "$4.2M", label: "Revenue generated" },
            { value: "4.9★", label: "Average rating" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white">{item.value}</span>
                <span className="text-xs text-purple-200/50 mt-1">{item.label}</span>
              </div>
              {i < 3 && <div className="w-px h-9 bg-white/08" />}
            </div>
          ))}
        </div>

        {/* Platform chips */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-16">
          {["Etsy", "Amazon", "Redbubble", "Shopify", "Teepublic", "eBay", "Merch by Amazon", "Bubble"].map((p) => (
            <span key={p}
              className="bg-white/04 border border-purple-500/18 rounded-full px-5 py-1.5 text-sm text-purple-200/50 hover:border-purple-400 hover:text-white transition-all cursor-default">
              {p}
            </span>
          ))}
        </div>

        {/* Dashboard preview */}
        <div className="relative w-full max-w-4xl">
          {/* Glow border */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600/50 via-fuchsia-500/30 to-purple-600/50 blur-sm" />

          <div className="relative bg-[#120d24]/95 border border-purple-500/25 rounded-2xl overflow-hidden backdrop-blur-xl">

            {/* Topbar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-purple-500/12 bg-white/02">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
              <div className="flex-1 mx-3 bg-white/05 border border-white/06 rounded-md py-1 px-3 text-xs text-purple-300/50 text-center">
                rankify-omega.vercel.app/dashboard
              </div>
            </div>

            {/* Dashboard body */}
            <div className="grid grid-cols-[200px_1fr] gap-4 p-5 min-h-[320px]">

              {/* Sidebar */}
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-purple-300/30 uppercase tracking-widest px-3 py-2">Tools</p>
                {[
                  { icon: "🏆", label: "Winning Products", active: true },
                  { icon: "🔍", label: "Keyword Research", active: false },
                  { icon: "📦", label: "Product Analyzer", active: false },
                  { icon: "🏷️", label: "Tag Generator", active: false },
                  { icon: "📈", label: "Trend Graph", active: false },
                ].map((item) => (
                  <div key={item.label}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer
                      ${item.active
                        ? "bg-purple-600/20 text-purple-300 border border-purple-600/25"
                        : "text-purple-300/50 hover:bg-purple-500/08 hover:text-white"}`}>
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex flex-col gap-3">

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: "1,247", label: "Products tracked", change: "↑ +12% this week" },
                    { value: "89k", label: "Avg monthly searches", change: "↑ High demand" },
                    { value: "34", label: "Low competition niches", change: "↑ New today" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/03 border border-purple-500/10 rounded-xl p-3">
                      <div className="text-xl font-bold text-white">{s.value}</div>
                      <div className="text-[11px] text-purple-300/50 mt-0.5">{s.label}</div>
                      <div className="text-[11px] text-emerald-400 mt-1">{s.change}</div>
                    </div>
                  ))}
                </div>

                <div className="text-sm font-bold text-white">Winning Products — Today</div>

                {/* Product grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { name: "Personalized Dog Portrait", badge: "Hot", badgeColor: "text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-500/30", searches: "48.2k", price: "$32", score: 91 },
                    { name: "Minimalist Birth Poster", badge: "Rising", badgeColor: "text-emerald-300 bg-emerald-500/12 border-emerald-500/20", searches: "29.7k", price: "$24", score: 78 },
                    { name: "Custom Wedding Invitation", badge: "New", badgeColor: "text-amber-300 bg-amber-500/12 border-amber-500/20", searches: "61.4k", price: "$18", score: 85 },
                    { name: "Retro Vintage Font Bundle", badge: "Rising", badgeColor: "text-emerald-300 bg-emerald-500/12 border-emerald-500/20", searches: "19.3k", price: "$12", score: 72 },
                  ].map((p) => (
                    <div key={p.name} className="bg-white/03 border border-purple-500/12 rounded-xl p-3 hover:border-purple-400/35 hover:bg-purple-500/06 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2.5">
                        <span className="text-xs font-medium text-white leading-snug">{p.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ml-2 shrink-0 ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      </div>
                      <div className="flex gap-3 mb-2">
                        <div>
                          <div className="text-sm font-bold text-white">{p.searches}</div>
                          <div className="text-[10px] text-purple-300/50">Searches/mo</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{p.price}</div>
                          <div className="text-[10px] text-purple-300/50">Avg price</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/06 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 rounded-full"
                            style={{ width: `${p.score}%` }} />
                        </div>
                        <span className="text-[11px] text-purple-400 font-semibold">{p.score}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}