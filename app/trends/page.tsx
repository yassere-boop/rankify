"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ============================================
// DYNAMIC SUGGESTIONS
// ============================================
function getDynamicSuggestions(): string[] {
  const month = new Date().getMonth() + 1;
  const seasonal: Record<number, string[]> = {
    1: ["valentines day", "winter cozy", "new year"],
    2: ["valentines gift", "spring vibes", "galentines"],
    3: ["st patricks day", "easter mom", "spring break"],
    4: ["mothers day", "graduation 2026", "easter hunt"],
    5: ["mothers day mug", "fathers day", "teacher gift"],
    6: ["fathers day", "summer vibes", "pride month"],
    7: ["4th of july", "summer beach", "back to school"],
    8: ["back to school", "halloween prep", "teacher gift"],
    9: ["halloween", "fall vibes", "pumpkin spice"],
    10: ["halloween shirt", "thanksgiving", "fall aesthetic"],
    11: ["thanksgiving", "christmas", "black friday"],
    12: ["christmas gift", "new year", "holiday mug"],
  };
  const trending = ["matcha lover", "boy mom era", "plant mom"];
  return [...(seasonal[month] || []), ...trending].slice(0, 8);
}

// ============================================
// SEASONAL INSIGHTS - what to upload by month
// ============================================
const SEASONAL_INSIGHTS: Record<number, { event: string; uploadNow: string[] }> = {
  1: { event: "Valentine's Day (Feb 14)", uploadNow: ["valentines couple", "anti-valentine funny", "galentines"] },
  2: { event: "St. Patrick's & Spring", uploadNow: ["st patricks day", "spring flowers", "easter mom"] },
  3: { event: "Easter & Mother's Day prep", uploadNow: ["easter bunny", "mothers day", "spring vibes"] },
  4: { event: "Mother's Day & Graduation", uploadNow: ["mothers day mug", "graduation 2026", "teacher appreciation"] },
  5: { event: "Father's Day (June 15)", uploadNow: ["fathers day", "dog dad", "grill master"] },
  6: { event: "4th of July & Summer", uploadNow: ["4th of july", "summer beach", "patriotic"] },
  7: { event: "Halloween prep (CRITICAL)", uploadNow: ["halloween witch", "spooky season", "halloween cat"] },
  8: { event: "Halloween + Back to School", uploadNow: ["teacher gift", "halloween shirt", "first day school"] },
  9: { event: "Christmas prep starts NOW", uploadNow: ["christmas funny", "thanksgiving", "fall aesthetic"] },
  10: { event: "Christmas (CRITICAL)", uploadNow: ["christmas gift", "stocking stuffer", "ugly sweater"] },
  11: { event: "Christmas + New Year", uploadNow: ["christmas mug", "new year goals", "winter cozy"] },
  12: { event: "Valentine's prep + New Year", uploadNow: ["valentines couple", "new year goals", "winter vibes"] },
};

// ============================================
// BEST MONTH TO UPLOAD
// ============================================
function getBestUploadMonth(months: any[]): { peakMonth: string; uploadMonth: string; weeksUntilPeak: number } | null {
  if (!months?.length) return null;
  let peakIdx = 0, peakVol = 0;
  months.forEach((m: any, i: number) => {
    if (m.volume > peakVol) { peakVol = m.volume; peakIdx = i; }
  });
  const uploadIdx = (peakIdx - 2 + 12) % 12;
  const currentIdx = new Date().getMonth();
  const weeksUntilPeak = ((peakIdx - currentIdx + 12) % 12) * 4;
  return {
    peakMonth: MONTHS[peakIdx],
    uploadMonth: MONTHS[uploadIdx],
    weeksUntilPeak,
  };
}

