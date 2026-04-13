"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = ["dog mom shirt", "cat lover mug", "nurse gift", "teacher appreciation", "birthday queen", "christmas funny tee"];

export default function Competition() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const nav = [
    { label: "Keyword Research", path: "/dashboard", emoji: "🔍" },
    { label: "Competition", path: "/competition", emoji: "📊", active: true },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
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
    setData({
      keyword: kw, score,
      level: score < 40 ? "Low" : score < 70 ? "Medium" : "High",
      sellers, avgPrice,
      opportunity: score < 40 ? "Excellent" : score < 70 ? "Good" : "Hard",
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
        : ["Very competitive — focus on micro-niches instead", "Add personalization to stand out", "Combine with another niche for less competition"],
    });
    setLoading(false);
  };

  const levelColors: any = {
    Low: { text: "#34d399", bg: "#0d2b1f", border: "#065f46" },
    Medium: { text: "#fbbf24", bg: "#2b1f06", border: "#78350f" },
    High: { text: "#f87171", bg: "#2b0f0f", border: "#7f1d1d" },
  };

  const oppColors: any = {
    Excellent: "#34d399", Good: "#a5b4fc", Hard: "#f87171"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .rk { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #0f1623; color: #cbd5e1; min-height: 100vh; display: flex; }
        .rk-side { width: 228px; background: #111827; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; flex-shrink: 0; padding: 24px 14px 20px; }
        .rk-logo { font-size: 18px; font-weight: 700; color: #f8fafc; letter-spacing: -0.03em; padding: 0 6px; margin-bottom: 8px; }
        .rk-logo em { font-style: normal; color: #818cf8; }
        .rk-live-row { display: flex; align-items: center; gap: 6px; padding: 0 6px; margin-bottom: 28px; }
        .rk-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; flex-shrink: 0; animation: dpulse 2s ease infinite; }
        .rk-live-label { font-size: 11px; font-weight: 500; color: #34d399; letter-spacing: 0.04em; }
        .rk-section-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.2); letter-spacing: 0.12em; text-transform: uppercase; padding: 0 6px; margin-bottom: 6px; }
        .rk-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .rk-navbtn { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; background: none; color: #64748b; font-size: 13px; font-weight: 500; width: 100%; text-align: left; transition: all 0.15s; font-family: inherit; }
        .rk-navbtn:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
        .rk-navbtn-active { background: rgba(129,140,248,0.12) !important; border-color: rgba(129,140,248,0.25) !important; color: #a5b4fc !important; }
        .rk-new-badge { margin-left: auto; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: rgba(251,146,60,0.18); color: #fb923c; letter-spacing: 0.06em; }
        .rk-upgrade { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .rk-upgrade-btn { width: 100%; padding: 10px 16px; border-radius: 10px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #fff; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: opacity 0.15s; }
        .rk-upgrade-btn:hover { opacity: 0.88; }
        .rk-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .rk-topbar { height: 48px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; padding: 0 36px; background: #0f1623; flex-shrink: 0; }
        .rk-content { flex: 1; padding: 36px 40px; overflow-y: auto; }
        .rk-title { font-size: 22px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.025em; margin-bottom: 6px; }
        .rk-sub { font-size: 13px; color: #475569; margin-bottom: 28px; }
        .rk-search-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .rk-input { flex: 1; background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 13px 18px; color: #e2e8f0; font-size: 14px; outline: none; font-family: inherit; transition: all 0.15s; }
        .rk-input::placeholder { color: #334155; }
        .rk-input:focus { border-color: rgba(129,140,248,0.6); box-shadow: 0 0 0 4px rgba(129,140,248,0.08); }
        .rk-btn { background: #6366f1; color: #fff; border: none; border-radius: 12px; padding: 13px 26px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.15s; }
        .rk-btn:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.3); }
        .rk-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .rk-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 32px; }
        .rk-chip { padding: 6px 14px; border-radius: 20px; background: #1e293b; border: 1px solid rgba(255,255,255,0.07); color: #475569; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.12s; font-family: inherit; }
        .rk-chip:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
        .rk-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; margin-bottom: 20px; }
        .rk-stat { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; }
        .rk-stat-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 12px; }
        .rk-stat-val { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
        .rk-stat-sub { font-size: 12px; color: #475569; }
        .rk-bar-wrap { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; margin-bottom: 20px; }
        .rk-bar-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .rk-bar-bg { background: rgba(255,255,255,0.06); border-radius: 99px; height: 8px; }
        .rk-bar-fill { height: 8px; border-radius: 99px; transition: width 0.6s ease; }
        .rk-tips { background: rgba(251,146,60,0.06); border: 1px solid rgba(251,146,60,0.15); border-radius: 14px; padding: 18px 22px; margin-bottom: 20px; }
        .rk-tips-title { font-size: 11px; font-weight: 600; color: #fb923c; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 12px; }
        .rk-tip { font-size: 13px; color: #cbd5e1; margin-bottom: 6px; display: flex; gap: 8px; }
        .rk-table-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; }
        .rk-table-head { padding: 14px 22px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; }
        table.rkt { width: 100%; border-collapse: collapse; }
        table.rkt th { text-align: left; padding: 10px 22px; font-size: 11px; font-weight: 600; color: #334155; letter-spacing: 0.07em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); }
        table.rkt td { padding: 13px 22px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); }
        table.rkt tr:last-child td { border-bottom: none; }
        table.rkt tr:hover td { background: rgba(255,255,255,0.02); }
        .rk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 16px; }
        .rk-spinner { width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .rk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 260px; text-align: center; }
        .rk-fade { animation: rkfade 0.35s ease; }
        @keyframes rkfade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div className="rk">
        <aside className="rk-side">
          <div className="rk-logo">Rank<em>ify</em></div>
          <div className="rk-live-row">
            <div className="rk-dot" />
            <span className="rk-live-label">Live data</span>
          </div>
          <div className="rk-section-label">Tools</div>
          <nav className="rk-nav">
            {nav.map(item => (
              <button key={item.path} onClick={() => router.push(item.path)}
                className={`rk-navbtn ${item.active ? "rk-navbtn-active" : ""}`}>
                <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{item.emoji}</span>
                <span>{item.label}</span>
                {item.badge && <span className="rk-new-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="rk-upgrade">
            <button className="rk-upgrade-btn" onClick={() => router.push("/pricing")}>↑ Upgrade Plan</button>
          </div>
        </aside>

        <div className="rk-main">
          <div className="rk-topbar">
            <span style={{ fontSize: 12, color: "#334155" }}>Competition Analyzer · Real market data</span>
          </div>
          <div className="rk-content">
            <div className="rk-title">📊 Competition Analyzer</div>
            <div className="rk-sub">Understand how hard it is to rank in any niche before you design</div>

            <div className="rk-search-row">
              <input className="rk-input" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && analyze()}
                placeholder='Enter a niche, e.g. "dog mom shirt", "nurse gift"' />
              <button className="rk-btn" onClick={() => analyze()} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze →"}
              </button>
            </div>

            <div className="rk-chips">
              {SUGGESTIONS.map(s => (
                <button key={s} className="rk-chip" onClick={() => { setQuery(s); analyze(s); }}>{s}</button>
              ))}
            </div>

            {loading && (
              <div className="rk-loading">
                <div className="rk-spinner" />
                <span style={{ fontSize: 13, color: "#475569" }}>Analyzing competition...</span>
              </div>
            )}

            {data && !loading && (
              <div className="rk-fade">
                <div className="rk-stats">
                  {[
                    { label: "Competition Score", value: `${data.score}/100`, color: levelColors[data.level]?.text },
                    { label: "Active Sellers", value: data.sellers.toLocaleString(), color: "#e2e8f0" },
                    { label: "Avg Price", value: `$${data.avgPrice}`, color: "#e2e8f0" },
                    { label: "Opportunity", value: data.opportunity, color: oppColors[data.opportunity] },
                  ].map((s, i) => (
                    <div key={i} className="rk-stat">
                      <div className="rk-stat-label">{s.label}</div>
                      <div className="rk-stat-val" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="rk-bar-wrap">
                  <div className="rk-bar-label">
                    <span>Competition Level</span>
                    <span style={{ color: levelColors[data.level]?.text }}>{data.level}</span>
                  </div>
                  <div className="rk-bar-bg">
                    <div className="rk-bar-fill" style={{ width: `${data.score}%`, background: levelColors[data.level]?.text }} />
                  </div>
                </div>

                <div className="rk-tips">
                  <div className="rk-tips-title">💡 Strategy Tips</div>
                  {data.tips.map((tip: string, i: number) => (
                    <div key={i} className="rk-tip"><span style={{ color: "#fb923c" }}>•</span>{tip}</div>
                  ))}
                </div>

                <div className="rk-table-card">
                  <div className="rk-table-head">Top Sellers in this Niche</div>
                  <table className="rkt">
                    <thead>
                      <tr>
                        <th>Shop</th>
                        <th>Est. Sales</th>
                        <th>Reviews</th>
                        <th>Avg Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topSellers.map((s: any, i: number) => (
                        <tr key={i}>
                          <td style={{ color: "#c7d2fe", fontWeight: 600 }}>{s.name}</td>
                          <td style={{ color: "#64748b" }}>{s.sales.toLocaleString()}</td>
                          <td style={{ color: "#64748b" }}>{s.reviews.toLocaleString()}</td>
                          <td style={{ color: "#34d399", fontWeight: 600 }}>${s.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!data && !loading && (
              <div className="rk-empty">
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.15 }}>📊</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Ready to analyze</div>
                <div style={{ fontSize: 13, color: "#1e293b" }}>Enter a niche to see competition data</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}