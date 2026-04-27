import Link from "next/link";

const plans = [
  {
    name: "Starter",
    tagline: "For sellers testing the waters",
    price: "$19",
    period: "/month",
    searches: "100 decisions per month",
    highlight: false,
    link: "https://markearn.lemonsqueezy.com/checkout/buy/c6882729-f43c-4455-a9be-f9df7199b648",
    description: "Perfect if you're starting out and want clarity before designing.",
    features: [
      "100 niche decisions per month",
      "GO / POSSIBLE / AVOID verdict",
      "POD Score 0-100",
      "Strategy tips per niche",
      "Trend analyzer",
      "Tag generator (13 tags)",
      "1-day free trial",
    ],
  },
  {
    name: "Pro",
    tagline: "For serious POD sellers",
    price: "$39",
    period: "/month",
    searches: "500 decisions per month",
    highlight: true,
    link: "https://markearn.lemonsqueezy.com/checkout/buy/2f0e0ecc-963d-4241-8105-9571bc559365",
    description: "Everything in Starter, plus the tools that turn decisions into designs.",
    features: [
      "500 niche decisions per month",
      "Everything in Starter",
      "✏️ What to design / What to avoid",
      "🎨 Smart Design Brief (Midjourney prompts)",
      "Better alternatives when saturated",
      "Exact competition scores",
      "All 10 related keywords",
      "Listing Optimizer",
      "Sales Estimator",
      "POD Research Hub",
      "Priority support",
    ],
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-[#0f1623] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pr { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div className="pr">
        <div className="fixed inset-0 z-0 pointer-events-none"
          style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />

        <nav className="relative z-10 flex items-center justify-between px-12 py-5 border-b border-white/[0.06]"
          style={{ background: "rgba(15,22,35,0.8)", backdropFilter: "blur(12px)" }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.03em", textDecoration: "none" }}>
            Mark<span style={{ color: "#818cf8" }}>earn</span>
          </Link>
          <Link href="/sign-up"
            style={{ background: "#6366f1", color: "#fff", fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 10, textDecoration: "none" }}>
            Start Free →
          </Link>
        </nav>

        <section className="relative z-10 text-center pt-20 pb-16 px-6">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 13, color: "#a5b4fc" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", animation: "pulse 2s infinite" }} />
            1-day free trial · No credit card required
          </div>

          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 14, maxWidth: 640, margin: "0 auto 14px" }}>
            Pick the plan that fits your stage.
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", marginBottom: 60, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            Both plans include the GO / AVOID verdict system. Pro adds the tools you need to turn decisions into bestselling designs.
          </p>

          {/* PRICING CARDS */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
            {plans.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)",
                border: plan.highlight ? "2px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "36px 32px",
                position: "relative",
                transition: "all 0.15s",
                textAlign: "left"
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#6366f1", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 18px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.05em" }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: plan.highlight ? "#a5b4fc" : "#94a3b8", marginBottom: 6, letterSpacing: "0.07em", textTransform: "uppercase" }}>{plan.name}</p>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{plan.tagline}</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 48, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>{plan.searches}</p>
                </div>

                <p style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 24, lineHeight: 1.6, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                  {plan.description}
                </p>

                <ul style={{ marginBottom: 30, display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#cbd5e1" }}>
                      <span style={{ color: plan.highlight ? "#a5b4fc" : "#6366f1", flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href={plan.link} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "block", textAlign: "center", padding: "14px 20px", borderRadius: 12,
                    background: plan.highlight ? "#6366f1" : "rgba(99,102,241,0.1)",
                    color: plan.highlight ? "#fff" : "#818cf8",
                    border: plan.highlight ? "none" : "1px solid rgba(99,102,241,0.2)",
                    fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.15s",
                    boxShadow: plan.highlight ? "0 8px 24px rgba(99,102,241,0.35)" : "none"
                  }}>
                  Start Free Trial →
                </a>
              </div>
            ))}
          </div>

          {/* SOCIAL PROOF / WHY UPGRADE */}
          <div className="max-w-2xl mx-auto mt-16" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 16, padding: "24px 28px", textAlign: "left" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#a5b4fc", marginBottom: 8, letterSpacing: "0.05em" }}>💡 Why most sellers go Pro</p>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>
              The verdict tells you <strong style={{ color: "#34d399" }}>if</strong> a niche is worth it. The Pro tools tell you <strong style={{ color: "#a5b4fc" }}>how</strong> to actually win it — what to design, what to avoid, and the exact prompts to use. That's where time saved becomes money earned.
            </p>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mt-16" style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 24, textAlign: "center" }}>Common Questions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { q: "What counts as a 'decision'?", a: "Every time you analyze a niche, that's one decision. You can re-check old searches without using credits." },
                { q: "Can I switch plans later?", a: "Yes, anytime. Upgrade, downgrade, or cancel from your account settings." },
                { q: "Do you offer refunds?", a: "If Markearn doesn't help you within the first 7 days, email us. No questions asked." },
                { q: "Which platforms does it work for?", a: "Etsy, Redbubble, TeePublic, Amazon Merch, and other major POD platforms." },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 22px" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{item.q}</p>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <p style={{ fontSize: 13, color: "#475569" }}>
              Questions? Reach us at{" "}
              <a href="mailto:support@markearn.com" style={{ color: "#6366f1" }}>support@markearn.com</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}