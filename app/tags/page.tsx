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

  const nav = [
    { label: "Keyword Research", path: "/dashboard", emoji: "🔍" },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️", active: true },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
  ];

  async function handleGenerate(kw?: string) {
    const keyword = kw || query;
    if (!keyword.trim()) return;
    setLoading(true); setNoResult(false); setResult(null);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: keyword.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.error || !data.tags?.length) setNoResult(true);
      else setResult(data);
    } catch { setNoResult(true); }
    setLoading(false);
  }

  function copyAll() {
    if (!result) return;
    navigator.clipboard.writeText(result.tags.map((t: any) => t.tag).join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const scoreColor = (score: number) => score >= 60 ? "#34d399" : score >= 30 ? "#fbbf24" : "#f87171";
  const scoreBg = (score: number) => score >= 60 ? "rgba(52,211,153,0.1)" : score >= 30 ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)";
  const scoreBorder = (score: number) => score >= 60 ? "rgba(52,211,153,0.25)" : score >= 30 ? "rgba(251,191,36,0.25)" : "rgba(248,113,113,0.25)";
  const compColor = (c: string) => c === "Low" ? "#34d399" : c === "Medium" ? "#fbbf24" : "#f87171";

  const suggestions = ["dog mom shirt", "cat lover mug", "nurse gift", "teacher appreciation", "halloween witch", "christmas funny", "birthday queen", "vintage retro"];

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
        .rk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 16px; }
        .rk-spinner { width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .rk-fade { animation: rkfade 0.35s ease; }
        table.rkt { width: 100%; border-collapse: collapse; }
        table.rkt th { text-align: left; padding: 10px 0; font-size: 11px; font-weight: 600; color: #334155; letter-spacing: 0.07em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); }
        table.rkt td { padding: 12px 0; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); }
        table.rkt tr:last-child td { border-bottom: none; }
        table.rkt tr:hover td { background: rgba(255,255,255,0.01); }
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
            <span style={{ fontSize: 12, color: "#334155" }}>Tag Generator · Ranked by search volume</span>
          </div>
          <div className="rk-content">
            <div className="rk-title">🏷️ Tag Generator</div>
            <div className="rk-sub">Generate 13 optimized Etsy tags instantly — ranked by volume & competition</div>

            <div className="rk-search-row">
              <input className="rk-input" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
                placeholder='e.g. "dog mom shirt", "custom mug", "nurse gift"' />
              <button className="rk-btn" onClick={() => handleGenerate()} disabled={loading}>
                {loading ? "Generating..." : "Generate Tags →"}
              </button>
            </div>

            <div className="rk-chips">
              {suggestions.map(s => (
                <button key={s} className="rk-chip" onClick={() => { setQuery(s); handleGenerate(s); }}>{s}</button>
              ))}
            </div>

            {loading && <div className="rk-loading"><div className="rk-spinner" /><span style={{ fontSize: 13, color: "#475569" }}>Generating optimized tags...</span></div>}
            {noResult && <div style={{ textAlign: "center", padding: 32, color: "#334155", fontSize: 13 }}>Could not generate tags for "{query}" — try another keyword</div>}

            {result && !loading && (
              <div className="rk-fade">
                <div className="rk-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", textTransform: "capitalize" }}>{result.product}</div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{result.tags.length} tags generated — sorted by score</div>
                    </div>
                    <button onClick={copyAll}
                      style={{ padding: "8px 16px", borderRadius: 8, background: copied ? "#065f46" : "#6366f1", color: copied ? "#34d399" : "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                      {copied ? "✓ Copied!" : "Copy All Tags"}
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {result.tags.map((t: any, i: number) => (
                      <button key={i} onClick={() => navigator.clipboard.writeText(t.tag)}
                        style={{ padding: "6px 14px", borderRadius: 20, background: scoreBg(t.score), border: `1px solid ${scoreBorder(t.score)}`, color: scoreColor(t.score), fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s" }}>
                        {t.tag}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#334155" }}>Click any tag to copy individually</div>
                </div>

                <div className="rk-card">
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 16 }}>Tag Details</div>
                  <table className="rkt">
                    <thead>
                      <tr>
                        <th>Tag</th>
                        <th>Searches/mo</th>
                        <th>Competition</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.tags.map((t: any, i: number) => (
                        <tr key={i} onClick={() => navigator.clipboard.writeText(t.tag)} style={{ cursor: "pointer" }}>
                          <td style={{ color: "#c7d2fe", fontWeight: 600 }}>{t.tag}</td>
                          <td style={{ color: "#64748b" }}>{t.volume > 0 ? t.volume.toLocaleString() : "—"}</td>
                          <td style={{ color: compColor(t.competition), fontWeight: 600 }}>{t.competition}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 4 }}>
                                <div style={{ width: `${Math.min(t.score, 100)}%`, height: 4, borderRadius: 99, background: scoreColor(t.score) }} />
                              </div>
                              <span style={{ fontSize: 11, color: "#475569", minWidth: 20 }}>{t.score}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: 14, padding: "16px 22px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#818cf8", marginBottom: 6 }}>💡 Pro tip</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                    Etsy allows up to 13 tags per listing. Use the green tags first — they have the best balance of search volume and low competition.
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && !noResult && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.15 }}>🏷️</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Ready to generate</div>
                <div style={{ fontSize: 13, color: "#1e293b" }}>Enter a product to get optimized Etsy tags</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}