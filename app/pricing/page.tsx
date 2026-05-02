"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    tagline: "For sellers testing the waters",
    price: "$19",
    period: "/month",
    searches: "100 decisions per month",
    highlight: false,
    link: "https://markearn.lemonsqueezy.com/checkout/buy/71b5383a-64f7-4c69-89f6-c983760b36e3",
    description:
      "Perfect if you're starting out and want clarity before designing.",
    features: [
      "100 niche decisions per month",
      "GO / POSSIBLE / AVOID verdict",
      "POD Score 0–100",
      "Strategy tips per niche",
      "Trend analyzer",
      "Tag generator (13 tags)",
      "7-day free trial · 5 verdicts free",
    ],
  },
  {
    name: "Pro",
    tagline: "For serious POD sellers",
    price: "$39",
    period: "/month",
    searches: "500 decisions per month",
    highlight: true,
    link: "https://markearn.lemonsqueezy.com/checkout/buy/bc3251e7-159c-40f7-875c-876ab776e4ab",
    description:
      "Everything in Starter, plus the tools that turn decisions into designs.",
    features: [
      "500 niche decisions per month",
      "Everything in Starter",
      "What to design / What to avoid",
      "Smart Design Brief (Midjourney prompts)",
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

const faqs = [
  {
    q: "What counts as a 'decision'?",
    a: "Every time you analyze a niche, that's one decision. You can re-check old searches without using credits.",
  },
  {
    q: "How does the free trial work?",
    a: "You get 7 days and 5 free verdicts to try Markearn — whichever comes first. No credit card required. Upgrade only when you're ready.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, anytime. Upgrade, downgrade, or cancel from your account settings. Changes take effect immediately.",
  },
  {
    q: "Which platforms does it work for?",
    a: "Etsy, Redbubble, TeePublic, Amazon Merch, Society6, Spreadshirt, Zazzle, and other major POD platforms. The verdicts apply to any platform.",
  },
  {
    q: "What happens if I hit my monthly limit?",
    a: "You'll be notified before reaching the limit. You can upgrade to Pro instantly, or wait for next month's reset. No surprise charges.",
  },
  {
    q: "Do you offer refunds?",
    a: "If Markearn doesn't help you within the first 7 days of paid subscription, email us. No questions asked.",
  },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08090d] text-white antialiased">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@300;400;500;600;700;800&display=swap");

        html { scroll-behavior: smooth; }
        body { font-family: "Inter", system-ui, sans-serif; background: #08090d; }

        .serif {
          font-family: "Instrument Serif", serif;
          font-style: italic;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #94a3b8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gradient-accent {
          background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .glow-border { position: relative; }
        .glow-border::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.4), rgba(244, 114, 182, 0.2), rgba(251, 146, 60, 0.4));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        @keyframes meshFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes meshFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.1); }
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .mesh-1 { animation: meshFloat 20s ease-in-out infinite; }
        .mesh-2 { animation: meshFloat2 25s ease-in-out infinite; }
        .verdict-pulse { animation: pulseSoft 2.5s ease-in-out infinite; }

        .hover-lift { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(167, 139, 250, 0.3); }

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          mix-blend-mode: overlay;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="mesh-1 absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(167,139,250,0) 70%)", filter: "blur(60px)" }} />
        <div className="mesh-2 absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(244,114,182,0) 70%)", filter: "blur(80px)" }} />
        <div className="mesh-1 absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,0.4) 0%, rgba(251,146,60,0) 70%)", filter: "blur(70px)", animationDelay: "10s" }} />
        <div className="noise-overlay" />
      </div>

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 flex items-center justify-between px-8 lg:px-16 py-6 border-b border-white/[0.04]"
        style={{ background: "rgba(8, 9, 13, 0.6)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)" }}>
            <span className="text-white font-bold text-lg leading-none">M</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Mark<span className="font-normal text-white/60">earn</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="/#how" className="hover:text-white transition">How it works</Link>
          <Link href="/#proof" className="hover:text-white transition">Why it works</Link>
          <Link href="/pricing" className="text-white">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden md:block text-sm text-white/60 hover:text-white transition">Sign in</Link>
          <Link href="/sign-up"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition relative overflow-hidden group">
            <span className="relative z-10">Start free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-pink-200 opacity-0 group-hover:opacity-100 transition" />
          </Link>
        </div>
      </motion.nav>

      <section className="relative z-10 px-6 lg:px-16 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-10">
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs text-white/70">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 verdict-pulse" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span>7-day free trial · 5 verdicts free · No credit card</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.95] mb-8">
            <span className="gradient-text">Simple pricing.</span>
            <br />
            <span className="serif gradient-accent text-6xl md:text-7xl lg:text-8xl">No surprises.</span>
          </motion.h1>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-20 leading-relaxed font-light">
            Both plans include the <span className="text-white font-medium">GO</span> / <span className="text-white font-medium">AVOID</span> verdict
            system. Pro adds the tools you need to turn decisions into bestselling designs.
          </motion.p>

          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 + i * 0.1 }}
                className={`relative rounded-2xl p-8 lg:p-10 hover-lift ${plan.highlight ? "glow-border glass" : "glass"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] text-white"
                      style={{ background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)" }}>
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <p className={`text-[11px] font-semibold tracking-[0.15em] uppercase mb-2 ${plan.highlight ? "gradient-accent" : "text-white/40"}`}>
                    {plan.name}
                  </p>
                  <p className="text-sm text-white/50 mb-6">{plan.tagline}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="serif text-6xl gradient-text leading-none">{plan.price}</span>
                    <span className="text-sm text-white/40">{plan.period}</span>
                  </div>
                  <p className="text-xs text-white/40">{plan.searches}</p>
                </div>

                <p className="text-sm text-white/70 mb-8 leading-relaxed p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                        style={{ background: plan.highlight ? "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)" : "rgba(255,255,255,0.08)" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <a href={plan.link} target="_blank" rel="noopener noreferrer"
                  className={`group block w-full text-center px-6 py-3.5 rounded-xl text-sm font-semibold tracking-tight transition-all relative overflow-hidden ${plan.highlight ? "bg-white text-black hover:bg-white/90" : "glass text-white hover:bg-white/[0.05]"}`}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Free Trial
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {plan.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-100 via-pink-100 to-orange-100 opacity-0 group-hover:opacity-100 transition" />
                  )}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-6 lg:px-16 py-16">
        <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
          <div className="glow-border rounded-2xl glass p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at top right, rgba(167,139,250,0.2) 0%, transparent 60%)" }} />
            <p className="text-[11px] uppercase tracking-[0.2em] gradient-accent font-semibold mb-3 relative">
              Why most sellers go Pro
            </p>
            <p className="text-base md:text-lg text-white/80 leading-relaxed relative">
              The verdict tells you <span className="serif text-emerald-300 text-xl">if</span> a niche
              is worth it. The Pro tools tell you <span className="serif gradient-accent text-xl">how</span> to
              actually win it — what to design, what to avoid, and the exact prompts to use. That's where time saved becomes designs that sell.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Common questions</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05]">
              <span className="gradient-text">Got questions?</span> <span className="serif gradient-accent">We have answers.</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }} className="glass rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition">
                  <span className="text-base font-medium text-white">{faq.q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full glass flex items-center justify-center transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="px-6 pb-5">
                    <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 lg:px-16 py-24">
        <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.9 }} className="max-w-4xl mx-auto">
          <div className="glow-border relative rounded-3xl glass overflow-hidden p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(167,139,250,0.3) 0%, transparent 70%)" }} />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] mb-6 relative">
              <span className="gradient-text">Still on the fence?</span> <span className="serif gradient-accent">Try it free.</span>
            </h2>
            <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto mb-10 relative">
              5 free verdicts. 7 days. No credit card. See if Markearn fits your workflow before paying anything.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Link href="/sign-up"
                className="group relative px-8 py-4 rounded-xl bg-white text-black text-sm font-semibold tracking-tight overflow-hidden hover-lift">
                <span className="relative z-10 flex items-center gap-2">
                  Get your first verdict
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
              <a href="mailto:support@markearn.com" className="text-sm text-white/60 hover:text-white transition">
                Questions? support@markearn.com
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 px-6 lg:px-16 py-12 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)" }}>
              <span className="text-white font-bold text-xs leading-none">M</span>
            </div>
            <span className="text-sm text-white/60">
              Mark<span className="text-white/30">earn</span> · © 2026
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            <a href="mailto:support@markearn.com" className="hover:text-white transition">support@markearn.com</a>
          </div>
        </div>
      </footer>
    </main>
  );
}