export default function TrendGraph() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  const nav = [
    { label: "POD Decision", path: "/dashboard", emoji: "🎯" },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈", active: true },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
  ];

  const currentMonth = new Date().getMonth();
  const SUGGESTIONS = getDynamicSuggestions();
  const insights = SEASONAL_INSIGHTS[currentMonth + 1];

  async function handleAnalyze(kw?: string) {
    const keyword = kw || query;
    if (!keyword.trim()) return;
    setQuery(keyword);
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

  const uploadInfo = result ? getBestUploadMonth(result.months) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
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
        .rk-sub { font-size: 13px; color: #475569; margin-bottom: 20px; }
        .rk-search-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .rk-input { flex: 1; background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 13px 18px; color: #e2e8f0; font-size: 14px; outline: none; font-family: inherit; transition: all 0.15s; }
        .rk-input::placeholder { color: #334155; }
        .rk-input:focus { border-color: rgba(129,140,248,0.6); box-shadow: 0 0 0 4px rgba(129,140,248,0.08); }
        .rk-btn { background: #6366f1; color: #fff; border: none; border-radius: 12px; padding: 13px 26px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.15s; }
        .rk-btn:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); }
        .rk-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .rk-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 24px; }
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
        
        /* SEASONAL ALERT */
        .rk-alert { background: rgba(251,146,60,0.08); border: 1px solid rgba(251,146,60,0.25); border-radius: 14px; padding: 18px 22px; margin-bottom: 24px; display: flex; gap: 16px; align-items: flex-start; }
        .rk-alert-icon { font-size: 28px; line-height: 1; flex-shrink: 0; }
        .rk-alert-content { flex: 1; }
        .rk-alert-title { font-size: 14px; font-weight: 700; color: #fb923c; margin-bottom: 4px; }
        .rk-alert-desc { font-size: 13px; color: #cbd5e1; margin-bottom: 10px; line-height: 1.5; }
        .rk-alert-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .rk-alert-tag { padding: 4px 10px; background: rgba(251,146,60,0.12); border: 1px solid rgba(251,146,60,0.25); border-radius: 20px; font-size: 11px; font-weight: 600; color: #fb923c; cursor: pointer; transition: all 0.12s; }
        .rk-alert-tag:hover { background: rgba(251,146,60,0.2); }
        
        /* UPLOAD STRATEGY */
        .rk-upload-banner { background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1)); border: 1px solid rgba(129,140,248,0.3); border-radius: 14px; padding: 22px 24px; margin-bottom: 16px; }
        .rk-upload-title { font-size: 11px; font-weight: 700; color: #a5b4fc; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
        .rk-upload-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .rk-upload-cell { }
        .rk-upload-cell-label { font-size: 10px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
        .rk-upload-cell-val { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.02em; }
        .rk-upload-cell-sub { font-size: 11px; color: #64748b; margin-top: 4px; }
        
        @keyframes rkfade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media (max-width: 768px) {
          .rk-upload-grid { grid-template-columns: 1fr; }
          .rk-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="rk">
        <aside className="rk-side">
          <div className="rk-logo">Mark<em>earn</em></div>
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
            <div className="rk-sub">See exactly when to upload designs for maximum seasonal sales.</div>

            {/* SEASONAL ALERT - what to upload NOW */}
            {insights && (
              <div className="rk-alert">
                <div className="rk-alert-icon">📅</div>
                <div className="rk-alert-content">
                  <div className="rk-alert-title">Upload for {insights.event} — list NOW to rank in time</div>
                  <div className="rk-alert-desc">Etsy needs 6–10 weeks to rank new listings. These niches are the priority for {MONTHS[currentMonth]}:</div>
                  <div className="rk-alert-tags">
                    {insights.uploadNow.map(tag => (
                      <button key={tag} className="rk-alert-tag" onClick={() => handleAnalyze(tag)}>→ {tag}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="rk-search-row">
              <input className="rk-input" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                placeholder='Try "halloween witch", "matcha lover", "boy mom era"' />
              <button className="rk-btn" onClick={() => handleAnalyze()} disabled={loading}>
                {loading ? "Loading..." : "Show Trend →"}
              </button>
            </div>

            <div className="rk-chips">
              {SUGGESTIONS.map(s => (
                <button key={s} className="rk-chip" onClick={() => handleAnalyze(s)}>{s}</button>
              ))}
            </div>

            {loading && <div className="rk-loading"><div className="rk-spinner" /><span style={{ fontSize: 13, color: "#475569" }}>Fetching 12 months of data...</span></div>}

            {noResult && <div style={{ textAlign: "center", padding: 32, color: "#334155", fontSize: 13 }}>No trend data for "{query}"</div>}

            {result && !loading && (
              <div className="rk-fade">
                {/* Verdict banner */}
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

                {/* UPLOAD STRATEGY BANNER */}
                {uploadInfo && (
                  <div className="rk-upload-banner">
                    <div className="rk-upload-title">🎯 Upload Strategy</div>
                    <div className="rk-upload-grid">
                      <div className="rk-upload-cell">
                        <div className="rk-upload-cell-label">Peak Sales Month</div>
                        <div className="rk-upload-cell-val" style={{ color: "#34d399" }}>{uploadInfo.peakMonth}</div>
                        <div className="rk-upload-cell-sub">Highest demand window</div>
                      </div>
                      <div className="rk-upload-cell">
                        <div className="rk-upload-cell-label">Best Time to Upload</div>
                        <div className="rk-upload-cell-val" style={{ color: "#a5b4fc" }}>{uploadInfo.uploadMonth}</div>
                        <div className="rk-upload-cell-sub">8 weeks before peak (ranking time)</div>
                      </div>
                      <div className="rk-upload-cell">
                        <div className="rk-upload-cell-label">Weeks to Peak</div>
                        <div className="rk-upload-cell-val" style={{ color: uploadInfo.weeksUntilPeak < 8 ? "#f87171" : uploadInfo.weeksUntilPeak < 16 ? "#fbbf24" : "#34d399" }}>{uploadInfo.weeksUntilPeak}w</div>
                        <div className="rk-upload-cell-sub">{uploadInfo.weeksUntilPeak < 8 ? "🚨 Already late — upload TODAY" : uploadInfo.weeksUntilPeak < 16 ? "⚠️ Upload in next 2 weeks" : "✅ Plenty of time"}</div>
                      </div>
                    </div>
                  </div>
                )}

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
                    {MONTHS.map((m, i) => {
                      const monthData = result.months?.[i];
                      const vol = monthData?.volume || 0;
                      const isPeak = uploadInfo && m === uploadInfo.peakMonth;
                      const isUpload = uploadInfo && m === uploadInfo.uploadMonth;
                      const isCurrent = i === currentMonth;
                      let bg = "rgba(255,255,255,0.02)", borderC = "rgba(255,255,255,0.05)";
                      if (isPeak) { bg = "rgba(52,211,153,0.1)"; borderC = "rgba(52,211,153,0.3)"; }
                      else if (isUpload) { bg = "rgba(129,140,248,0.1)"; borderC = "rgba(129,140,248,0.3)"; }
                      else if (isCurrent) { bg = "rgba(255,255,255,0.04)"; borderC = "rgba(255,255,255,0.1)"; }
                      return (
                        <div key={m} className="rk-cal-item" style={{ background: bg, borderColor: borderC }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: isPeak ? "#34d399" : isUpload ? "#a5b4fc" : isCurrent ? "#cbd5e1" : "#475569", marginBottom: 4 }}>
                            {m} {isCurrent && "·"}
                          </div>
                          <div style={{ fontSize: 10, color: "#475569" }}>
                            {isPeak ? "🎯 PEAK" : isUpload ? "📤 UPLOAD" : isCurrent ? "Now" : vol > 0 ? vol.toLocaleString() : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && !noResult && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.15 }}>📈</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Ready to analyze</div>
                <div style={{ fontSize: 13, color: "#1e293b" }}>Enter a keyword to see monthly trends + best upload month</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}