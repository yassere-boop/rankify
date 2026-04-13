"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ListingOptimizer() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const nav = [
    { label: "Keyword Research", path: "/dashboard", emoji: "🔍" },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐", active: true },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
  ];

  const suggestions = ["candle", "jewelry", "mug", "tshirt", "wedding", "baby", "hoodie", "poster"];

  async function handleOptimize() {
    if (!query.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: query.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!data.error && data.related?.length) {
        const topKeywords = data.related.sort((a: any, b: any) => parseInt(b.vol) - parseInt(a.vol)).slice(0, 13).map((k: any) => k.kw);
        const mainKw = query.trim();
        const title = generateTitle(mainKw, topKeywords);
        const description = generateDescription(mainKw, topKeywords);
        const tags = generateTags(mainKw, topKeywords);
        const score = calculateScore(data.volume, data.competition, topKeywords.length);
        setResult({ title, description, tags, score, volume: data.volume, competition: data.competition, keyword: mainKw });
      } else {
        setResult({ error: true });
      }
    } catch { setResult({ error: true }); }
    setLoading(false);
  }

  function generateTitle(kw: string, related: string[]) {
    const cap = (s: string) => s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const extras = related.filter(r => r !== kw).slice(0, 2);
    return ([cap(kw), ...extras.map(cap)].join(" | ") + " — Gift for Her, Personalized, Handmade").slice(0, 140);
  }

  function generateDescription(kw: string, related: string[]) {
    const cap = (s: string) => s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return `✨ Looking for the perfect ${cap(kw)}? You've found it!\n\nOur ${cap(kw)} is carefully crafted with attention to every detail — making it the ideal gift for birthdays, holidays, weddings, or just because.\n\n🎁 PERFECT FOR: ${related.slice(0, 5).map(cap).join(", ")}\n\n✅ WHY CHOOSE US:\n- High-quality materials and craftsmanship\n- Personalization available — make it truly unique\n- Fast processing and shipping\n- 100% satisfaction guaranteed\n\n📦 DETAILS:\n- Ready to ship in 1–3 business days\n- Gift wrapping available upon request\n- Custom orders welcome — message us!\n\n💬 Questions? We're here to help.\n\nSearch terms: ${related.slice(0, 8).join(", ")}`.slice(0, 2000);
  }

  function generateTags(kw: string, related: string[]) {
    return [...new Set([kw, ...related].map(t => t.toLowerCase().trim()))].slice(0, 13);
  }

  function calculateScore(volume: string, competition: string, kwCount: number) {
    let score = 50;
    const vol = parseInt(volume?.replace(/[^0-9]/g, "") || "0");
    if (vol > 10000) score += 20;
    else if (vol > 5000) score += 15;
    else if (vol > 1000) score += 10;
    if (competition === "Low") score += 20;
    else if (competition === "Medium") score += 10;
    if (kwCount >= 10) score += 10;
    return Math.min(score, 100);
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const scoreColor = result?.score >= 80 ? "#34d399" : result?.score >= 60 ? "#fbbf24" : "#f87171";
  const compColor = (c: string) => c === "Low" ? "#34d399" : c === "Medium" ? "#fbbf24" : "#f87171";

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
        .rk-copy-btn { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.15s; }
        .rk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 16px; }
        .rk-spinner { width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .rk-fade { animation: rkfade 0.35s ease; }
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
            <span style={{ fontSize: 12, color: "#334155" }}>Listing Optimizer · SEO title, description & tags</span>
          </div>
          <div className="rk-content">
            <div className="rk-title">⭐ Listing Optimizer</div>
            <div className="rk-sub">Generate SEO-optimized title, description and tags for your Etsy listing</div>

            <div className="rk-search-row">
              <input className="rk-input" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleOptimize()}
                placeholder='Enter your product, e.g. "candle", "mug", "wedding gift"' />
              <button className="rk-btn" onClick={handleOptimize} disabled={loading}>
                {loading ? "Optimizing..." : "✨ Optimize →"}
              </button>
            </div>

            {!result && !loading && (
              <div className="rk-chips">
                {suggestions.map(s => (
                  <button key={s} className="rk-chip" onClick={() => setQuery(s)}>{s}</button>
                ))}
              </div>
            )}

            {loading && <div className="rk-loading"><div className="rk-spinner" /><span style={{ fontSize: 13, color: "#475569" }}>Generating optimized listing...</span></div>}

            {result?.error && (
              <div style={{ textAlign: "center", padding: 32, color: "#334155", fontSize: 13 }}>
                No data found for "{query}" — try another keyword
              </div>
            )}

            {result && !result.error && (
              <div className="rk-fade">
                <div className="rk-card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                    <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 72 72">
                      <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(129,140,248,0.15)" strokeWidth="7" />
                      <circle cx="36" cy="36" r="28" fill="none" stroke={scoreColor} strokeWidth="7"
                        strokeDasharray={`${result.score * 1.76} 176`} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: scoreColor }}>
                      {result.score}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
                      {result.score >= 80 ? "🔥 Excellent listing" : result.score >= 60 ? "✅ Good listing" : "⚡ Needs improvement"}
                    </div>
                    <div style={{ fontSize: 13, color: "#475569" }}>SEO score for "{result.keyword}"</div>
                    <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                      <span style={{ fontSize: 12, color: "#475569" }}>{result.volume} searches/mo</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: compColor(result.competition) }}>{result.competition} competition</span>
                    </div>
                  </div>
                </div>

                <div className="rk-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase" }}>Etsy Title</span>
                    <button className="rk-copy-btn" onClick={() => copyToClipboard(result.title, "title")}
                      style={{ background: copied === "title" ? "rgba(52,211,153,0.1)" : "rgba(99,102,241,0.1)", color: copied === "title" ? "#34d399" : "#818cf8" }}>
                      {copied === "title" ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>
                  <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.6 }}>{result.title}</div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 8 }}>{result.title.length}/140 characters</div>
                </div>

                <div className="rk-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase" }}>Description</span>
                    <button className="rk-copy-btn" onClick={() => copyToClipboard(result.description, "desc")}
                      style={{ background: copied === "desc" ? "rgba(52,211,153,0.1)" : "rgba(99,102,241,0.1)", color: copied === "desc" ? "#34d399" : "#818cf8" }}>
                      {copied === "desc" ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{result.description}</pre>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 8 }}>{result.description.length}/2000 characters</div>
                </div>

                <div className="rk-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase" }}>Etsy Tags ({result.tags.length}/13)</span>
                    <button className="rk-copy-btn" onClick={() => copyToClipboard(result.tags.join(", "), "tags")}
                      style={{ background: copied === "tags" ? "rgba(52,211,153,0.1)" : "rgba(99,102,241,0.1)", color: copied === "tags" ? "#34d399" : "#818cf8" }}>
                      {copied === "tags" ? "✓ Copied!" : "Copy All"}
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.tags.map((tag: string, i: number) => (
                      <span key={i} style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", color: "#a5b4fc", fontSize: 12, fontWeight: 500 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.15 }}>⭐</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Ready to optimize</div>
                <div style={{ fontSize: 13, color: "#1e293b" }}>Enter your product to generate an optimized listing</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}