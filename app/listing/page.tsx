"use client";
import { useState } from "react";
import DashLayout from "../components/DashLayout";

function getDynamicSuggestions(): string[] {
  const month = new Date().getMonth() + 1;
  const seasonal: Record<number, string[]> = {
    1: ["valentines mug", "winter cozy", "new year"],
    2: ["valentines gift", "galentines", "spring"],
    3: ["st patricks", "spring vibes", "easter mom"],
    4: ["mothers day", "graduation", "easter"],
    5: ["mothers day mug", "fathers day", "teacher"],
    6: ["fathers day", "summer", "pride"],
    7: ["4th of july", "summer beach", "patriotic"],
    8: ["back to school", "teacher gift", "halloween"],
    9: ["halloween", "fall vibes", "pumpkin"],
    10: ["halloween shirt", "spooky", "fall aesthetic"],
    11: ["thanksgiving", "christmas", "black friday"],
    12: ["christmas gift", "holiday mug", "stocking"],
  };
  const trending = ["matcha lover", "boy mom era", "plant mom"];
  return [...(seasonal[month] || []), ...trending].slice(0, 8);
}

function getScoreBreakdown(result: any) {
  if (!result) return [];
  const items = [];
  const titleLen = result.title?.length || 0;
  if (titleLen >= 100 && titleLen <= 140) items.push({ pass: true, text: `Title length optimal (${titleLen}/140 chars)` });
  else if (titleLen < 100) items.push({ pass: false, text: `Title too short (${titleLen} chars) — aim for 100-140 to maximize SEO` });
  else items.push({ pass: false, text: `Title too long (${titleLen} chars) — keep under 140` });

  const tagCount = result.tags?.length || 0;
  if (tagCount >= 13) items.push({ pass: true, text: `All 13 tag slots used (max SEO juice)` });
  else items.push({ pass: false, text: `Only ${tagCount}/13 tags — add more for better visibility` });

  const descLen = result.description?.length || 0;
  if (descLen >= 500) items.push({ pass: true, text: `Description has good depth (${descLen} chars)` });
  else items.push({ pass: false, text: `Description too thin (${descLen} chars) — Etsy favors detailed listings` });

  if (result.competition === "Low") items.push({ pass: true, text: `Low competition niche — easy to rank` });
  else if (result.competition === "Medium") items.push({ pass: true, text: `Medium competition — workable with strong SEO` });
  else items.push({ pass: false, text: `High competition — focus on long-tail variants & personalization` });

  return items;
}

