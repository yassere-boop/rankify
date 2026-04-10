 "use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WinningProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/winning")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setProducts(data.products);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const menuItems = [
    { icon: "🔍", label: "Keyword Research", href: "/dashboard" },
    { icon: "🏆", label: "Product Analyzer", href: "/product" },
    { icon: "🏷️", label: "Tag Generator", href: "/tags" },
    { icon: "📈", label: "Trend Graph", href: "/trends" },
    { icon: "🔥", label: "Winning Products", href: "/winning" },
    { icon: "⭐", label: "Listing Optimizer", href: "/dashboard" },
  ];

  function getVerdictStyle(verdict: string) {
    if (verdict === "Winner") return "bg-green-400/15 border-green-400/40 text-green-300";
    return "bg-yellow-400/15 border-yellow-400/40 text-yellow-300";
  }

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <aside className="w-52 border-r border-white/10 p-4 flex flex-col gap-1 shrink-0">
        <div className="text-xl font-black text-white mb-6">
          Rank<span className="text-purple-400">ify</span>
        </div>
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
            ${i === 4 ? "bg-purple-600/30 text-purple-300" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-black mb-1">
              🔥 Winning Products
            </h1>
            <p className="text-white/40 text-sm">
              Top products with high demand and low competition — updated with real data
            </p>
          </div>
          <div className="bg-green-400/10 border border-green-400/30 text-green-300 text-xs font-bold px-4 py-2 rounded-full">
            ● Live Data
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-4 animate-pulse">🔥</div>
            <p className="text-white/50 text-sm">Analyzing top products with real data...</p>
            <p className="text-white/30 text-xs mt-2">This may take a few seconds</p>
          </div>
        )}

        {error && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white/50 text-sm">
            Failed to load winning products — please try again.
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {products.slice(0, 3).map((p, i) => (
                <div key={i} className={`rounded-3xl p-6 border relative overflow-hidden ${
                  i === 0 ? "bg-gradient-to-br from-yellow-500/20 to-purple-900/50 border-yellow-400/40" :
                  i === 1 ? "bg-gradient-to-br from-slate-400/10 to-purple-900/50 border-slate-400/30" :
                  "bg-gradient-to-br from-orange-500/10 to-purple-900/50 border-orange-400/30"
                }`}>
                  <div className="text-3xl mb-3">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>
                  <h3 className="text-white font-black text-sm mb-3 capitalize leading-tight">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`border text-xs px-2 py-0.5 rounded-full font-bold ${getVerdictStyle(p.verdict)}`}>
                      {p.verdict === "Winner" ? "🏆 Winner" : "⚡ Potential"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-white/5 rounded-xl p-2 text-center">
                      <p className="text-white/30 text-xs">Searches</p>
                      <p className="text-white font-black text-sm">{p.volume}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 text-center">
                      <p className="text-white/30 text-xs">Score</p>
                      <p className="text-purple-300 font-black text-sm">{p.score}</p>
                    </div>
                  </div>
                  <p className={`text-xs font-bold mt-3 ${getTrendColor(p.trend)}`}>{p.trend}</p>
                </div>
              ))}
            </div>

            {/* Full list */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                  All winning products ({products.length})
                </p>
                <p className="text-white/20 text-xs">Sorted by winning score</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">#</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Product</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Searches/mo</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Competition</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Trend</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Score</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer">
                      <td className="px-5 py-3 text-white/30 font-bold">{i + 1}</td>
                      <td className="px-5 py-3 text-white font-semibold capitalize">{p.name}</td>
                      <td className="px-5 py-3 text-white/70">{p.volume}</td>
                      <td className={`px-5 py-3 font-semibold ${getCompColor(p.competition)}`}>{p.competition}</td>
                      <td className={`px-5 py-3 font-semibold ${getTrendColor(p.trend)}`}>{p.trend}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-white/10 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${p.score >= 55 ? "bg-green-400" : "bg-yellow-400"}`}
                              style={{ width: `${Math.min(p.score, 100)}%` }} />
                          </div>
                          <span className="text-white/50 text-xs">{p.score}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`border text-xs px-3 py-1 rounded-full font-bold ${getVerdictStyle(p.verdict)}`}>
                          {p.verdict === "Winner" ? "🏆 Winner" : "⚡ Potential"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
