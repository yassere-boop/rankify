"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SUGGESTIONS = ["dog mom", "halloween", "christmas", "nurse gift", "teacher", "birthday", "vintage", "cat lover"];

export default function TrendGraph() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  const nav = [
    { label: "Keyword Research", path: "/dashboard", emoji: "🔍" },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈", active: true },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
  ];

  const currentMonth = new Date().getMonth();

  async function handleAnalyze(kw?: string) {
    const keyword = kw || query;
    if (!keyword.trim()) return;
    setLoading(true); setNoResult(false); setResult(null);
    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.error) setNoResult(true);
      else setResult(data);
    } catch { setNoResult(true); }
    setLoading(false);
  }

  const verdictConfig: any = {
    Rising: { color: "#34d399", bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.2)", icon: "↑" },
    Stable: { color: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", icon: "→" },
    Declining: { color: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)", icon: "↓" },
  };

  function renderGraph() {
    if (!result?.months?.length) return null;
    const months = result.months;
    const max = result.max || 1;
    const width = 600;
    const height = 180;
    const pad = { top: 16, bottom: 36, left: 48, right: 16 };
    const gw = width - pad.left - pad.right;
    const gh = height - pad.top - pad.bottom;
    const step = gw / (months.length - 1);
    const points = months.map((m: any, i: number) => ({
      x: pad.left + i * step,
      y: pad.top + gh - (m.volume / max) * gh,
      volume: m.volume, month: m.month,
    }));
    const pathD = points.map((p: any, i: number) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(" ");
    const areaD = `${pathD} L ${points[points.length - 1].x} ${pad.top + gh} L ${points[0].x} ${pad.top + gh} Z`;
    const color = result.verdict === "Rising" ? "#34d399" : result.verdict === "Declining" ? "#f87171" : "#fbbf24";
    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line key={i} x1={pad.left} y1={pad.top + gh * (1 - pct)} x2={pad.left + gw} y2={pad.top + gh * (1 - pct)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        <path d={areaD} fill="url(#ag)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p: any, i: number) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill={color} opacity="0.8" />
            <text x={p.x} y={height - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">{p.month.slice(0, 3)}</text>
          </g>
        ))}
      </svg>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .rk { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #0f1623; color: #cbd5e1; min-height: 100vh; display: flex; }
        .rk-side { width: 228px; background: #111827; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; flex-shrink: 0; padding: 24px 14px 20px; }
        .rk-logo { font-size: 18px; font-weight: 700; color: #f8fafc; letter-spacing: -0.03em; padding: 0 6px; margin-bottom: 8px; }
        .rk-logo em { font-style: normal; color: #818cf8; }
        .rk-live-row { display: flex; align-items: center; gap: 6px; padding: 0 6px; margin-bottom: 28px; }
        .rk-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; animation: dpulse 2s ease infinite; }
        .rk-live-label { font-size: 11px; font-weight: 500; color: #34d399; letter-spacing: 0.04em; }
        .rk-section-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.2); letter-spacing: 0.12em; text-transform: uppercase; padding: 0 6px; margin-bottom: 6px; }
        .rk-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .rk-navbtn { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; background: none; color: #64748b; font-size: 13px; font-weight: 500; width: 100%; text-align: left; transition: all 0.15s; font-family: inherit; }
        .rk-navbtn:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
        .rk-navbtn-active { background: rgba(129,140,248,0.12) !important; border-color: rgba(129,140,248,0.25) !important; color: #a5b4fc !important; }
        .rk-new-badge { margin-left: auto; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: rgba(251,146,60,0.18); color: #fb923c; }
        .rk-upgrade { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .rk-upgrade-btn { width: 100%; padding: 10px 16px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
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
        .rk-btn:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); }
        .rk-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .rk-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 32px; }
        .rk-chip { padding: 6px 14px; border-radius: 20px; background: #1e293b; border: 1px solid rgba(255,255,255,0.07); color: #475569; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.12s; font-family: inherit; }
        .rk-chip:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
        .rk-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; margin-bottom: 16px; }
        .rk-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; margin-bottom: 16px; }
        .rk-stat-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 10px; }
        .rk-stat-val { font-size: 20px; font-weight: 700; }
        .rk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 16px; }
        .rk-spinner { width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .rk-fade { animation: rkfade 0.35s ease; }
        .rk-cal { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
        .rk-cal-item { border-radius: 10px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); }
        @keyframes rkfade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div className="rk">
        <aside className="rk-side">
          <div className="rk-logo">Rank<em>ify</em></div>
          <div className="rk-live-row"><div className="rk-dot" /><span className="rk-live-label">Live data</span></div>
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
            <span style={{ fontSize: 12, color: "#334155" }}>Trend Analyzer · 12-month search data</span>
          </div>
          <div className="rk-content">
            <div className="rk-title">📈 Trend Analyzer</div>
            <div className="rk-sub">See when to upload designs for maximum seasonal sales</div>

            <div className="rk-search-row">
              <input className="rk-input" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                placeholder='Try "halloween witch", "christmas funny", "dog mom"' />
              <button className="rk-btn" onClick={() => handleAnalyze()} disabled={loading}>
                {loading ? "Loading..." : "Show Trend →"}
              </button>
            </div>

            <div className="rk-chips">
              {SUGGESTIONS.map(s => (
                <button key={s} className="rk-chip" onClick={() => { setQuery(s); handleAnalyze(s); }}>{s}</button>
              ))}
            </div>

            {loading && <div className="rk-loading"><div className="rk-spinner" /><span style={{ fontSize: 13, color: "#475569" }}>Fetching 12 months of data...</span></div>}

            {noResult && <div style={{ textAlign: "center", padding: 32, color: "#334155", fontSize: 13 }}>No trend data for "{query}"</div>}

            {result && !loading && (
              <div className="rk-fade">
                <div style={{ background: verdictConfig[result.verdict]?.bg, border: `1px solid ${verdictConfig[result.verdict]?.border}`, borderRadius: 14, padding: "16px 22px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: verdictConfig[result.verdict]?.color }}>{verdictConfig[result.verdict]?.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: verdictConfig[result.verdict]?.color, fontSize: 15 }}>
                      {result.verdict} — {result.trendPct > 0 ? "+" : ""}{result.trendPct}% last month
                    </div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
                      {result.verdict === "Rising" ? "Growing keyword — great time to enter" : result.verdict === "Stable" ? "Consistent demand with no major changes" : "Declining — consider a different niche"}
                    </div>
                  </div>
                </div>

                <div className="rk-stats">
                  {[
                    { label: "Current Volume", value: result.current?.toLocaleString() },
                    { label: "12-mo Average", value: result.avg?.toLocaleString() },
                    { label: "Peak Volume", value: result.max?.toLocaleString() },
                    { label: "Trend", value: result.verdict, color: verdictConfig[result.verdict]?.color },
                  ].map((s, i) => (
                    <div key={i} className="rk-card" style={{ padding: "16px 20px" }}>
                      <div className="rk-stat-label">{s.label}</div>
                      <div className="rk-stat-val" style={{ color: s.color || "#e2e8f0" }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="rk-card">
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 20 }}>
                    12-Month Search Volume — "{result.keyword}"
                  </div>
                  {renderGraph()}
                </div>

                <div className="rk-card" style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 16 }}>Seasonal Calendar</div>
                  <div className="rk-cal">
                    {MONTHS.map((m, i) => (
                      <div key={m} className="rk-cal-item" style={i === currentMonth ? { background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)" } : {}}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: i === currentMonth ? "#a5b4fc" : "#475569", marginBottom: 4 }}>{m}</div>
                        <div style={{ fontSize: 10, color: "#334155" }}>
                          {i === currentMonth ? "← Now" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && !noResult && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.15 }}>📈</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Ready to analyze</div>
                <div style={{ fontSize: 13, color: "#1e293b" }}>Enter a keyword to see monthly trends</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}