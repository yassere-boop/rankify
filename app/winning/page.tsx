"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WinningProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All");
  const [compFilter, setCompFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const platforms = ["All", "Etsy", "Amazon", "Redbubble", "Shopify", "Teepublic"];
  const compLevels = ["All", "Low", "Medium", "High"];

  const menuItems = [
    { icon: "🔍", label: "Keyword Research", href: "/dashboard" },
    { icon: "🏆", label: "Product Analyzer", href: "/product" },
    { icon: "🏷️", label: "Tag Generator", href: "/tags" },
    { icon: "📈", label: "Trend Graph", href: "/trends" },
    { icon: "🔥", label: "Winning Products", href: "/winning" },
    { icon: "⭐", label: "Listing Optimizer", href: "/dashboard" },
  ];

  function fetchProducts() {
    return fetch("/api/winning")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setProducts(data.products);
      })
      .catch(() => setError(true));
  }

  useEffect(() => {
    fetchProducts().finally(() => setLoading(false));
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }

  function getVerdictStyle(verdict: string) {
    if (verdict === "Winner") return "bg-emerald-400/15 border-emerald-400/40 text-emerald-300";
    return "bg-amber-400/15 border-amber-400/40 text-amber-300";
  }

  function getCompColor(comp: string) {
    if (comp === "Low") return "text-emerald-400";
    if (comp === "Medium") return "text-amber-400";
    return "text-red-400";
  }

  function getTrendColor(trend: string) {
    if (trend.startsWith("↑") || trend.startsWith("+")) return "text-emerald-400";
    if (trend.startsWith("↓") || trend.startsWith("-")) return "text-red-400";
    return "text-amber-400";
  }

  function estimateProfit(volume: string) {
    const v = parseInt(volume.replace(/[^0-9]/g, "")) || 0;
    const price = Math.floor(15 + (v / 1000) * 2);
    const profit = Math.floor(price * 0.65);
    return { price: `$${price}`, profit: `$${profit}` };
  }

  const filtered = products.filter((p) => {
    if (compFilter !== "All" && p.competition !== compFilter) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#0a0812] flex">

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
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
            ${i === 4
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/25"
              : "text-purple-200/40 hover:text-white hover:bg-purple-500/08"}`}>
            <span className="text-base">{item.icon}</span> {item.label}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <div className="relative z-10 flex-1 p-8 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-black mb-1">🔥 Winning Products</h1>
            <p className="text-purple-200/40 text-sm">
              High-demand, low-competition products — updated with real data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm px-4 py-2 rounded-full hover:bg-purple-600/30 transition-all disabled:opacity-50">
              <span className={refreshing ? "animate-spin" : ""}>↻</span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <div className="bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full">
              ● Live Data
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Platform filter */}
          <div className="flex items-center gap-2 bg-white/03 border border-purple-500/15 rounded-2xl p-1.5">
            {platforms.map((p) => (
              <button key={p}
                onClick={() => setFilter(p)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all
                  ${filter === p
                    ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(108,59,255,0.4)]"
                    : "text-purple-200/40 hover:text-white"}`}>
                {p}
              </button>
            ))}
          </div>

          {/* Competition filter */}
          <div className="flex items-center gap-2 bg-white/03 border border-purple-500/15 rounded-2xl p-1.5">
            {compLevels.map((c) => (
              <button key={c}
                onClick={() => setCompFilter(c)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all
                  ${compFilter === c
                    ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(108,59,255,0.4)]"
                    : "text-purple-200/40 hover:text-white"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-4 animate-pulse">🔥</div>
            <p className="text-purple-200/50 text-sm">Analyzing top products with real data...</p>
            <p className="text-purple-200/30 text-xs mt-2">This may take a few seconds</p>
          </div>
        )}

        {error && (
          <div className="bg-white/05 border border-white/10 rounded-2xl p-6 text-center text-purple-200/50 text-sm">
            Failed to load winning products — please try again.
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {filtered.slice(0, 3).map((p, i) => {
                const { price, profit } = estimateProfit(p.volume);
                return (
                  <div key={i} className={`rounded-2xl p-5 border relative overflow-hidden backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(108,59,255,0.2)] cursor-pointer ${
                    i === 0
                      ? "bg-gradient-to-br from-amber-500/10 to-purple-900/20 border-amber-400/30"
                      : i === 1
                      ? "bg-gradient-to-br from-slate-400/08 to-purple-900/20 border-slate-400/20"
                      : "bg-gradient-to-br from-orange-500/08 to-purple-900/20 border-orange-400/20"
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                      <span className={`border text-xs px-2.5 py-0.5 rounded-full font-semibold ${getVerdictStyle(p.verdict)}`}>
                        {p.verdict === "Winner" ? "🏆 Winner" : "⚡ Potential"}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-sm mb-4 capitalize leading-snug">{p.name}</h3>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white/05 rounded-xl p-2.5 text-center">
                        <p className="text-purple-300/40 text-[10px] mb-1">Searches/mo</p>
                        <p className="text-white font-bold text-sm">{p.volume}</p>
                      </div>
                      <div className="bg-white/05 rounded-xl p-2.5 text-center">
                        <p className="text-purple-300/40 text-[10px] mb-1">Score</p>
                        <p className="text-purple-300 font-bold text-sm">{p.score}</p>
                      </div>
                      <div className="bg-white/05 rounded-xl p-2.5 text-center">
                        <p className="text-purple-300/40 text-[10px] mb-1">Avg price</p>
                        <p className="text-white font-bold text-sm">{price}</p>
                      </div>
                      <div className="bg-emerald-400/08 rounded-xl p-2.5 text-center border border-emerald-400/15">
                        <p className="text-emerald-300/60 text-[10px] mb-1">Est. profit</p>
                        <p className="text-emerald-300 font-bold text-sm">{profit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${getTrendColor(p.trend)}`}>{p.trend}</span>
                      <span className={`text-xs font-semibold ${getCompColor(p.competition)}`}>
                        {p.competition} competition
                      </span>
                    </div>

                    {/* Score bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/08 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 rounded-full transition-all"
                          style={{ width: `${Math.min(p.score, 100)}%` }} />
                      </div>
                      <span className="text-xs text-purple-400 font-semibold">{p.score}/100</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full list */}
            <div className="bg-white/03 border border-purple-500/12 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-purple-500/12 flex items-center justify-between">
                <p className="text-purple-200/40 text-xs font-bold uppercase tracking-widest">
                  All winning products ({filtered.length})
                </p>
                <p className="text-purple-200/20 text-xs">Sorted by winning score</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/10">
                    {["#", "Product", "Searches/mo", "Avg Price", "Est. Profit", "Competition", "Trend", "Score", "Verdict"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-purple-200/30 text-xs font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const { price, profit } = estimateProfit(p.volume);
                    return (
                      <tr key={i} className="border-b border-purple-500/08 hover:bg-purple-500/05 transition cursor-pointer">
                        <td className="px-5 py-3 text-purple-300/30 font-bold">{i + 1}</td>
                        <td className="px-5 py-3 text-white font-semibold capitalize">{p.name}</td>
                        <td className="px-5 py-3 text-purple-200/70">{p.volume}</td>
                        <td className="px-5 py-3 text-white font-medium">{price}</td>
                        <td className="px-5 py-3 text-emerald-400 font-semibold">{profit}</td>
                        <td className={`px-5 py-3 font-semibold ${getCompColor(p.competition)}`}>{p.competition}</td>
                        <td className={`px-5 py-3 font-semibold ${getTrendColor(p.trend)}`}>{p.trend}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-14 bg-white/08 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-400"
                                style={{ width: `${Math.min(p.score, 100)}%` }} />
                            </div>
                            <span className="text-purple-300/50 text-xs">{p.score}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`border text-xs px-3 py-1 rounded-full font-semibold ${getVerdictStyle(p.verdict)}`}>
                            {p.verdict === "Winner" ? "🏆 Winner" : "⚡ Potential"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}