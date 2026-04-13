import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0f1623] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .lp { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .pulse { animation: pulse-dot 2s ease infinite; }
        .float { animation: float 4s ease infinite; }
      `}</style>

      <div className="lp">
        {/* Background */}
        <div className="fixed inset-0 z-0 pointer-events-none"
          style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full -top-32 -right-32"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full -bottom-20 -left-20"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }} />
        </div>

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-12 py-5 border-b border-white/[0.06]"
          style={{ background: "rgba(15,22,35,0.8)", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.03em" }}>
            Rank<span style={{ color: "#818cf8" }}>ify</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/pricing" style={{ fontSize: 14, color: "#475569" }} className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/sign-in" style={{ fontSize: 14, color: "#475569" }} className="hover:text-white transition-colors">Sign in</Link>
            <Link href="/sign-up"
              style={{ background: "#6366f1", color: "#fff", fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 10, textDecoration: "none", transition: "all 0.15s" }}
              className="hover:opacity-88">
              Start Free →
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-10 px-5 py-2 rounded-full"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 13, color: "#a5b4fc" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 pulse" style={{ flexShrink: 0 }} />
            2,847 POD sellers making decisions right now
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
            Stop designing blind.<br />
            <span style={{ color: "#818cf8" }}>Sell what buyers</span> are already<br />
            searching for.
          </h1>

          <p style={{ fontSize: 18, color: "#475569", maxWidth: 520, lineHeight: 1.7, marginBottom: 40, fontWeight: 400 }}>
            Rankify analyzes real market data and tells you exactly <strong style={{ color: "#cbd5e1", fontWeight: 600 }}>what to design, what to avoid</strong> — before you spend hours creating.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 mb-16">
            <Link href="/sign-up"
              style={{ background: "#6366f1", color: "#fff", fontSize: 15, fontWeight: 700, padding: "14px 32px", borderRadius: 12, textDecoration: "none", transition: "all 0.15s", boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}
              className="hover:opacity-90">
              Start Free Trial →
            </Link>
            <Link href="/pricing"
              style={{ color: "#475569", fontSize: 14, fontWeight: 500, padding: "14px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none", transition: "all 0.15s" }}
              className="hover:text-white hover:border-white/20">
              See pricing
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-10 mb-20">
            {[
              { value: "12,400+", label: "Active sellers" },
              { value: "2.8M", label: "Products analyzed" },
              { value: "$4.2M", label: "Revenue generated" },
              { value: "4.9★", label: "Average rating" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-10">
                <div className="flex flex-col items-center">
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>{item.value}</span>
                  <span style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>{item.label}</span>
                </div>
                {i < 3 && <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.06)" }} />}
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="relative w-full max-w-4xl float">
            <div className="absolute -inset-1 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))", filter: "blur(8px)" }} />
            <div className="relative rounded-2xl overflow-hidden" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>

              {/* Browser bar */}
              <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0f1623", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#28ca41" }} />
                <div className="flex-1 mx-4 py-1 px-4 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#475569" }}>
                  rankify.io/dashboard
                </div>
              </div>

              {/* Dashboard content */}
              <div className="grid p-5 gap-4" style={{ gridTemplateColumns: "200px 1fr" }}>

                {/* Sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 8px", marginBottom: 4 }}>TOOLS</div>
                  {[
                    { emoji: "🎯", label: "POD Decision", active: true },
                    { emoji: "📊", label: "Competition", active: false },
                    { emoji: "📈", label: "Trends", active: false },
                    { emoji: "🏷️", label: "Tag Generator", active: false },
                    { emoji: "🎨", label: "POD Research", active: false, badge: "NEW" },
                  ].map((item) => (
                    <div key={item.label} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10,
                      background: item.active ? "rgba(129,140,248,0.12)" : "transparent",
                      border: item.active ? "1px solid rgba(129,140,248,0.25)" : "1px solid transparent",
                      color: item.active ? "#a5b4fc" : "#475569", fontSize: 13, fontWeight: 500
                    }}>
                      <span style={{ fontSize: 14 }}>{item.emoji}</span>
                      <span>{item.label}</span>
                      {item.badge && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "rgba(251,146,60,0.18)", color: "#fb923c" }}>{item.badge}</span>}
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>Stop designing blind.</div>

                  {/* Verdict card */}
                  <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#34d399", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>POD VERDICT · "dog mom shirt"</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#34d399", marginBottom: 12 }}>✅ Great POD Opportunity</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {["Solid demand and growing — active buyers", "Low competition with the right angle", "Highly personalizable niche"].map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What to design */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>✏️ What to design</div>
                      {["dog mom + breed specific", "Funny quotes + personalized", "dog mom + holiday event"].map((d, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>→ {d}</div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>🚫 What to avoid</div>
                      {["Generic dog designs", "No personalization", "Copying bestsellers"].map((d, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>✕ {d}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 px-12 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 12 }}>
              Everything you need to win on Etsy POD
            </h2>
            <p style={{ fontSize: 16, color: "#475569" }}>One tool. Clear decisions. More sales.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { emoji: "🎯", title: "POD Verdict", desc: "Get a clear decision for every niche — Great Opportunity, Possible, or Avoid. No more guessing." },
              { emoji: "📊", title: "Competition Analyzer", desc: "See exactly how hard a niche is to rank in, with strategy tips tailored to POD sellers." },
              { emoji: "📈", title: "Trend Analyzer", desc: "Know exactly when to upload designs for maximum seasonal sales. 12-month data." },
              { emoji: "🏷️", title: "Tag Generator", desc: "Generate 13 optimized Etsy tags ranked by search volume and competition score." },
              { emoji: "🎨", title: "POD Research Hub", desc: "Upload calendar, niche combinator, profit calculator — everything in one place." },
              { emoji: "⭐", title: "Listing Optimizer", desc: "Auto-generate SEO-optimized titles, descriptions and tags for your Etsy listings." },
            ].map((f, i) => (
              <div key={i} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 28px", transition: "border-color 0.15s" }}
                className="hover:border-indigo-500/30">
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* POD Platforms */}
        <section className="relative z-10 text-center px-12 py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 13, color: "#334155", marginBottom: 16, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>Works for all POD platforms</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Etsy", "Redbubble", "Merch by Amazon", "Teepublic", "Printify", "Printful", "Gelato", "Shopify"].map(p => (
              <span key={p} style={{ padding: "6px 16px", borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 13, color: "#475569" }}>
                {p}
              </span>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 py-28">
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 16, maxWidth: 560 }}>
            Ready to stop guessing and start selling?
          </h2>
          <p style={{ fontSize: 16, color: "#475569", marginBottom: 36, maxWidth: 440 }}>
            Join 12,400+ POD sellers who make data-driven decisions with Rankify.
          </p>
          <Link href="/sign-up"
            style={{ background: "#6366f1", color: "#fff", fontSize: 16, fontWeight: 700, padding: "16px 40px", borderRadius: 14, textDecoration: "none", boxShadow: "0 8px 32px rgba(99,102,241,0.35)", transition: "all 0.15s" }}
            className="hover:opacity-90">
            Start Free Trial — No Credit Card Required
          </Link>
          <p style={{ fontSize: 13, color: "#334155", marginTop: 14 }}>1-day free trial · Cancel anytime · 3 plans from $19/mo</p>
        </section>

        {/* Footer */}
        <footer className="relative z-10 flex items-center justify-between px-12 py-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.03em" }}>
            Rank<span style={{ color: "#818cf8" }}>ify</span>
          </div>
          <div className="flex gap-8">
            <Link href="/pricing" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }} className="hover:text-white transition-colors">Pricing</Link>
            <a href="mailto:yasserelkachabi@gmail.com" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }} className="hover:text-white transition-colors">Contact</a>
          </div>
          <p style={{ fontSize: 12, color: "#1e293b" }}>© 2026 Rankify. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}