"use client";
import { useState } from "react";

function getCompColor(comp: string) {
  if (comp === "Low") return "text-green-400";
  if (comp === "Medium") return "text-yellow-400";
  return "text-red-400";
}

function getTrendColor(trend: string) {
  if (trend.startsWith("↑")) return "text-green-400";
  if (trend.startsWith("↓")) return "text-red-400";
  return "text-yellow-400";
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [searched, setSearched] = useState("");

  async function handleAnalyze() {
    if (!query.trim()) return;
    setLoading(true);
    setNoResult(false);
    setResult(null);

    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: query.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (data.error || !data.related?.length) {
        setNoResult(true);
      } else {
        setResult(data);
        setSearched(query);
      }
    } catch {
      setNoResult(true);
    }

    setLoading(false);
  }

  const menuItems = [
    { icon: "🔍", label: "Keyword Research" },
    { icon: "📊", label: "Competition" },
    { icon: "📈", label: "Trends" },
    { icon: "🏷️", label: "Tag Generator" },
    { icon: "⭐", label: "Listing Optimizer" },
    { icon: "📋", label: "Sales Estimator" },
  ];

  const suggestions = [
    "candle", "jewelry", "sticker", "mug", "tshirt", "wedding", "baby",
    "hoodie", "phone case", "tote bag", "poster", "pillow", "socks",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <aside className="w-52 border-r border-white/10 p-4 flex flex-col gap-1 shrink-0">
        <div className="text-xl font-black text-white mb-6">
          Rank<span className="text-purple-400">ify</span>
        </div>
        {menuItems.map((item, i) => (
          <button key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition text-left
            ${i === 0 ? "bg-purple-600/30 text-purple-300" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder='Search any keyword, e.g. "candle", "mug", "wedding gift"'
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold text-sm transition min-w-[120px]"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {!result && !noResult && (
          <div className="flex flex-wrap gap-2 mb-8">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setQuery(s)}
                className="bg-white/5 hover:bg-purple-600/30 border border-white/10 text-white/50 hover:text-purple-300 px-4 py-1.5 rounded-full text-xs transition">
                {s}
              </button>
            ))}
          </div>
        )}

        {noResult && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white/50 text-sm mb-6">
            No data found for "<span className="text-white">{query}</span>" — try another keyword.
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-white/50 text-sm">Fetching real data from DataForSEO...</p>
          </div>
        )}

        {result && !loading && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/40 text-sm">
                Real data for <span className="text-white font-semibold">"{searched}"</span>
                <span className="ml-2 text-green-400 text-xs">● Live</span>
              </p>
              <button onClick={() => { setResult(null); setQuery(""); setSearched(""); }}
                className="text-white/30 hover:text-white text-xs transition">✕ Clear</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Monthly searches", value: result.volume, sub: result.trend, color: getTrendColor(result.trend) },
                { label: "Competition", value: result.competition, sub: `Score ${result.compScore}/100`, color: getCompColor(result.competition) },
                { label: "Opportunity", value: result.opportunity, sub: "Based on real data", color: "text-purple-300" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className="text-white text-2xl font-black">{s.value}</p>
                  <p className={`text-xs mt-1 ${s.color}`}>{s.sub}</p>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-xs font-bold mb-3 uppercase tracking-widest">
              Related keywords ({result.related.length})
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
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
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer">
                      <td className="px-5 py-3 text-purple-300 font-semibold">{row.kw}</td>
                      <td className="px-5 py-3 text-white/70">{row.vol}</td>
                      <td className={`px-5 py-3 font-semibold ${getCompColor(row.comp)}`}>{row.comp}</td>
                      <td className={`px-5 py-3 font-semibold ${getTrendColor(row.trend)}`}>{row.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!result && !noResult && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-white/50 text-sm">Enter any keyword to get real search data</p>
            <p className="text-white/30 text-xs mt-1">Powered by DataForSEO — live data</p>
          </div>
        )}
      </div>
    </main>
  );
}