export default function ListingOptimizer() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const suggestions = getDynamicSuggestions();

  async function handleOptimize(kw?: string) {
    const q = kw || query;
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/keywords", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyword: q.trim().toLowerCase() }) });
      const data = await res.json();
      if (!data.error && data.related?.length) {
        const topKeywords = data.related.sort((a: any, b: any) => parseInt(b.vol) - parseInt(a.vol)).slice(0, 13).map((k: any) => k.kw);
        const mainKw = q.trim();
        const title = generateTitle(mainKw, topKeywords);
        const description = generateDescription(mainKw, topKeywords);
        const tags = generateTags(mainKw, topKeywords);
        const score = calculateScore(data.volume, data.competition, topKeywords.length);
        setResult({ title, description, tags, score, volume: data.volume, competition: data.competition, keyword: mainKw });
      } else setResult({ error: true });
    } catch { setResult({ error: true }); }
    setLoading(false);
  }

  function generateTitle(kw: string, related: string[]) {
    const cap = (s: string) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const extras = related.filter((r) => r !== kw).slice(0, 2);
    return ([cap(kw), ...extras.map(cap)].join(" | ") + " — Gift for Her, Personalized, Handmade").slice(0, 140);
  }

  function generateDescription(kw: string, related: string[]) {
    const cap = (s: string) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return `✨ Looking for the perfect ${cap(kw)}? You've found it!\n\nOur ${cap(kw)} is carefully crafted with attention to every detail — making it the ideal gift for birthdays, holidays, weddings, or just because.\n\n🎁 PERFECT FOR: ${related.slice(0, 5).map(cap).join(", ")}\n\n✅ WHY CHOOSE US:\n- High-quality materials and craftsmanship\n- Personalization available — make it truly unique\n- Fast processing and shipping\n- 100% satisfaction guaranteed\n\n📦 DETAILS:\n- Ready to ship in 1–3 business days\n- Gift wrapping available upon request\n- Custom orders welcome — message us!\n\n💬 Questions? We're here to help.\n\nSearch terms: ${related.slice(0, 8).join(", ")}`.slice(0, 2000);
  }

  function generateTags(kw: string, related: string[]) {
    return [...new Set([kw, ...related].map((t) => t.toLowerCase().trim()))].slice(0, 13);
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
    setTimeout(() => setCopied(null), 1500);
  }

  const scoreColor = result?.score >= 80 ? "#34d399" : result?.score >= 60 ? "#fbbf24" : "#f87171";
  const compColor = (c: string) => c === "Low" ? "#34d399" : c === "Medium" ? "#fbbf24" : "#f87171";
  const breakdown = result && !result.error ? getScoreBreakdown(result) : [];

  return (
    <DashLayout topbarLabel="Listing Optimizer · SEO title, description & tags">
      <div className="dash-hero-title">Listing <em>optimizer.</em></div>
      <div className="dash-hero-sub">Generate SEO-optimized title, description and tags — works for Etsy, Redbubble, TeePublic, Amazon Merch.</div>

      <div className="dash-search-row">
        <input className="dash-input" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleOptimize()} placeholder='Enter your product, e.g. "matcha mug", "halloween shirt"' />
        <button className="dash-btn" onClick={() => handleOptimize()} disabled={loading}>{loading ? "Optimizing..." : (<>Optimize<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></>)}</button>
      </div>

      {!result && !loading && (
        <div className="dash-chips">
          {suggestions.map((s) => (<button key={s} className="dash-chip" onClick={() => handleOptimize(s)}>{s}</button>))}
        </div>
      )}

      {loading && <div className="dash-loading"><div className="dash-spinner" /><span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Generating optimized listing...</span></div>}

      {result?.error && <div style={{ textAlign: "center", padding: 32, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No data found for "{query}" — try another keyword</div>}

      {result && !result.error && (
        <div className="fade-up">
          {/* SCORE GAUGE */}
          <div className="dash-card" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
              <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle cx="44" cy="44" r="36" fill="none" stroke={scoreColor} strokeWidth="6" strokeDasharray={`${(result.score / 100) * 226} 226`} strokeLinecap="round" />
              </svg>
              <div className="serif" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: scoreColor }}>
                {result.score}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "white", marginBottom: 4 }}>
                {result.score >= 80 ? "🔥 Excellent listing" : result.score >= 60 ? "✅ Good listing" : "⚡ Needs improvement"}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>SEO score for "{result.keyword}"</div>
              <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{result.volume} searches/mo</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: compColor(result.competition) }}>{result.competition} competition</span>
              </div>
            </div>
          </div>

          {/* BREAKDOWN */}
          <div className="dash-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14, background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>📋 Score Breakdown</div>
            {breakdown.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < breakdown.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ fontSize: 14, flexShrink: 0, lineHeight: 1.4, color: item.pass ? "#34d399" : "#fbbf24" }}>{item.pass ? "✓" : "⚠"}</span>
                <span style={{ fontSize: 13, lineHeight: 1.55, color: item.pass ? "rgba(255,255,255,0.85)" : "#fbbf24" }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* TITLE */}
          <div className="dash-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Listing Title</span>
              <button onClick={() => copyToClipboard(result.title, "title")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "inherit", background: copied === "title" ? "rgba(52,211,153,0.1)" : "rgba(167,139,250,0.1)", color: copied === "title" ? "#34d399" : "#c4b5fd", transition: "all 0.2s" }}>
                {copied === "title" ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>{result.title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 10 }}>{result.title.length}/140 characters</div>
          </div>

          {/* DESCRIPTION */}
          <div className="dash-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Description</span>
              <button onClick={() => copyToClipboard(result.description, "desc")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "inherit", background: copied === "desc" ? "rgba(52,211,153,0.1)" : "rgba(167,139,250,0.1)", color: copied === "desc" ? "#34d399" : "#c4b5fd", transition: "all 0.2s" }}>
                {copied === "desc" ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <pre style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{result.description}</pre>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 10 }}>{result.description.length}/2000 characters</div>
          </div>

          {/* TAGS */}
          <div className="dash-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Tags ({result.tags.length}/13)</span>
              <button onClick={() => copyToClipboard(result.tags.join(", "), "tags")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "inherit", background: copied === "tags" ? "rgba(52,211,153,0.1)" : "rgba(167,139,250,0.1)", color: copied === "tags" ? "#34d399" : "#c4b5fd", transition: "all 0.2s" }}>
                {copied === "tags" ? "✓ Copied!" : "Copy All"}
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.tags.map((tag: string, i: number) => (
                <span key={i} style={{ padding: "6px 13px", borderRadius: 999, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "#c4b5fd", fontSize: 12, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.15 }}>★</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Ready to optimize</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Enter your product to generate an optimized listing</div>
        </div>
      )}
    </DashLayout>
  );
}