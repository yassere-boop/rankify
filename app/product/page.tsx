"use client";
import { useState } from "react";
import Link from "next/link";

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 60 ? "#4ade80" : score >= 35 ? "#fbbf24" : "#f87171";
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10"/>
        <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white">{score}</span>
        <span className="text-white/40 text-xs">/ 100</span>
      </div>
    </div>
  );
}

export default function ProductAnalyzer() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  async function handleAnalyze() {
    if (!query.trim()) return;
    setLoading(true);
    setNoResult(false);
    setResult(null);

    const cleanQuery = query
      .replace(/https?:\/\/[^\s]+/g, "")
      .replace(/etsy\.com\/listing\/\d+\//g, "")
      .replace(/-/g, " ")
      .trim()
      .toLowerCase()
      .split("?")[0]
      .slice(0, 50);

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: cleanQuery || query.trim() }),
      });

      const data = await res.json();

      if (data.error) {
        setNoResult(true);
      } else {
        setResult(data);
      }
    } catch {
      setNoResult(true);
    }

    setLoading(false);
  }

  const verdictConfig = {
    Winner: { color: "text-green-400", bg: "bg-green-400/10 border-green-400/30", emoji: "🏆", msg: "This product has strong potential — low competition and high demand!" },
    Potential: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", emoji: "⚡", msg: "This product has some potential — worth testing with the right niche." },
    Avoid: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", emoji: "⚠️", msg: "High competition and low demand — consider a different product." },
  };

  const menuItems = [
    { icon: "🔍", label: "Keyword Research", href: "/dashboard" },
    { icon: "🏆", label: "Product Analyzer", href: "/product" },
    { icon: "📊", label: "Competition", href: "/dashboard" },
    { icon: "📈", label: "Trends", href: "/dashboard" },
    { icon: "🏷️", label: "Tag Generator", href: "/dashboard" },
    { icon: "⭐", label: "Listing Optimizer", href: "/dashboard" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <aside className="w-52 border-r border-white/10 p-4 flex flex-col gap-1 shrink-0">
        <div className="text-xl font-black text-white mb-6">
          Rank<span className="text-purple-400">ify</span>
        </div>
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition text-left
            ${i === 1 ? "bg-purple-600/30 text-purple-300" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-black mb-1">Product Analyzer</h1>
          <p className="text-white/40 text-sm">Enter a product name or Etsy URL to get a winning score</p>
        </div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder='e.g. "personalised candle" or paste an Etsy URL'
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500"
          />
          <button onClick={handleAnalyze} disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold text-sm transition min-w-[120px]">
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-4 animate-pulse">🔍</div>
            <p className="text-white/50 text-sm">Analyzing product potential...</p>
          </div>
        )}

        {noResult && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white/50 text-sm">
            Could not analyze "<span className="text-white">{query}</span>" — try a product name like "soy candle" or "custom mug".
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6">
            {/* Score card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <ScoreCircle score={result.score} />
                  <p className={`text-center mt-4 text-2xl font-black ${verdictConfig[result.verdict as keyof typeof verdictConfig].color}`}>
                    {verdictConfig[result.verdict as keyof typeof verdictConfig].emoji} {result.verdict}
                  </p>
                </div>
                <div>
                  <h2 className="text-white text-xl font-black mb-2 capitalize">{result.product}</h2>
                  <div className={`border rounded-xl p-4 mb-4 ${verdictConfig[result.verdict as keyof typeof verdictConfig].bg}`}>
                    <p className="text-sm text-white/70">{verdictConfig[result.verdict as keyof typeof verdictConfig].msg}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Searches/mo", value: result.volume },
                      { label: "Competition", value: result.competition, color: result.competition === "Low" ? "text-green-400" : result.competition === "Medium" ? "text-yellow-400" : "text-red-400" },
                      { label: "Trend", value: result.trend, color: result.trend.startsWith("↑") ? "text-green-400" : result.trend.startsWith("↓") ? "text-red-400" : "text-yellow-400" },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-white/30 text-xs mb-1">{s.label}</p>
                        <p className={`font-black text-sm ${s.color || "text-white"}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related keywords */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Related keywords</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Keyword</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Searches/mo</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Competition</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {result.related.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-5 py-3 text-purple-300 font-semibold">{row.kw}</td>
                      <td className="px-5 py-3 text-white/70">{row.vol}</td>
                      <td className={`px-5 py-3 font-semibold ${row.comp === "Low" ? "text-green-400" : row.comp === "Medium" ? "text-yellow-400" : "text-red-400"}`}>{row.comp}</td>
                      <td className={`px-5 py-3 font-semibold ${row.trend.startsWith("↑") ? "text-green-400" : row.trend.startsWith("↓") ? "text-red-400" : "text-yellow-400"}`}>{row.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!result && !loading && !noResult && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <p className="text-white/50 text-sm">Enter a product name to get your winning score</p>
            <p className="text-white/30 text-xs mt-1">Works with any product — candle, mug, tshirt, sticker...</p>
          </div>
        )}
      </div>
    </main>
  );
}