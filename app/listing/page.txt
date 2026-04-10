"use client";
import { useState } from "react";
import Link from "next/link";

export default function ListingOptimizer() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const menuItems = [
    { icon: "🔍", label: "Keyword Research", href: "/dashboard" },
    { icon: "🏆", label: "Product Analyzer", href: "/product" },
    { icon: "🏷️", label: "Tag Generator", href: "/tags" },
    { icon: "📈", label: "Trend Graph", href: "/trends" },
    { icon: "🔥", label: "Winning Products", href: "/winning" },
    { icon: "⭐", label: "Listing Optimizer", href: "/listing" },
  ];

  const suggestions = ["candle", "jewelry", "mug", "tshirt", "wedding", "baby", "hoodie", "poster", "tote bag"];

  async function handleOptimize() {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: query.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!data.error && data.related?.length) {
        const topKeywords = data.related
          .sort((a: any, b: any) => parseInt(b.vol) - parseInt(a.vol))
          .slice(0, 13)
          .map((k: any) => k.kw);

        const mainKw = query.trim();
        const volume = data.volume;
        const competition = data.competition;

        const title = generateTitle(mainKw, topKeywords);
        const description = generateDescription(mainKw, topKeywords, volume);
        const tags = generateTags(mainKw, topKeywords);
        const score = calculateScore(volume, competition, topKeywords.length);

        setResult({ title, description, tags, score, volume, competition, keyword: mainKw });
      } else {
        setResult({ error: true });
      }
    } catch {
      setResult({ error: true });
    }

    setLoading(false);
  }

  function generateTitle(kw: string, related: string[]) {
    const cap = (s: string) => s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const extras = related.filter(r => r !== kw).slice(0, 2);
    const parts = [cap(kw), ...extras.map(cap)];
    const title = parts.join(" | ") + " — Gift for Her, Personalized, Handmade";
    return title.slice(0, 140);
  }

  function generateDescription(kw: string, related: string[], volume: string) {
    const cap = (s: string) => s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const topRelated = related.slice(0, 5).map(cap).join(", ");
    return `✨ Looking for the perfect ${cap(kw)}? You've found it!

Our ${cap(kw)} is carefully crafted with attention to every detail — making it the ideal gift for birthdays, holidays, weddings, or just because.

🎁 PERFECT FOR: ${topRelated}

✅ WHY CHOOSE US:
- High-quality materials and craftsmanship
- Personalization available — make it truly unique
- Fast processing and shipping
- 100% satisfaction guaranteed

📦 DETAILS:
- Ready to ship in 1–3 business days
- Gift wrapping available upon request
- Custom orders welcome — message us!

💬 Questions? We're here to help — message us anytime.

Search terms: ${related.slice(0, 8).join(", ")}`.slice(0, 2000);
  }

  function generateTags(kw: string, related: string[]) {
    const all = [kw, ...related].map(t => t.toLowerCase().trim());
    const unique = [...new Set(all)].slice(0, 13);
    return unique;
  }

  function calculateScore(volume: string, competition: string, kwCount: number) {
    let score = 50;
    const vol = parseInt(volume?.replace(/[^0-9]/g, "") || "0");
    if (vol > 10000) score += 20;
    else if (vol > 5000) score += 15;
    else if (vol > 1000) score += 10;
    if (competition === "Low") score += 20;
    else if (competition === "Medium") score += 10;
    if (kwCount >= 10) score += 10;
    return Math.min(score, 100);
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen bg-[#0a0812] flex">
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(108,59,255,0.15) 0%, transparent 70%)" }} />

      {/* Sidebar */}
      <aside className="relative z-10 w-56 border-r border-purple-500/15 p-5 flex flex-col gap-1 shrink-0 bg-[#0a0812]/80 backdrop-blur-md">
        <div className="text-xl font-black text-white mb-8">
          Rank<span className="text-purple-400">ify</span>
        </div>
        <p className="text-[10px] text-purple-300/30 uppercase tracking-widest px-3 mb-1">Tools</p>
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
            ${i === 5
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/25"
              : "text-purple-200/40 hover:text-white hover:bg-purple-500/08"}`}>
            <span className="text-base">{item.icon}</span> {item.label}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <div className="relative z-10 flex-1 p-8 overflow-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-black mb-1">⭐ Listing Optimizer</h1>
          <p className="text-purple-200/40 text-sm">Generate SEO-optimized title, description and tags for your Etsy listing</p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleOptimize()}
            placeholder='Enter your product, e.g. "candle", "mug", "wedding gift"'
            className="flex-1 bg-white/05 border border-purple-500/20 rounded-full px-6 py-3.5 text-white placeholder-purple-300/30 text-sm outline-none focus:border-purple-500 transition-colors"
          />
          <button onClick={handleOptimize} disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 disabled:opacity-50 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all shadow-[0_0_24px_rgba(108,59,255,0.3)]">
            {loading ? "Optimizing..." : "✨ Optimize"}
          </button>
        </div>

        {/* Suggestions */}
        {!result && !loading && (
          <div className="flex flex-wrap gap-2 mb-10">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setQuery(s)}
                className="bg-purple-500/08 hover:bg-purple-600/20 border border-purple-500/15 text-purple-300/50 hover:text-purple-300 px-4 py-1.5 rounded-full text-xs transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="text-4xl mb-4 animate-pulse">⭐</div>
            <p className="text-purple-200/50 text-sm">Generating your optimized listing...</p>
            <p className="text-purple-200/30 text-xs mt-2">Analyzing keywords and competition</p>
          </div>
        )}

        {/* Error */}
        {result?.error && (
          <div className="bg-white/03 border border-purple-500/15 rounded-2xl p-6 text-center text-purple-200/50 text-sm">
            No data found for "{query}" — try another keyword.
          </div>
        )}

        {/* Result */}
        {result && !result.error && (
          <div className="flex flex-col gap-5">

            {/* SEO Score */}
            <div className="bg-white/03 border border-purple-500/15 rounded-2xl p-5 flex items-center gap-6">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="8"/>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="url(#sg)" strokeWidth="8"
                    strokeDasharray={`${result.score * 2.01} 201`} strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed"/>
                      <stop offset="100%" stopColor="#c084fc"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-lg">{result.score}</span>
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-lg mb-1">
                  {result.score >= 80 ? "🔥 Excellent listing" : result.score >= 60 ? "✅ Good listing" : "⚡ Needs improvement"}
                </p>
                <p className="text-purple-200/50 text-sm">SEO score for <span className="text-white">"{result.keyword}"</span></p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-purple-300/60">{result.volume} searches/mo</span>
                  <span className={`text-xs font-semibold ${result.competition === "Low" ? "text-emerald-400" : result.competition === "Medium" ? "text-amber-400" : "text-red-400"}`}>
                    {result.competition} competition
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="bg-white/03 border border-purple-500/15 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-300/60 text-xs font-bold uppercase tracking-widest">Etsy Title</p>
                <button onClick={() => copyToClipboard(result.title, "title")}
                  className="text-xs text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1 rounded-full transition-all">
                  {copied === "title" ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm leading-relaxed">{result.title}</p>
              <p className="text-purple-300/30 text-xs mt-2">{result.title.length}/140 characters</p>
            </div>

            {/* Description */}
            <div className="bg-white/03 border border-purple-500/15 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-300/60 text-xs font-bold uppercase tracking-widest">Description</p>
                <button onClick={() => copyToClipboard(result.description, "desc")}
                  className="text-xs text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1 rounded-full transition-all">
                  {copied === "desc" ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <pre className="text-white/70 text-xs leading-relaxed whitespace-pre-wrap font-sans">{result.description}</pre>
              <p className="text-purple-300/30 text-xs mt-2">{result.description.length}/2000 characters</p>
            </div>

            {/* Tags */}
            <div className="bg-white/03 border border-purple-500/15 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-purple-300/60 text-xs font-bold uppercase tracking-widest">
                  Etsy Tags ({result.tags.length}/13)
                </p>
                <button onClick={() => copyToClipboard(result.tags.join(", "), "tags")}
                  className="text-xs text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1 rounded-full transition-all">
                  {copied === "tags" ? "✓ Copied!" : "Copy all"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag: string, i: number) => (
                  <span key={i}
                    className="bg-purple-600/15 border border-purple-500/25 text-purple-300 text-xs px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-center mt-8">
            <div className="text-4xl mb-4">⭐</div>
            <p className="text-purple-200/50 text-sm">Enter your product to generate an optimized Etsy listing</p>
            <p className="text-purple-200/30 text-xs mt-1">Title · Description · Tags — all SEO optimized</p>
          </div>
        )}

      </div>
    </main>
  );
}