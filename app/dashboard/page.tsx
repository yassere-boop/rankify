"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LIVE = ["2,847 sellers online now", "143 searches this minute", "89 listings optimized today", "1,204 tags generated today"];

export default function Dashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [searched, setSearched] = useState("");
  const [limitError, setLimitError] = useState("");
  const [liveIdx, setLiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLiveIdx(i => (i + 1) % LIVE.length), 3500);
    return () => clearInterval(t);
  }, []);

  async function handleAnalyze() {
    if (!query.trim()) return;
    setLoading(true); setNoResult(false); setResult(null); setLimitError("");
    try {
      const res = await fetch("/api/keywords", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyword: query.trim().toLowerCase() }) });
      const data = await res.json();
      if (data.error === "trial_expired") setLimitError("Your free trial has expired. Upgrade to continue.");
      else if (data.error === "limit_reached") setLimitError(data.message);
      else if (data.error || !data.related?.length) setNoResult(true);
      else { setResult(data); setSearched(query); }
    } catch { setNoResult(true); }
    setLoading(false);
  }

  const nav = [
    { label: "Keyword Research", path: "/dashboard", active: true, emoji: "🔍" },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
  ];

  const chips = ["dog mom", "candle", "mug", "tshirt", "jewelry", "wedding", "hoodie", "poster"];

  const compColors: any = {
    Low: { bg: "#0d2b1f", text: "#34d399", border: "#065f46" },
    Medium: { bg: "#2b1f06", text: "#fbbf24", border: "#78350f" },
    High: { bg: "#2b0f0f", text: "#f87171", border: "#7f1d1d" },
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
        .rk-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; flex-shrink: 0; }
        .rk-dot-pulse { animation: dpulse 2s ease infinite; }
        .rk-live-label { font-size: 11px; font-weight: 500; color: #34d399; letter-spacing: 0.04em; }
        .rk-section-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.2); letter-spacing: 0.12em; text-transform: uppercase; padding: 0 6px; margin-bottom: 6px; }
        .rk-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .rk-navbtn { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; background: none; color: #64748b; font-size: 13px; font-weight: 500; width: 100%; text-align: left; transition: all 0.15s; font-family: inherit; }
        .rk-navbtn:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
        .rk-navbtn-active { background: rgba(129,140,248,0.12) !important; border-color: rgba(129,140,248,0.25) !important; color: #a5b4fc !important; }
        .rk-navbtn-emoji { font-size: 14px; width: 20px; text-align: center; }
        .rk-new-badge { margin-left: auto; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: rgba(251,146,60,0.18); color: #fb923c; letter-spacing: 0.06em; }
        .rk-upgrade { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .rk-upgrade-btn { width: 100%; padding: 10px 16px; border-radius: 10px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #fff; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: opacity 0.15s; letter-spacing: 0.01em; }
        .rk-upgrade-btn:hover { opacity: 0.88; }
        .rk-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .rk-topbar { height: 48px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 36px; background: #0f1623; flex-shrink: 0; }
        .rk-topbar-live { display: flex; align-items: center; gap: 8px; }
        .rk-topbar-txt { font-size: 12px; color: #475569; }
        .rk-topbar-powered { font-size: 12px; color: #334155; }
        .rk-content { flex: 1; padding: 36px 40px; overflow-y: auto; }
        .rk-hero { margin-bottom: 28px; }
        .rk-hero-title { font-size: 22px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.025em; margin-bottom: 6px; }
        .rk-hero-sub { font-size: 13px; color: #475569; }
        .rk-search-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .rk-input { flex: 1; background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 13px 18px; color: #e2e8f0; font-size: 14px; outline: none; font-family: inherit; transition: all 0.15s; }
        .rk-input::placeholder { color: #334155; }
        .rk-input:focus { border-color: rgba(129,140,248,0.6); background: #1e293b; box-shadow: 0 0 0 4px rgba(129,140,248,0.08); }
        .rk-analyze-btn { background: #6366f1; color: #fff; border: none; border-radius: 12px; padding: 13px 26px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.15s; letter-spacing: 0.01em; }
        .rk-analyze-btn:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.3); }
        .rk-analyze-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .rk-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 36px; }
        .rk-chip { padding: 6px 14px; border-radius: 20px; background: #1e293b; border: 1px solid rgba(255,255,255,0.07); color: #475569; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.12s; font-family: inherit; }
        .rk-chip:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
        .rk-error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .rk-error-txt { font-size: 13px; color: #fca5a5; }
        .rk-error-btn { background: #6366f1; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; }
        .rk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 20px; }
        .rk-spinner { width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .rk-loading-txt { font-size: 13px; color: #475569; }
        .rk-stats { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; margin-bottom: 20px; }
        .rk-stat { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; transition: border-color 0.15s; }
        .rk-stat:hover { border-color: rgba(129,140,248,0.25); }
        .rk-stat-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 12px; }
        .rk-stat-val { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 5px; }
        .rk-stat-sub { font-size: 12px; font-weight: 500; }
        .rk-result-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .rk-live-indicator { display: flex; align-items: center; gap: 8px; }
        .rk-live-txt { font-size: 12px; font-weight: 600; color: #34d399; }
        .rk-kw-txt { font-size: 12px; color: #475569; }
        .rk-right-bar { display: flex; align-items: center; gap: 12px; }
        .rk-searches-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; background: rgba(129,140,248,0.1); color: #818cf8; }
        .rk-clear-btn { font-size: 12px; color: #334155; cursor: pointer; background: none; border: none; font-family: inherit; transition: color 0.1s; }
        .rk-clear-btn:hover { color: #94a3b8; }
        .rk-table-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; }
        .rk-table-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .rk-table-title { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; }
        table.rkt { width: 100%; border-collapse: collapse; }
        table.rkt th { text-align: left; padding: 10px 22px; font-size: 11px; font-weight: 600; color: #334155; letter-spacing: 0.07em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); }
        table.rkt td { padding: 12px 22px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); }
        table.rkt tr:last-child td { border-bottom: none; }
        table.rkt tr:hover td { background: rgba(255,255,255,0.02); }
        .rk-kw-cell { color: #c7d2fe; font-weight: 600; font-size: 13px; }
        .rk-vol-cell { color: #475569; font-size: 13px; }
        .rk-comp-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid; }
        .rk-trend-cell { font-weight: 600; font-size: 13px; }
        .rk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 260px; text-align: center; }
        .rk-empty-emoji { font-size: 36px; margin-bottom: 16px; opacity: 0.3; }
        .rk-empty-title { font-size: 15px; font-weight: 600; color: #334155; margin-bottom: 6px; }
        .rk-empty-sub { font-size: 13px; color: #1e293b; }
        .rk-fade { animation: rkfade 0.35s ease; }
        @keyframes rkfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rk">
        {/* Sidebar */}
        <aside className="rk-side">
          <div className="rk-logo">Rank<em>ify</em></div>
          <div className="rk-live-row">
            <div className="rk-dot rk-dot-pulse" />
            <span className="rk-live-label">Live data</span>
          </div>

          <div className="rk-section-label">Tools</div>
          <nav className="rk-nav">
            {nav.map(item => (
              <button key={item.path} onClick={() => router.push(item.path)}
                className={`rk-navbtn ${item.active ? "rk-navbtn-active" : ""}`}>
                <span className="rk-navbtn-emoji">{item.emoji}</span>
                <span>{item.label}</span>
                {item.badge && <span className="rk-new-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="rk-upgrade">
            <button className="rk-upgrade-btn" onClick={() => router.push("/pricing")}>
              ↑ Upgrade Plan
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="rk-main">
          {/* Topbar */}
          <div className="rk-topbar">
            <div className="rk-topbar-live">
              <div className="rk-dot rk-dot-pulse" style={{ background: "#fbbf24" }} />
              <span className="rk-topbar-txt">{LIVE[liveIdx]}</span>
            </div>
            <span className="rk-topbar-powered">Powered by DataForSEO</span>
          </div>

          {/* Content */}
          <div className="rk-content">
            <div className="rk-hero">
              <div className="rk-hero-title">Keyword Intelligence</div>
              <div className="rk-hero-sub">Real search volume · Competition index · Market opportunity</div>
            </div>

            <div className="rk-search-row">
              <input className="rk-input" value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                placeholder='Try "dog mom shirt", "candle gift", "wedding mug"...' />
              <button className="rk-analyze-btn" onClick={handleAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze →"}
              </button>
            </div>

            {!result && !limitError && (
              <div className="rk-chips">
                {chips.map(c => (
                  <button key={c} className="rk-chip" onClick={() => setQuery(c)}>{c}</button>
                ))}
              </div>
            )}

            {limitError && (
              <div className="rk-error-box">
                <span className="rk-error-txt">{limitError}</span>
                <button className="rk-error-btn" onClick={() => router.push("/pricing")}>Upgrade →</button>
              </div>
            )}

            {loading && (
              <div className="rk-loading">
                <div className="rk-spinner" />
                <span className="rk-loading-txt">Fetching live market data...</span>
              </div>
            )}

            {noResult && !loading && (
              <div style={{ textAlign: "center", padding: "32px", color: "#334155", fontSize: 13 }}>
                No data found for "{query}" — try a different keyword
              </div>
            )}

            {result && !loading && (
              <div className="rk-fade">
                <div className="rk-result-bar">
                  <div className="rk-live-indicator">
                    <div className="rk-dot rk-dot-pulse" />
                    <span className="rk-live-txt">Live</span>
                    <span className="rk-kw-txt">· "{searched}"</span>
                  </div>
                  <div className="rk-right-bar">
                    {result.searchesLeft !== undefined && (
                      <span className="rk-searches-badge">{result.searchesLeft} searches left</span>
                    )}
                    <button className="rk-clear-btn" onClick={() => { setResult(null); setQuery(""); setSearched(""); }}>✕ Clear</button>
                  </div>
                </div>

                <div className="rk-stats">
                  {[
                    { label: "Monthly Searches", value: result.volume, sub: result.trend, color: result.trend?.startsWith("↑") ? "#34d399" : result.trend?.startsWith("↓") ? "#f87171" : "#fbbf24" },
                    { label: "Competition", value: result.competition, sub: `Score ${result.compScore}/100`, color: result.competition === "Low" ? "#34d399" : result.competition === "Medium" ? "#fbbf24" : "#f87171" },
                    { label: "Opportunity", value: result.opportunity, sub: "Based on live data", color: "#a5b4fc" },
                  ].map((s, i) => (
                    <div key={i} className="rk-stat">
                      <div className="rk-stat-label">{s.label}</div>
                      <div className="rk-stat-val" style={{ color: s.color }}>{s.value}</div>
                      <div className="rk-stat-sub" style={{ color: s.color, opacity: 0.65 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="rk-table-card">
                  <div className="rk-table-head">
                    <span className="rk-table-title">Related Keywords — {result.related.length} results</span>
                    <div className="rk-dot rk-dot-pulse" />
                  </div>
                  <table className="rkt">
                    <thead>
                      <tr>
                        <th>Keyword</th>
                        <th>Searches/mo</th>
                        <th>Competition</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.related.map((row: any, i: number) => {
                        const cc = compColors[row.comp] || compColors.High;
                        const tc = row.trend?.startsWith("↑") ? "#34d399" : row.trend?.startsWith("↓") ? "#f87171" : "#fbbf24";
                        return (
                          <tr key={i}>
                            <td className="rk-kw-cell">{row.kw}</td>
                            <td className="rk-vol-cell">{row.vol}</td>
                            <td>
                              <span className="rk-comp-pill" style={{ background: cc.bg, color: cc.text, borderColor: cc.border }}>
                                {row.comp}
                              </span>
                            </td>
                            <td className="rk-trend-cell" style={{ color: tc }}>{row.trend}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!result && !noResult && !loading && !limitError && (
              <div className="rk-empty">
                <div className="rk-empty-emoji">🔍</div>
                <div className="rk-empty-title">Ready to analyze</div>
                <div className="rk-empty-sub">Enter any keyword to unlock live market intelligence</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}