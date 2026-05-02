"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DashLayout from "../components/DashLayout";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

function getBestUploadMonth(months: any[]) {
  if (!months?.length) return null;
  let peakIdx = 0, peakVol = 0;
  months.forEach((m: any, i: number) => { if (m.volume > peakVol) { peakVol = m.volume; peakIdx = i; } });
  const uploadIdx = (peakIdx - 2 + 12) % 12;
  const currentIdx = new Date().getMonth();
  const weeksUntilPeak = ((peakIdx - currentIdx + 12) % 12) * 4;
  return { peakMonth: MONTHS[peakIdx], uploadMonth: MONTHS[uploadIdx], weeksUntilPeak };
}

export default function TrendGraph() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  const currentMonth = new Date().getMonth();
  const SUGGESTIONS = getDynamicSuggestions();
  const insights = SEASONAL_INSIGHTS[currentMonth + 1];

  async function handleAnalyze(kw?: string) {
    const keyword = kw || query;
    if (!keyword.trim()) return;
    setQuery(keyword);
    setLoading(true); setNoResult(false); setResult(null);
    try {
      const res = await fetch("/api/trends", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyword: keyword.trim().toLowerCase() }) });
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
    const width = 600, height = 180;
    const pad = { top: 16, bottom: 36, left: 48, right: 16 };
    const gw = width - pad.left - pad.right;
    const gh = height - pad.top - pad.bottom;
    const step = gw / (months.length - 1);
    const points = months.map((m: any, i: number) => ({ x: pad.left + i * step, y: pad.top + gh - (m.volume / max) * gh, volume: m.volume, month: m.month }));
    const pathD = points.map((p: any, i: number) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(" ");
    const areaD = `${pathD} L ${points[points.length - 1].x} ${pad.top + gh} L ${points[0].x} ${pad.top + gh} Z`;
    const color = result.verdict === "Rising" ? "#34d399" : result.verdict === "Declining" ? "#f87171" : "#fbbf24";
    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
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
            <circle cx={p.x} cy={p.y} r="3" fill={color} opacity="0.85" />
            <text x={p.x} y={height - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">{p.month.slice(0, 3)}</text>
          </g>
        ))}
      </svg>
    );
  }

  const uploadInfo = result ? getBestUploadMonth(result.months) : null;

  return (
    <DashLayout topbarLabel="Trend Analyzer · 12-month search data">
      <div className="dash-hero-title">Know <em>when to upload.</em></div>
      <div className="dash-hero-sub">See exactly when to launch designs for maximum seasonal sales.</div>

      {/* SEASONAL ALERT */}
      {insights && (
        <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", gap: 16, alignItems: "flex-start", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>📅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fb923c", marginBottom: 4 }}>Upload for {insights.event} — list NOW to rank in time</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 12, lineHeight: 1.5 }}>POD platforms need 6–10 weeks to rank new listings. These niches are the priority for {MONTHS[currentMonth]}:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {insights.uploadNow.map((tag) => (
                <button key={tag} onClick={() => handleAnalyze(tag)} style={{ padding: "5px 12px", background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 999, fontSize: 11, fontWeight: 600, color: "#fb923c", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>→ {tag}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="dash-search-row">
        <input className="dash-input" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} placeholder='Try "halloween witch", "matcha lover", "boy mom era"' />
        <button className="dash-btn" onClick={() => handleAnalyze()} disabled={loading}>{loading ? "Loading..." : (<>Show Trend<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></>)}</button>
      </div>

      {!result && !loading && (
        <div className="dash-chips">
          {SUGGESTIONS.map((s) => (<button key={s} className="dash-chip" onClick={() => handleAnalyze(s)}>{s}</button>))}
        </div>
      )}

      {loading && <div className="dash-loading"><div className="dash-spinner" /><span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Fetching 12 months of data...</span></div>}

      {noResult && <div style={{ textAlign: "center", padding: 32, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No trend data for "{query}"</div>}

      {result && !loading && (
        <div className="fade-up">
          {/* VERDICT BANNER */}
          <div style={{ background: verdictConfig[result.verdict]?.bg, border: `1px solid ${verdictConfig[result.verdict]?.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 18, backdropFilter: "blur(12px)" }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: verdictConfig[result.verdict]?.color }}>{verdictConfig[result.verdict]?.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: verdictConfig[result.verdict]?.color, fontSize: 16 }}>{result.verdict} — {result.trendPct > 0 ? "+" : ""}{result.trendPct}% last month</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>
                {result.verdict === "Rising" ? "Growing keyword — great time to enter" : result.verdict === "Stable" ? "Consistent demand with no major changes" : "Declining — consider a different niche"}
              </div>
            </div>
          </div>

          {/* UPLOAD STRATEGY BANNER */}
          {uploadInfo && (
            <div style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(244,114,182,0.04))", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 16, padding: "24px 26px", marginBottom: 16, backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14, background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>🎯 Upload Strategy</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Peak Sales Month</div>
                  <div className="serif" style={{ fontSize: 36, color: "#34d399", lineHeight: 1 }}>{uploadInfo.peakMonth}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>Highest demand window</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Best Time to Upload</div>
                  <div className="serif" style={{ fontSize: 36, color: "#c4b5fd", lineHeight: 1 }}>{uploadInfo.uploadMonth}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>8 weeks before peak</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Weeks to Peak</div>
                  <div className="serif" style={{ fontSize: 36, color: uploadInfo.weeksUntilPeak < 8 ? "#f87171" : uploadInfo.weeksUntilPeak < 16 ? "#fbbf24" : "#34d399", lineHeight: 1 }}>{uploadInfo.weeksUntilPeak}w</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{uploadInfo.weeksUntilPeak < 8 ? "🚨 Already late" : uploadInfo.weeksUntilPeak < 16 ? "⚠️ Upload soon" : "✅ Plenty of time"}</div>
                </div>
              </div>
            </div>
          )}

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
            {[
              { label: "Current Volume", value: result.current?.toLocaleString(), color: "white" },
              { label: "12-mo Average", value: result.avg?.toLocaleString(), color: "white" },
              { label: "Peak Volume", value: result.max?.toLocaleString(), color: "white" },
              { label: "Trend", value: result.verdict, color: verdictConfig[result.verdict]?.color },
            ].map((s, i) => (
              <div key={i} className="dash-card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>{s.label}</div>
                <div className="serif" style={{ fontSize: 28, color: s.color, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* GRAPH */}
          <div className="dash-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>12-Month Search Volume — "{result.keyword}"</div>
            {renderGraph()}
          </div>

          {/* CALENDAR */}
          <div className="dash-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Seasonal Calendar</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {MONTHS.map((m, i) => {
                const monthData = result.months?.[i];
                const vol = monthData?.volume || 0;
                const isPeak = uploadInfo && m === uploadInfo.peakMonth;
                const isUpload = uploadInfo && m === uploadInfo.uploadMonth;
                const isCurrent = i === currentMonth;
                let bg = "rgba(255,255,255,0.02)", borderC = "rgba(255,255,255,0.04)";
                if (isPeak) { bg = "rgba(52,211,153,0.08)"; borderC = "rgba(52,211,153,0.25)"; }
                else if (isUpload) { bg = "rgba(167,139,250,0.08)"; borderC = "rgba(167,139,250,0.25)"; }
                else if (isCurrent) { bg = "rgba(255,255,255,0.04)"; borderC = "rgba(255,255,255,0.1)"; }
                return (
                  <div key={m} style={{ borderRadius: 10, padding: "10px 12px", border: `1px solid ${borderC}`, background: bg }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: isPeak ? "#34d399" : isUpload ? "#c4b5fd" : isCurrent ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", marginBottom: 4 }}>{m} {isCurrent && "·"}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{isPeak ? "🎯 PEAK" : isUpload ? "📤 UPLOAD" : isCurrent ? "Now" : vol > 0 ? vol.toLocaleString() : ""}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && !noResult && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.15 }}>↗</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Ready to analyze</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Enter a keyword to see monthly trends + best upload month</div>
        </div>
      )}
    </DashLayout>
  );
}