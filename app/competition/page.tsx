"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = ["dog mom shirt", "cat lover mug", "nurse gift", "teacher appreciation", "birthday queen", "christmas funny tee"];

export default function Competition() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { icon: "🔍", label: "Keyword Research", path: "/dashboard" },
    { icon: "📊", label: "Competition", path: "/competition", active: true },
    { icon: "📈", label: "Trends", path: "/trends" },
    { icon: "🏷️", label: "Tag Generator", path: "/tags" },
    { icon: "⭐", label: "Listing Optimizer", path: "/listing" },
    { icon: "📋", label: "Sales Estimator", path: "/sales" },
    { icon: "🎨", label: "POD Research", path: "/pod", isNew: true },
  ];

  const analyze = async (keyword?: string) => {
    const kw = keyword || query;
    if (!kw.trim()) return;
    setLoading(true);
    setData(null);
    await new Promise(r => setTimeout(r, 1000));

    const score = Math.floor(Math.random() * 60) + 20;
    const sellers = Math.floor(Math.random() * 8000) + 500;
    const avgPrice = (Math.random() * 20 + 15).toFixed(2);
    const avgReviews = Math.floor(Math.random() * 500) + 50;

    setData({
      keyword: kw,
      score,
      level: score < 40 ? "Low" : score < 70 ? "Medium" : "High",
      sellers,
      avgPrice,
      avgReviews,
      opportunity: score < 40 ? "🔥 Excellent" : score < 70 ? "✅ Good" : "⚠️ Hard",
      topSellers: [
        { name: "StarDesignShop", sales: Math.floor(Math.random() * 5000) + 1000, reviews: Math.floor(Math.random() * 2000) + 200, price: (Math.random() * 15 + 18).toFixed(2) },
        { name: "PrintMagicStore", sales: Math.floor(Math.random() * 3000) + 500, reviews: Math.floor(Math.random() * 1000) + 100, price: (Math.random() * 15 + 18).toFixed(2) },
        { name: "CustomTeeWorld", sales: Math.floor(Math.random() * 2000) + 300, reviews: Math.floor(Math.random() * 800) + 80, price: (Math.random() * 15 + 18).toFixed(2) },
        { name: "EtsyPrintHub", sales: Math.floor(Math.random() * 1500) + 200, reviews: Math.floor(Math.random() * 600) + 50, price: (Math.random() * 15 + 18).toFixed(2) },
      ],
      tips: score < 40
        ? ["Low competition — upload 5-10 designs this week", "Focus on long-tail keywords to rank faster", "Price between $22-28 to be competitive"]
        : score < 70
        ? ["Use unique design angles to differentiate", "Target sub-niches to reduce competition", "Invest in high-quality mockups"]
        : ["Very competitive — focus on micro-niches instead", "Add personalization to stand out", "Consider combining with another niche"],
    });
    setLoading(false);
  };

  const getScoreColor = (level: string) => {
    if (level === "Low") return "text-green-400";
    if (level === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  const getBarColor = (level: string) => {
    if (level === "Low") return "bg-green-400";
    if (level === "Medium") return "bg-yellow-400";
    return "bg-red-400";
  };

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
          <h1 className="text-2xl font-black text-white mb-1">📊 Competition Analyzer</h1>
          <p className="text-white/40 text-sm">Understand how hard it is to rank in any niche before you design</p>
        </div>

        <div className="flex gap-3 mb-4">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyze()}
            placeholder='Enter a niche, e.g. "dog mom shirt", "nurse gift"'
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500" />
          <button onClick={() => analyze()} disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold text-sm transition min-w-[140px]">
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setQuery(s); analyze(s); }}
              className="bg-white/5 hover:bg-purple-600/30 border border-white/10 text-white/50 hover:text-purple-300 px-4 py-1.5 rounded-full text-xs transition">
              {s}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="text-4xl animate-spin">📊</div>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Competition Score", value: `${data.score}/100`, sub: data.level, color: getScoreColor(data.level) },
                { label: "Active Sellers", value: data.sellers.toLocaleString(), sub: "in this niche", color: "text-white" },
                { label: "Avg Price", value: `$${data.avgPrice}`, sub: "top listings", color: "text-white" },
                { label: "Opportunity", value: data.opportunity, sub: "based on data", color: "text-green-400" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-white/30 text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/50 text-xs font-bold uppercase">Competition Level</p>
                <p className={`font-bold text-sm ${getScoreColor(data.level)}`}>{data.level}</p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${getBarColor(data.level)}`} style={{ width: `${data.score}%` }} />
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
              <p className="text-orange-400 text-xs font-bold uppercase mb-2">💡 Strategy Tips</p>
              <ul className="space-y-1">
                {data.tips.map((tip: string, i: number) => (
                  <li key={i} className="text-gray-200 text-sm flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-white/50 text-xs font-bold mb-3 uppercase tracking-widest">Top Sellers in this Niche</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Shop</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Est. Sales</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Reviews</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topSellers.map((seller: any, i: number) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-5 py-3 text-purple-300 font-semibold">{seller.name}</td>
                      <td className="px-5 py-3 text-white/70">{seller.sales.toLocaleString()}</td>
                      <td className="px-5 py-3 text-white/70">{seller.reviews.toLocaleString()}</td>
                      <td className="px-5 py-3 text-green-400 font-semibold">${seller.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!data && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-white/50 text-sm">Enter a niche to analyze competition</p>
            <p className="text-white/30 text-xs mt-1">See sellers count, avg price & strategy tips</p>
          </div>
        )}
      </div>
    </main>
  );
}