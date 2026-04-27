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
            Mark<span style={{ color: "#818cf8" }}>earn</span>
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

        {/* HERO */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-10 px-5 py-2 rounded-full"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 13, color: "#a5b4fc" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 pulse" style={{ flexShrink: 0 }} />
            Decision first. Design later.
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 24, maxWidth: 820 }}>
            Decide what to sell<br />
            before you waste time<br />
            <span style={{ color: "#818cf8" }}>designing.</span>
          </h1>

          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 560, lineHeight: 1.7, marginBottom: 40, fontWeight: 400 }}>
            Markearn gives POD sellers a clear <strong style={{ color: "#34d399", fontWeight: 700 }}>GO</strong> or <strong style={{ color: "#f87171", fontWeight: 700 }}>AVOID</strong> verdict on any niche — in seconds. No more guessing. No more wasted designs.
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

          <p style={{ fontSize: 13, color: "#475569", marginBottom: 60 }}>
            1-day free trial · No credit card required · Cancel anytime
          </p>

          {/* DASHBOARD PREVIEW */}
          <div className="relative w-full max-w-4xl float">
            <div className="absolute -inset-1 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))", filter: "blur(8px)" }} />
            <div className="relative rounded-2xl overflow-hidden" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>

              <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0f1623", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#28ca41" }} />
                <div className="flex-1 mx-4 py-1 px-4 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#475569" }}>
                  markearn.com/dashboard
                </div>
              </div>

              <div className="grid p-5 gap-4" style={{ gridTemplateColumns: "200px 1fr" }}>
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

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>"halloween cat shirt"</div>

                  <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#34d399", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>POD VERDICT</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#34d399", marginBottom: 4 }}>✅ GO — Great Opportunity</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Solid demand · Manageable competition · Easy to differentiate</div>
                    </div>
                    <div style={{ textAlign: "center", paddingLeft: 16, borderLeft: "1px solid rgba(52,211,153,0.2)" }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>78</div>
                      <div style={{ fontSize: 9, color: "#34d399", opacity: 0.7, fontWeight: 700, letterSpacing: "0.1em", marginTop: 4 }}>SCORE / 100</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>✏️ What to design</div>
                      {["Vintage retro 70s aesthetic", "Witch hat + arched cat silhouette", "Distressed grunge texture"].map((d, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>→ {d}</div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>🚫 What to avoid</div>
                      {["Generic clip-art cats", "No personalization angle", "Copying bestsellers"].map((d, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>✕ {d}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="relative z-10 px-12 py-24 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>The Problem</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 16, maxWidth: 720, margin: "0 auto 16px" }}>
              Most POD sellers waste hours designing for niches that will never sell.
            </h2>
            <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              You spend an evening designing. You upload to Etsy. You wait. Nothing happens. Why? The niche was already saturated, declining, or simply too generic to rank.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { stat: "73%", label: "of new POD listings get zero sales in their first 90 days" },
              { stat: "12hrs", label: "average time wasted designing for a niche that won't sell" },
              { stat: "5x", label: "harder to rank in saturated niches without sub-niching" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#f87171", letterSpacing: "-0.02em", marginBottom: 8 }}>{item.stat}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section className="relative z-10 px-12 py-24 max-w-5xl mx-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-center mb-16">
            <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>The Solution</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 16, maxWidth: 720, margin: "0 auto 16px" }}>
              Get a clear verdict in 10 seconds.
            </h2>
            <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              Less data. Better decisions. Markearn analyzes real market signals and gives you one of three answers — so you can stop second-guessing and start selling.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { emoji: "✅", verdict: "GO", color: "#34d399", bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.2)", desc: "Demand is solid. Competition is manageable. You can rank with the right angle. Design with confidence." },
              { emoji: "⚠️", verdict: "POSSIBLE", color: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", desc: "Workable, but only with the right strategy. Markearn tells you exactly how to niche down." },
              { emoji: "🚫", verdict: "AVOID", color: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)", desc: "Saturated, declining, or too generic. Save your time. Markearn suggests better alternatives." },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{item.emoji}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: item.color, letterSpacing: "0.05em", marginBottom: 12 }}>{item.verdict}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative z-10 px-12 py-24 max-w-5xl mx-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-center mb-16">
            <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 16 }}>
              Three steps. Zero guesswork.
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { num: "01", title: "Type a niche", desc: 'Enter any niche idea — "halloween cat shirt", "boy mom era", "matcha lover mug".' },
              { num: "02", title: "Get the verdict", desc: "Markearn returns a clear GO, POSSIBLE, or AVOID — with a score from 0 to 100." },
              { num: "03", title: "Design with clarity", desc: "Know exactly what to design, what to avoid, and where the opportunity is." },
            ].map((step, i) => (
              <div key={i}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", marginBottom: 14 }}>{step.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY MARKEARN */}
        <section className="relative z-10 px-12 py-24 max-w-5xl mx-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 16, maxWidth: 720, margin: "0 auto 16px" }}>
              Built for sellers, not analysts.
            </h2>
            <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Other tools throw graphs at you and leave you to figure it out. Markearn tells you what to do next.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              { title: "Decision-first design", desc: "We don't just show data. We give you a verdict you can act on." },
              { title: "10-second clarity", desc: "Type a niche. Get the answer. Move on. No deep analysis required." },
              { title: "Designed for POD", desc: "Built specifically for print-on-demand sellers — not Amazon FBA, not dropshipping." },
              { title: "Less is more", desc: "We hide the noise. We surface what matters. Every screen serves one purpose." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "22px 24px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
{/* PRICING TEASER */}
        <section className="relative z-10 px-12 py-24 max-w-5xl mx-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-center mb-12">
            <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Simple Pricing</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 14 }}>
              Two plans. No surprises.
            </h2>
            <p style={{ fontSize: 16, color: "#94a3b8" }}>1-day free trial · No credit card required · Cancel anytime</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* STARTER */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "32px 28px",
              textAlign: "left"
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.07em", textTransform: "uppercase" }}>Starter</p>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 18 }}>For sellers testing the waters</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1 }}>$19</span>
                <span style={{ fontSize: 14, color: "#475569", marginBottom: 6 }}>/month</span>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 22 }}>100 niche decisions per month</p>
              
              <ul style={{ marginBottom: 26, display: "flex", flexDirection: "column", gap: 8 }}>
                {["GO / POSSIBLE / AVOID verdict", "POD Score 0-100", "Strategy tips per niche", "Trend & Tag tools"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#cbd5e1" }}>
                    <span style={{ color: "#6366f1", flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/pricing"
                style={{
                  display: "block", textAlign: "center", padding: "12px 20px", borderRadius: 12,
                  background: "rgba(99,102,241,0.1)",
                  color: "#818cf8",
                  border: "1px solid rgba(99,102,241,0.2)",
                  fontSize: 14, fontWeight: 700, textDecoration: "none"
                }}>
                Start with Starter
              </Link>
            </div>

            {/* PRO */}
            <div style={{
              background: "rgba(99,102,241,0.08)",
              border: "2px solid rgba(99,102,241,0.4)",
              borderRadius: 20,
              padding: "32px 28px",
              position: "relative",
              textAlign: "left"
            }}>
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#6366f1", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 18px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.05em" }}>
                MOST POPULAR
              </div>
              
              <p style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", marginBottom: 6, letterSpacing: "0.07em", textTransform: "uppercase" }}>Pro</p>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 18 }}>For serious POD sellers</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1 }}>$39</span>
                <span style={{ fontSize: 14, color: "#475569", marginBottom: 6 }}>/month</span>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 22 }}>500 niche decisions per month</p>
              
              <ul style={{ marginBottom: 26, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Everything in Starter", "✏️ What to design / What to avoid", "🎨 Smart Design Brief (Midjourney prompts)", "Better alternatives + all 10 keywords", "Listing Optimizer + Sales Estimator"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#cbd5e1" }}>
                    <span style={{ color: "#a5b4fc", flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/pricing"
                style={{
                  display: "block", textAlign: "center", padding: "12px 20px", borderRadius: 12,
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  fontSize: 14, fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.35)"
                }}>
                Start with Pro →
              </Link>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/pricing" style={{ fontSize: 13, color: "#64748b", textDecoration: "underline" }} className="hover:text-white transition-colors">
              See full plan comparison →
            </Link>
          </div>
        </section>
        {/* CTA */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 py-28" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 16, maxWidth: 600 }}>
            Stop guessing. Start deciding.
          </h2>
          <p style={{ fontSize: 17, color: "#94a3b8", marginBottom: 36, maxWidth: 520, lineHeight: 1.7 }}>
            Try Markearn free for 24 hours. Decide what to sell before you waste another evening designing.
          </p>
          <Link href="/sign-up"
            style={{ background: "#6366f1", color: "#fff", fontSize: 16, fontWeight: 700, padding: "16px 40px", borderRadius: 14, textDecoration: "none", boxShadow: "0 8px 32px rgba(99,102,241,0.35)", transition: "all 0.15s" }}
            className="hover:opacity-90">
            Start Free Trial →
          </Link>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 16 }}>
            No credit card required · Cancel anytime
          </p>
        </section>

        {/* Footer */}
        <footer className="relative z-10 flex items-center justify-between px-12 py-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.03em" }}>
            Mark<span style={{ color: "#818cf8" }}>earn</span>
          </div>
          <div className="flex gap-8">
            <Link href="/pricing" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }} className="hover:text-white transition-colors">Pricing</Link>
            <a href="mailto:support@markearn.com" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }} className="hover:text-white transition-colors">Contact</a>
          </div>
          <p style={{ fontSize: 12, color: "#1e293b" }}>© 2026 Markearn. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}