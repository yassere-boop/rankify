"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08090d] text-white antialiased">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@300;400;500;600;700;800&display=swap");

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: "Inter", system-ui, sans-serif;
          background: #08090d;
        }

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

        .glow-border {
          position: relative;
        }

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

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .shimmer-line {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(167, 139, 250, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .mesh-1 {
          animation: meshFloat 20s ease-in-out infinite;
        }
        .mesh-2 {
          animation: meshFloat2 25s ease-in-out infinite;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          mix-blend-mode: overlay;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
        }

        .marquee {
          animation: marquee 30s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .verdict-pulse {
          animation: pulseSoft 2.5s ease-in-out infinite;
        }

        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(167, 139, 250, 0.3);
        }
      `}</style>

      {/* ===== ANIMATED MESH BACKGROUND ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="mesh-1 absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(167,139,250,0) 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="mesh-2 absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(244,114,182,0) 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="mesh-1 absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(251,146,60,0.4) 0%, rgba(251,146,60,0) 70%)",
            filter: "blur(70px)",
            animationDelay: "10s",
          }}
        />
        <div className="noise-overlay" />
      </div>

      {/* ===== NAVIGATION ===== */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 flex items-center justify-between px-8 lg:px-16 py-6 border-b border-white/[0.04]"
        style={{
          background: "rgba(8, 9, 13, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)",
            }}
          >
            <span className="text-white font-bold text-lg leading-none">M</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Mark<span className="font-normal text-white/60">earn</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="#how" className="hover:text-white transition">
            How it works
          </Link>
          <Link href="#proof" className="hover:text-white transition">
            Why it works
          </Link>
          <Link href="/pricing" className="hover:text-white transition">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden md:block text-sm text-white/60 hover:text-white transition"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition relative overflow-hidden group"
          >
            <span className="relative z-10">Start free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-pink-200 opacity-0 group-hover:opacity-100 transition" />
          </Link>
        </div>
      </motion.nav>

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative z-10 px-6 lg:px-16 pt-24 pb-32">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-6xl mx-auto"
        >
          {/* Status pill */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-10"
          >
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs text-white/70">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 verdict-pulse" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span>Live · Built for POD sellers · No credit card</span>
            </div>
          </motion.div>

          {/* Hero headline */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-5xl md:text-7xl lg:text-[88px] font-bold tracking-[-0.04em] leading-[0.95] mb-8"
          >
            <span className="gradient-text">Stop designing</span>
            <br />
            <span className="serif gradient-accent text-6xl md:text-8xl lg:text-[110px]">
              in the dark.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            One answer. Zero noise. Markearn tells you{" "}
            <span className="text-white font-medium">GO</span> or{" "}
            <span className="text-white font-medium">AVOID</span> on any POD
            niche — in 10 seconds, before you waste hours on designs nobody
            wants.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link
              href="/sign-up"
              className="group relative px-7 py-3.5 rounded-xl bg-white text-black text-sm font-semibold tracking-tight overflow-hidden hover-lift"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get your first verdict
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  <path
                    d="M3 8h10m-4-4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-100 via-pink-100 to-orange-100 opacity-0 group-hover:opacity-100 transition" />
            </Link>

            <Link
              href="#how"
              className="text-sm text-white/60 hover:text-white transition flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-full glass flex items-center justify-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <path d="M2 1l6 4-6 4z" />
                </svg>
              </span>
              See how it works
            </Link>
          </motion.div>

          {/* ===== HERO PRODUCT MOCKUP ===== */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `perspective(2000px) rotateX(${
                mousePosition.y * 0.3
              }deg) rotateY(${mousePosition.x * 0.3}deg)`,
              transition: "transform 0.4s ease-out",
            }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Glow behind mockup */}
            <div
              className="absolute -inset-20 opacity-50 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(167,139,250,0.3) 0%, transparent 60%)",
                filter: "blur(40px)",
              }}
            />

            {/* The dashboard card */}
            <div className="glow-border relative rounded-2xl glass overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="text-[10px] font-mono text-white/30">
                  markearn.com/dashboard
                </div>
                <div className="w-10" />
              </div>

              {/* Dashboard content */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/40 font-medium">
                    Niche analyzed
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>Live data · 0.8s</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold mb-8 tracking-tight">
                  halloween cat shirt
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* GO verdict */}
                  <div className="md:col-span-1 relative rounded-xl p-6 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(52, 211, 153, 0.12) 0%, rgba(52, 211, 153, 0.04) 100%)",
                      border: "1px solid rgba(52, 211, 153, 0.2)",
                    }}
                  >
                    <div className="absolute top-3 right-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 verdict-pulse" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-400/80 font-medium mb-2">
                      Verdict
                    </p>
                    <p className="text-4xl font-bold text-emerald-300 tracking-tight">
                      GO
                    </p>
                    <p className="text-[11px] text-emerald-400/60 mt-1">
                      High confidence
                    </p>
                  </div>

                  {/* Score */}
                  <div className="rounded-xl p-6 bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium mb-2">
                      Score
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-4xl font-bold tracking-tight">78</p>
                      <p className="text-sm text-white/40">/100</p>
                    </div>
                    <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "78%" }}
                        transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #a78bfa 0%, #f472b6 100%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Time saved */}
                  <div className="rounded-xl p-6 bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium mb-2">
                      Time saved
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-4xl font-bold tracking-tight">3.5</p>
                      <p className="text-sm text-white/40">hours</p>
                    </div>
                    <p className="text-[11px] text-white/30 mt-1">vs manual research</p>
                  </div>
                </div>

                {/* Action */}
                <div className="rounded-xl p-5 bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(244,114,182,0.2))",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2 7l3 3 7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-white/40 font-medium mb-1">
                        Next action
                      </p>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Design a vintage-style black cat with witch hat. Upload
                        before <span className="text-white">Sept 15</span> to
                        catch peak demand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating mini cards */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="hidden lg:flex absolute -left-16 top-32 glass rounded-xl px-4 py-3 items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-300 text-xs font-bold">
                ✕
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Yesterday
                </p>
                <p className="text-xs font-medium">"unicorn coffee mom"</p>
                <p className="text-[10px] text-rose-300">AVOID · saturated</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              className="hidden lg:flex absolute -right-16 bottom-32 glass rounded-xl px-4 py-3 items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs font-bold">
                ✓
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Today
                </p>
                <p className="text-xs font-medium">"matcha mom era"</p>
                <p className="text-[10px] text-emerald-300">GO · trending</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== TRUST MARQUEE ===== */}
      <section className="relative z-10 py-12 border-y border-white/[0.04] overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-medium">
            Built for sellers on
          </p>
        </div>
        <div className="flex overflow-hidden">
          <div className="marquee flex items-center gap-16 whitespace-nowrap">
            {[
              "Etsy",
              "Redbubble",
              "TeePublic",
              "Amazon Merch",
              "Society6",
              "Spreadshirt",
              "Zazzle",
              "Etsy",
              "Redbubble",
              "TeePublic",
              "Amazon Merch",
              "Society6",
              "Spreadshirt",
              "Zazzle",
            ].map((p, i) => (
              <span
                key={i}
                className="text-2xl font-light text-white/20 tracking-tight"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section className="relative z-10 px-6 lg:px-16 py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">
              The problem
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
              <span className="gradient-text">You're guessing.</span>
              <br />
              <span className="serif gradient-accent text-5xl md:text-7xl">
                That's the whole problem.
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                stat: "73%",
                label: "of new POD sellers",
                detail: "make zero sales in their first 90 days",
              },
              {
                stat: "12h",
                label: "wasted per week",
                detail: "designing shirts that nobody will buy",
              },
              {
                stat: "5×",
                label: "harder to rank",
                detail: "in saturated niches you didn't see coming",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass rounded-2xl p-8 hover-lift"
              >
                <p className="serif text-6xl md:text-7xl gradient-accent mb-3">
                  {item.stat}
                </p>
                <p className="text-sm font-medium text-white/80 mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-white/40 leading-relaxed">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="relative z-10 px-6 lg:px-16 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">
              How it works
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] mb-6">
              <span className="gradient-text">Three steps.</span>{" "}
              <span className="serif gradient-accent">Ten seconds.</span>
            </h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              No setup. No connecting your store. No 47-tab dashboard.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                num: "01",
                title: "Type a niche",
                desc: "\"halloween cat shirt\". \"matcha mom era\". Whatever's on your mind.",
                visual: (
                  <div className="glass rounded-xl px-5 py-4 font-mono text-sm flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 verdict-pulse" />
                    <span className="text-white/60">→</span>
                    <span>halloween cat shirt</span>
                    <span className="text-white/30 ml-auto text-xs">↵</span>
                  </div>
                ),
              },
              {
                num: "02",
                title: "Get the verdict",
                desc: "GO, POSSIBLE, or AVOID. Score 0–100. Real demand vs real competition.",
                visual: (
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-sm">
                      GO · 78
                    </div>
                    <div className="rounded-xl px-4 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-sm">
                      POSSIBLE
                    </div>
                    <div className="rounded-xl px-4 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold text-sm">
                      AVOID
                    </div>
                  </div>
                ),
              },
              {
                num: "03",
                title: "Design with confidence",
                desc: "Markearn tells you what to design and what to avoid. You execute.",
                visual: (
                  <div className="glass rounded-xl px-5 py-4 text-sm leading-relaxed text-white/70">
                    <span className="text-white/40">Design idea →</span>{" "}
                    Vintage black cat + witch hat + bold script. Upload before
                    Sept 15.
                  </div>
                ),
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="glass rounded-2xl p-8 grid md:grid-cols-[120px_1fr_auto] gap-6 items-center hover-lift"
              >
                <div className="serif text-5xl md:text-6xl text-white/20">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed">{step.desc}</p>
                </div>
                <div className="md:max-w-md">{step.visual}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY MARKEARN — THE DIFFERENT SECTION ===== */}
      <section id="proof" className="relative z-10 px-6 lg:px-16 py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">
              Why Markearn is different
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
              <span className="gradient-text">Not more data.</span>
              <br />
              <span className="serif gradient-accent text-5xl md:text-7xl">
                A decision you can act on.
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl p-8 bg-white/[0.02] border border-white/[0.06]"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">
                What we don't do
              </p>
              <ul className="space-y-3">
                {[
                  "Endless dashboards",
                  "47 metrics you'll never read",
                  "Reports that take hours to interpret",
                  "Make you guess what to design",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/40"
                  >
                    <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center mt-0.5">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="currentColor"
                      >
                        <path d="M1.5 1.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="glow-border rounded-2xl p-8 glass"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] gradient-accent font-semibold mb-4">
                What we do
              </p>
              <ul className="space-y-3">
                {[
                  "One clear verdict in 10 seconds",
                  "Tell you what to design tomorrow",
                  "Tell you what to avoid (and why)",
                  "Save you hours every single week",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/90"
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)",
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5l2 2 4-4"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="serif text-2xl md:text-3xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              "If one AVOID saves you a few hours, Markearn has already paid for
              itself."
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 px-6 lg:px-16 py-32">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glow-border relative rounded-3xl glass overflow-hidden p-12 md:p-20 text-center">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(167,139,250,0.3) 0%, transparent 70%)",
              }}
            />

            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4 relative">
              One last thing
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] mb-6 relative">
              <span className="gradient-text">Your next design</span>
              <br />
              <span className="serif gradient-accent text-5xl md:text-7xl">
                shouldn't be a guess.
              </span>
            </h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 relative">
              Free trial. No credit card. Your first verdict in 10 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Link
                href="/sign-up"
                className="group relative px-8 py-4 rounded-xl bg-white text-black text-sm font-semibold tracking-tight overflow-hidden hover-lift"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get your first verdict
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="group-hover:translate-x-0.5 transition-transform"
                  >
                    <path
                      d="M3 8h10m-4-4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-white/60 hover:text-white transition"
              >
                See pricing →
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 px-6 lg:px-16 py-12 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)",
              }}
            >
              <span className="text-white font-bold text-xs leading-none">M</span>
            </div>
            <span className="text-sm text-white/60">
              Mark<span className="text-white/30">earn</span> · © 2026
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>
            <a
              href="mailto:support@markearn.com"
              className="hover:text-white transition"
            >
              support@markearn.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}