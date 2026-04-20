import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    searches: "100 searches/month",
    highlight: false,
    link: "https://markearn.lemonsqueezy.com/checkout/buy/c6882729-f43c-4455-a9be-f9df7199b648",
    features: [
      "100 searches/month",
      "POD Decision tool",
      "Keyword Research",
      "Tag Generator",
      "POD Research Hub",
      "Trend Analyzer",
      "1-day free trial",
    ],
  },
  {
    name: "Pro",
    price: "$39",
    period: "/month",
    searches: "500 searches/month",
    highlight: true,
    link: "https://markearn.lemonsqueezy.com/checkout/buy/2f0e0ecc-963d-4241-8105-9571bc559365",
    features: [
      "500 searches/month",
      "Everything in Starter",
      "✏️ What to design/avoid",
      "POD Verdict detailed",
      "Exact competition scores",
      "All 10 related keywords",
      "Priority support",
      "1-day free trial",
    ],
  },
  {
    name: "Agency",
    price: "$79",
    period: "/month",
    searches: "Unlimited searches",
    highlight: false,
    link: "https://markearn.lemonsqueezy.com/checkout/buy/4828262b-b483-400c-8a2c-797870523490",
    features: [
      "Unlimited searches",
      "Everything in Pro",
      "Up to 10 Etsy stores",
      "Multi-store dashboard",
      "Consolidated analytics",
      "Priority support",
      "1-day free trial",
    ],
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-[#0f1623] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pr { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
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
            1-day free trial — no credit card required
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", marginBottom: 12 }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: 16, color: "#475569", marginBottom: 60 }}>
            Try free for 24 hours. No credit card required. Cancel anytime.
          </p>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
            {plans.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)",
                border: plan.highlight ? "2px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "32px 28px", position: "relative", transition: "all 0.15s"
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#6366f1", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap" }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>{plan.name}</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#334155" }}>{plan.searches}</p>
                </div>

                <ul style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#94a3b8" }}>
                      <span style={{ color: "#6366f1", flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href={plan.link} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "block", textAlign: "center", padding: "13px 20px", borderRadius: 12,
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

          <div className="max-w-xl mx-auto mt-12" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 16, padding: "20px 24px" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>🎯 Not sure which plan?</p>
            <p style={{ fontSize: 13, color: "#475569" }}>Start with the 1-day free trial — no card needed. Most sellers go Pro after seeing the POD Verdict in action.</p>
          </div>

          <div className="mt-12">
            <p style={{ fontSize: 13, color: "#334155" }}>
              Questions? Contact us at{" "}
              <a href="mailto:support@markearn.com" style={{ color: "#6366f1" }}>support@markearn.com</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}