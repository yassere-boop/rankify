"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TagGenerator() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const menuItems = [
    { icon: "🔍", label: "Keyword Research", path: "/dashboard" },
    { icon: "📊", label: "Competition", path: "/competition" },
    { icon: "📈", label: "Trends", path: "/trends" },
    { icon: "🏷️", label: "Tag Generator", path: "/tags", active: true },
    { icon: "⭐", label: "Listing Optimizer", path: "/listing" },
    { icon: "📋", label: "Sales Estimator", path: "/sales" },
    { icon: "🎨", label: "POD Research", path: "/pod", isNew: true },
  ];

  async function handleGenerate() {
    if (!query.trim()) return;
    setLoading(true);
    setNoResult(false);
    setResult(null);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: query.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.error || !data.tags?.length) setNoResult(true);
      else setResult(data);
    } catch {
      setNoResult(true);
    }
    setLoading(false);
  }

  function copyAllTags() {
    if (!result) return;
    const text = result.tags.map((t: any) => t.tag).join(", ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getCompColor(comp: string) {
    if (comp === "Low") return "text-green-400";
    if (comp === "Medium") return "text-yellow-400";
    return "text-red-400";
  }

  function getScoreColor(score: number) {
    if (score >= 60) return "bg-green-400/20 border-green-400/40 text-green-300";
    if (score >= 30) return "bg-yellow-400/20 border-yellow-400/40 text-yellow-300";
    return "bg-red-400/20 border-red-400/40 text-red-300";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <aside className="w-52 border-r border-white/10 p-4 flex flex-col gap-1 shrink-0">
        <div className="text-xl font-black text-white mb-6">
          Rank<span className="text-purple-400">ify</span>
        </div>
        {menuItems.map((item, i) => (
          <button key={i} onClick={() => router.push(item.path)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition text-left
              ${item.active ? "bg-purple-600/30 text-purple-300" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.isNew && <span className="ml-auto bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">NEW</span>}
          </button>
        ))}
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-black mb-1">🏷️ Tag Generator</h1>
          <p className="text-white/40 text-sm">Generate the best tags for your listings — ranked by search volume</p>
        </div>

        <div className="flex gap-3 mb-8">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
            placeholder='e.g. "soy candle", "custom mug", "dog mom shirt"'
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500" />
          <button onClick={handleGenerate} disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold text-sm transition min-w-[140px]">
            {loading ? "Generating..." : "Generate Tags"}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-4 animate-pulse">🏷️</div>
            <p className="text-white/50 text-sm">Generating best tags with real data...</p>
          </div>
        )}

        {noResult && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white/50 text-sm">
            Could not generate tags for "<span className="text-white">{query}</span>" — try another product name.
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white font-black text-lg capitalize">{result.product}</p>
                  <p className="text-white/40 text-xs mt-1">{result.tags.length} tags generated — sorted by score</p>
                </div>
                <button onClick={copyAllTags}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${copied ? "bg-green-500 text-white" : "bg-purple-600 hover:bg-purple-500 text-white"}`}>
                  {copied ? "✓ Copied!" : "Copy All Tags"}
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                {result.tags.map((t: any, i: number) => (
                  <button key={i} onClick={() => navigator.clipboard.writeText(t.tag)}
                    className={`border px-4 py-2 rounded-full text-sm font-semibold transition hover:scale-105 ${getScoreColor(t.score)}`}>
                    {t.tag}
                  </button>
                ))}
              </div>
              <p className="text-white/20 text-xs">Click any tag to copy individually</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Tag details</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Tag</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Searches/mo</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Competition</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tags.map((t: any, i: number) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(t.tag)}>
                      <td className="px-5 py-3 text-purple-300 font-semibold">{t.tag}</td>
                      <td className="px-5 py-3 text-white/70">{t.volume > 0 ? t.volume.toLocaleString() : "—"}</td>
                      <td className={`px-5 py-3 font-semibold ${getCompColor(t.competition)}`}>{t.competition}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${t.score >= 60 ? "bg-green-400" : t.score >= 30 ? "bg-yellow-400" : "bg-red-400"}`}
                              style={{ width: `${Math.min(t.score, 100)}%` }} />
                          </div>
                          <span className="text-white/50 text-xs w-6">{t.score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-sm font-semibold mb-1">💡 Pro tip</p>
              <p className="text-white/50 text-xs leading-relaxed">
                Etsy allows up to 13 tags per listing. Use the green tags first — they have the best balance of volume and low competition. Copy all and paste directly into your listing.
              </p>
            </div>
          </div>
        )}

        {!result && !loading && !noResult && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-5xl mb-4">🏷️</div>
            <p className="text-white/50 text-sm">Enter a product to generate optimized tags</p>
            <p className="text-white/30 text-xs mt-1">Tags ranked by search volume and competition score</p>
          </div>
        )}
      </div>
    </main>
  );
}