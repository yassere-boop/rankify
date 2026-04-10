 "use client";
import { useState } from "react";
import Link from "next/link";

export default function TrendGraph() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  async function handleAnalyze() {
    if (!query.trim()) return;
    setLoading(true);
    setNoResult(false);
    setResult(null);

    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: query.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (data.error) setNoResult(true);
      else setResult(data);
    } catch {
      setNoResult(true);
    }

    setLoading(false);
  }

  const verdictConfig: any = {
    Rising: { color: "text-green-400", bg: "bg-green-400/10 border-green-400/30", icon: "↑", msg: "This keyword is growing — great time to enter this market!" },
    Stable: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", icon: "→", msg: "This keyword is stable — consistent demand with no major changes." },
    Declining: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: "↓", msg: "This keyword is declining — consider a different niche." },
  };

  const menuItems = [
    { icon: "🔍", label: "Keyword Research", href: "/dashboard" },
    { icon: "🏆", label: "Product Analyzer", href: "/product" },
    { icon: "🏷️", label: "Tag Generator", href: "/tags" },
    { icon: "📈", label: "Trend Graph", href: "/trends" },
    { icon: "📊", label: "Competition", href: "/dashboard" },
    { icon: "⭐", label: "Listing Optimizer", href: "/dashboard" },
  ];

  function renderGraph() {
    if (!result?.months?.length) return null;

    const months = result.months;
    const max = result.max || 1;
    const width = 600;
    const height = 200;
    const padding = { top: 20, bottom: 40, left: 50, right: 20 };
    const graphW = width - padding.left - padding.right;
    const graphH = height - padding.top - padding.bottom;
    const step = graphW / (months.length - 1);

    const points = months.map((m: any, i: number) => ({
      x: padding.left + i * step,
      y: padding.top + graphH - (m.volume / max) * graphH,
      volume: m.volume,
      month: m.month,
    }));

    const pathD = points.map((p: any, i: number) =>
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(" ");

    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + graphH} L ${points[0].x} ${padding.top + graphH} Z`;

    const color = result.verdict === "Rising" ? "#4ade80" : result.verdict === "Declining" ? "#f87171" : "#fbbf24";

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <g key={i}>
            <line
              x1={padding.left} y1={padding.top + graphH * (1 - pct)}
              x2={padding.left + graphW} y2={padding.top + graphH * (1 - pct)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            />
            <text
              x={padding.left - 8} y={padding.top + graphH * (1 - pct) + 4}
              textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)">
              {Math.round(max * pct / 1000)}K
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p: any, i: number) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={color} opacity="0.8" />
            {i % 3 === 0 && (
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">
                {p.month.slice(0, 7)}
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <aside className="w-52 border-r border-white/10 p-4 flex flex-col gap-1 shrink-0">
        <div className="text-xl font-black text-white mb-6">
          Rank<span className="text-purple-400">ify</span>
        </div>
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
            ${i === 3 ? "bg-purple-600/30 text-purple-300" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-black mb-1">Trend Graph</h1>
          <p className="text-white/40 text-sm">See how any keyword has evolved over the last 12 months</p>
        </div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder='e.g. "soy candle", "holographic sticker", "custom mug"'
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500"
          />
          <button onClick={handleAnalyze} disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold text-sm transition min-w-[140px]">
            {loading ? "Loading..." : "Show Trend"}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-4 animate-pulse">📈</div>
            <p className="text-white/50 text-sm">Fetching 12 months of real data...</p>
          </div>
        )}

        {noResult && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white/50 text-sm">
            No trend data for "<span className="text-white">{query}</span>" — try another keyword.
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6">
            {/* Verdict */}
            <div className={`border rounded-2xl p-5 flex items-center gap-4 ${verdictConfig[result.verdict].bg}`}>
              <div className={`text-4xl font-black ${verdictConfig[result.verdict].color}`}>
                {verdictConfig[result.verdict].icon}
              </div>
              <div>
                <p className={`font-black text-lg ${verdictConfig[result.verdict].color}`}>
                  {result.verdict} — {result.trendPct > 0 ? "+" : ""}{result.trendPct}% last month
                </p>
                <p className="text-white/50 text-sm">{verdictConfig[result.verdict].msg}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Current volume", value: result.current?.toLocaleString() },
                { label: "12-month average", value: result.avg?.toLocaleString() },
                { label: "Peak volume", value: result.max?.toLocaleString() },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className="text-white text-2xl font-black">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Graph */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <p className="text-white font-black mb-1 capitalize">{result.keyword}</p>
              <p className="text-white/30 text-xs mb-6">12-month search volume trend</p>
              {renderGraph()}
            </div>
          </div>
        )}

        {!result && !loading && !noResult && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-5xl mb-4">📈</div>
            <p className="text-white/50 text-sm">Enter a keyword to see its 12-month trend</p>
            <p className="text-white/30 text-xs mt-1">Powered by real Google search data</p>
          </div>
        )}
      </div>
    </main>
  );
}
