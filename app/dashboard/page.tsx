"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LIVE = ["2,847 sellers online now", "143 searches this minute", "89 listings optimized today", "1,204 tags generated today"];

function getPODVerdict(volume: string, competition: string, trend: string, keyword: string) {
  const vol = parseInt(volume?.replace(/[^0-9]/g, "") || "0");
  const isGeneric = ["candle", "mug", "shirt", "hoodie", "tshirt", "poster"].includes(keyword.toLowerCase().trim());
  const isHighComp = competition === "High";
  const isRising = trend?.startsWith("↑");
  const hasVolume = vol > 1000;

  if (isGeneric && isHighComp) {
    return {
      verdict: "Avoid for POD",
      emoji: "🚫",
      color: "#f87171",
      bg: "rgba(248,113,113,0.06)",
      border: "rgba(248,113,113,0.2)",
      reasons: [
        "Keyword too generic — impossible to differentiate",
        "Extreme saturation — thousands of similar designs already",
        "Margins crushed by competition",
      ],
      design: [],
      avoid: ["Designs without a specific angle", "Generic text without humor or niche", "Copying existing bestsellers"],
    };
  }

  if (!hasVolume) {
    return {
      verdict: "Possible with strong niche",
      emoji: "⚠️",
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.06)",
      border: "rgba(251,191,36,0.2)",
      reasons: [
        "Low demand — niche market only",
        "Little competition — easy to rank if well targeted",
        "Works well with strong personalization",
      ],
      design: [
        `${keyword} with humor or unique quote`,
        `Personalized with name or date`,
        `Combined with another niche (e.g. ${keyword} + nurse)`,
      ],
      avoid: ["Designs without personalization", "Waiting for high volume that won't come"],
    };
  }

  if (isHighComp && !isRising) {
    return {
      verdict: "Possible with strong niche",
      emoji: "⚠️",
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.06)",
      border: "rgba(251,191,36,0.2)",
      reasons: [
        "Good demand but high saturation",
        "Profitable only with a very specific angle",
        "Personalization is your only weapon here",
      ],
      design: [
        `Micro-niche: ${keyword} + profession/breed/region`,
        `Humor specific to the community`,
        `Premium minimalist designs`,
      ],
      avoid: ["Generic designs on this keyword", "Pricing too low against big sellers", "No personalization"],
    };
  }

  return {
    verdict: "Great POD Opportunity",
    emoji: "✅",
    color: "#34d399",
    bg: "rgba(52,211,153,0.06)",
    border: "rgba(52,211,153,0.2)",
    reasons: [
      `Solid demand${isRising ? " and growing" : ""} — active buyers in this niche`,
      competition === "Low" ? "Low competition — easy to rank quickly" : "Manageable competition with the right angle",
      "Personalizable and differentiable niche",
    ],
    design: [
      `${keyword} with humorous or motivational quote`,
      `${keyword} + event (birthday, Christmas, Mother's Day)`,
      `Premium minimalist designs with ${keyword}`,
      `${keyword} + secondary profession or hobby`,
    ],
    avoid: ["Too generic designs", "Copying bestsellers without a unique angle"],
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [searched, setSearched] = useState("");
  const [limitError, setLimitError] = useState("");
  const [liveIdx, setLiveIdx] = useState(0);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setLiveIdx(i => (i + 1) % LIVE.length), 3500);
    return () => clearInterval(t);
  }, []);

  async function handleAnalyze() {
    if (!query.trim()) return;
    setLoading(true); setNoResult(false); setResult(null); setLimitError(""); setShowData(false);
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: query.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.error === "trial_expired") setLimitError("Your trial has expired. Upgrade to continue.");
      else if (data.error === "limit_reached") setLimitError(data.message);
      else if (data.error || !data.related?.length) setNoResult(true);
      else { setResult(data); setSearched(query); }
    } catch { setNoResult(true); }
    setLoading(false);
  }

  const nav = [
    { label: "POD Decision", path: "/dashboard", emoji: "🎯", active: true },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
  ];

  const chips = ["dog mom", "nurse gift", "teacher gift", "halloween witch", "cat lover", "birthday queen", "vintage retro", "funny dad"];
  const verdict = result ? getPODVerdict(result.volume, result.competition, result.trend, searched) : null;

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
        .rk-upgrade-btn { width: 100%; padding: 10px 16px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: opacity 0.15s; }
        .rk-upgrade-btn:hover { opacity: 0.88; }
        .rk-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .rk-topbar { height: 48px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 36px; background: #0f1623; flex-shrink: 0; }
        .rk-content { flex: 1; padding: 36px 40px; overflow-y: auto; }
        .rk-hero-title { font-size: 22px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.025em; margin-bottom: 6px; }
        .rk-hero-sub { font-size: 13px; color: #475569; margin-bottom: 28px; }
        .rk-search-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .rk-input { flex: 1; background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 13px 18px; color: #e2e8f0; font-size: 14px; outline: none; font-family: inherit; transition: all 0.15s; }
        .rk-input::placeholder { color: #334155; }
        .rk-input:focus { border-color: rgba(129,140,248,0.6); box-shadow: 0 0 0 4px rgba(129,140,248,0.08); }
        .rk-btn { background: #6366f1; color: #fff; border: none; border-radius: 12px; padding: 13px 26px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.15s; }
        .rk-btn:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.3); }
        .rk-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .rk-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 36px; }
        .rk-chip { padding: 6px 14px; border-radius: 20px; background: #1e293b; border: 1px solid rgba(255,255,255,0.07); color: #475569; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.12s; font-family: inherit; }
        .rk-chip:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
        .rk-verdict { border-radius: 16px; padding: 24px 28px; margin-bottom: 20px; }
        .rk-verdict-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .rk-verdict-emoji { font-size: 28px; }
        .rk-verdict-title { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
        .rk-verdict-reasons { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .rk-verdict-reason { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #cbd5e1; line-height: 1.5; }
        .rk-verdict-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .rk-design-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
        .rk-design-card { background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #94a3b8; line-height: 1.5; border: 1px solid rgba(255,255,255,0.05); }
        .rk-design-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
        .rk-data-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #475569; background: none; border: none; font-family: inherit; padding: 0; margin-bottom: 20px; transition: color 0.15s; }
        .rk-data-toggle:hover { color: #94a3b8; }
        .rk-stats { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; margin-bottom: 20px; }
        .rk-stat { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; }
        .rk-stat-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 12px; }
        .rk-stat-val { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
        .rk-stat-sub { font-size: 12px; font-weight: 500; }
        .rk-table-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; }
        .rk-table-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .rk-table-title { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; }
        table.rkt { width: 100%; border-collapse: collapse; }
        table.rkt th { text-align: left; padding: 10px 22px; font-size: 11px; font-weight: 600; color: #334155; letter-spacing: 0.07em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); }
        table.rkt td { padding: 12px 22px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); }
        table.rkt tr:last-child td { border-bottom: none; }
        table.rkt tr:hover td { background: rgba(255,255,255,0.02); }
        .rk-error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .rk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 20px; }
        .rk-spinner { width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .rk-fade { animation: rkfade 0.35s ease; }
        .rk-result-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="rk-dot" style={{ background: "#fbbf24" }} />
              <span style={{ fontSize: 12, color: "#475569" }}>{LIVE[liveIdx]}</span>
            </div>
            <span style={{ fontSize: 12, color: "#334155" }}>Rankify · Real-time POD decisions</span>
          </div>

          <div className="rk-content">
            <div className="rk-hero-title">Stop designing blind.</div>
            <div className="rk-hero-sub">Sell what POD buyers are already searching for — clear decision in 10 seconds.</div>

            <div className="rk-search-row">
              <input className="rk-input" value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                placeholder='Enter a niche — "dog mom", "nurse gift", "halloween witch"...' />
              <button className="rk-btn" onClick={handleAnalyze} disabled={loading}>
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
                <span style={{ fontSize: 13, color: "#fca5a5" }}>{limitError}</span>
                <button onClick={() => router.push("/pricing")}
                  style={{ background: "#6366f1", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Upgrade →
                </button>
              </div>
            )}

            {loading && (
              <div className="rk-loading">
                <div className="rk-spinner" />
                <span style={{ fontSize: 13, color: "#475569" }}>Analyzing POD market...</span>
              </div>
            )}

            {noResult && !loading && (
              <div style={{ textAlign: "center", padding: "32px", color: "#334155", fontSize: 13 }}>
                No data for "{query}" — try a different keyword
              </div>
            )}

            {result && !loading && verdict && (
              <div className="rk-fade">
                <div className="rk-result-bar">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="rk-dot" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399" }}>Live</span>
                    <span style={{ fontSize: 12, color: "#475569" }}>· "{searched}"</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {result.searchesLeft !== undefined && (
                      <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "rgba(129,140,248,0.1)", color: "#818cf8", fontWeight: 600 }}>
                        {result.searchesLeft} analyses left
                      </span>
                    )}
                    <button onClick={() => { setResult(null); setQuery(""); setSearched(""); setShowData(false); }}
                      style={{ fontSize: 12, color: "#334155", cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}>
                      ✕ Clear
                    </button>
                  </div>
                </div>

                <div className="rk-verdict" style={{ background: verdict.bg, border: `1px solid ${verdict.border}` }}>
                  <div className="rk-verdict-header">
                    <span className="rk-verdict-emoji">{verdict.emoji}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: verdict.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>POD Verdict</div>
                      <div className="rk-verdict-title" style={{ color: verdict.color }}>{verdict.verdict}</div>
                    </div>
                  </div>

                  <div className="rk-verdict-reasons">
                    {verdict.reasons.map((r: string, i: number) => (
                      <div key={i} className="rk-verdict-reason">
                        <div className="rk-verdict-dot" style={{ background: verdict.color }} />
                        {r}
                      </div>
                    ))}
                  </div>

                  {verdict.design.length > 0 && (
                    <div className="rk-design-grid">
                      <div>
                        <div className="rk-design-label" style={{ color: verdict.color }}>✏️ What to design</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {verdict.design.map((d: string, i: number) => (
                            <div key={i} className="rk-design-card">→ {d}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="rk-design-label" style={{ color: "#f87171" }}>🚫 What to avoid</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {verdict.avoid.map((d: string, i: number) => (
                            <div key={i} className="rk-design-card">✕ {d}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button className="rk-data-toggle" onClick={() => setShowData(!showData)}>
                  <span style={{ fontSize: 16 }}>{showData ? "▾" : "▸"}</span>
                  {showData ? "Hide data" : "View data (proof)"}
                </button>

                {showData && (
                  <div className="rk-fade">
                    <div className="rk-stats">
                      {[
                        { label: "Monthly Searches", value: result.volume, sub: result.trend, color: result.trend?.startsWith("↑") ? "#34d399" : result.trend?.startsWith("↓") ? "#f87171" : "#fbbf24" },
                        { label: "Competition", value: result.competition, sub: `Score ${result.compScore}/100`, color: result.competition === "Low" ? "#34d399" : result.competition === "Medium" ? "#fbbf24" : "#f87171" },
                        { label: "Opportunity", value: result.opportunity, sub: "Real-time analysis", color: "#a5b4fc" },
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
                        <div className="rk-dot" />
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
                            const compMap: Record<string, {bg: string; text: string; border: string}> = {
                              Low: { bg: "#0d2b1f", text: "#34d399", border: "#065f46" },
                              Medium: { bg: "#2b1f06", text: "#fbbf24", border: "#78350f" },
                              High: { bg: "#2b0f0f", text: "#f87171", border: "#7f1d1d" },
                            };
                            const cc = compMap[row.comp] || compMap.High;
                            const tc = row.trend?.startsWith("↑") ? "#34d399" : row.trend?.startsWith("↓") ? "#f87171" : "#fbbf24";
                            return (
                              <tr key={i}>
                                <td style={{ color: "#c7d2fe", fontWeight: 600 }}>{row.kw}</td>
                                <td style={{ color: "#64748b" }}>{row.vol}</td>
                                <td>
                                  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: cc.bg, color: cc.text, border: `1px solid ${cc.border}` }}>
                                    {row.comp}
                                  </span>
                                </td>
                                <td style={{ color: tc, fontWeight: 600 }}>{row.trend}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!result && !noResult && !loading && !limitError && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.15 }}>🎯</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#334155", marginBottom: 8 }}>Ready to analyze</div>
                <div style={{ fontSize: 13, color: "#1e293b", maxWidth: 320, lineHeight: 1.6 }}>
                  Enter a POD niche to get a clear decision — what to design, what to avoid.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}