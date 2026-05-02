"use client";
import { useState } from "react";
import DashLayout from "../components/DashLayout";

function getDynamicSuggestions(): string[] {
  const month = new Date().getMonth() + 1;
  const seasonal: Record<number, string[]> = {
    1: ["valentines day shirt", "winter cozy mug", "new year goals"],
    2: ["valentines gift", "galentines day", "spring prep"],
    3: ["st patricks day", "spring vibes", "easter mom"],
    4: ["mothers day mug", "spring break shirt", "easter hunt"],
    5: ["mothers day gift", "graduation 2026", "teacher appreciation"],
    6: ["fathers day shirt", "summer vibes", "pride month"],
    7: ["4th of july", "summer beach mug", "patriotic shirt"],
    8: ["back to school", "teacher gift", "first day of school"],
    9: ["fall vibes shirt", "halloween prep", "pumpkin spice"],
    10: ["halloween shirt", "spooky season", "fall aesthetic"],
    11: ["thanksgiving", "christmas funny", "black friday"],
    12: ["christmas gift", "stocking stuffer", "ugly sweater"],
  };
  const trending = ["matcha lover", "boy mom era", "plant mom"];
  return [...(seasonal[month] || []), ...trending].slice(0, 8);
}

function getInsights(tags: any[]) {
  if (!tags?.length) return [];
  const insights = [];
  const lowComp = tags.filter((t) => t.competition === "Low");
  const highComp = tags.filter((t) => t.competition === "High");
  const bestTag = [...tags].sort((a, b) => b.score - a.score)[0];
  const totalVol = tags.reduce((acc, t) => acc + (t.volume || 0), 0);

  if (lowComp.length >= 5) insights.push({ icon: "🎯", text: `${lowComp.length} low-competition tags found — easy ranking opportunities. Use them first.` });
  else if (highComp.length > tags.length / 2) insights.push({ icon: "⚠️", text: `Most tags here are saturated. Consider niching down or combining with profession/event keywords.` });
  if (bestTag && bestTag.score >= 60) insights.push({ icon: "⭐", text: `"${bestTag.tag}" is your top tag (score ${bestTag.score}/100). Use it as your primary keyword in title.` });
  if (totalVol > 100000) insights.push({ icon: "🔥", text: `High demand niche — ${(totalVol / 1000).toFixed(0)}K monthly searches. Worth investing in 5+ designs.` });
  else if (totalVol < 5000) insights.push({ icon: "💎", text: `Micro-niche with ~${totalVol.toLocaleString()} searches/mo. Less competition but lower volume — go premium pricing.` });
  insights.push({ icon: "💡", text: `Etsy allows 13 tags max. POD platforms accept similar tags — copy these to all your stores.` });

  return insights.slice(0, 3);
}

export default function TagGenerator() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tagCopied, setTagCopied] = useState<number | null>(null);

  async function handleGenerate(kw?: string) {
    const keyword = kw || query;
    if (!keyword.trim()) return;
    setQuery(keyword);
    setLoading(true); setNoResult(false); setResult(null);
    try {
      const res = await fetch("/api/tags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: keyword.trim().toLowerCase() }) });
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
    setTimeout(() => setCopied(false), 1500);
  }

  function copyOne(tag: string, idx: number) {
    navigator.clipboard.writeText(tag);
    setTagCopied(idx);
    setTimeout(() => setTagCopied(null), 1200);
  }

  const scoreColor = (score: number) => score >= 60 ? "#34d399" : score >= 30 ? "#fbbf24" : "#f87171";
  const scoreBg = (score: number) => score >= 60 ? "rgba(52,211,153,0.08)" : score >= 30 ? "rgba(251,191,36,0.08)" : "rgba(248,113,113,0.08)";
  const scoreBorder = (score: number) => score >= 60 ? "rgba(52,211,153,0.2)" : score >= 30 ? "rgba(251,191,36,0.2)" : "rgba(248,113,113,0.2)";
  const compColor = (c: string) => c === "Low" ? "#34d399" : c === "Medium" ? "#fbbf24" : "#f87171";

  const suggestions = getDynamicSuggestions();
  const insights = result ? getInsights(result.tags) : [];

  return (
    <DashLayout topbarLabel="Tag Generator · Ranked by search volume">
      <div className="dash-hero-title">Tag <em>generator.</em></div>
      <div className="dash-hero-sub">Generate 13 optimized tags instantly — works for Etsy, Redbubble, TeePublic, Amazon Merch.</div>

      <div className="dash-search-row">
        <input className="dash-input" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleGenerate()} placeholder='e.g. "matcha lover mug", "halloween cat shirt", "boy mom era"' />
        <button className="dash-btn" onClick={() => handleGenerate()} disabled={loading}>{loading ? "Generating..." : (<>Generate Tags<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></>)}</button>
      </div>

      {!result && !loading && (
        <div className="dash-chips">
          {suggestions.map((s) => (<button key={s} className="dash-chip" onClick={() => handleGenerate(s)}>{s}</button>))}
        </div>
      )}

      {loading && <div className="dash-loading"><div className="dash-spinner" /><span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Generating optimized tags...</span></div>}

      {noResult && <div style={{ textAlign: "center", padding: 32, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Could not generate tags for "{query}" — try another keyword</div>}

      {result && !loading && (
        <div className="fade-up">
          {/* TAGS CLOUD */}
          <div className="dash-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "white", textTransform: "capitalize" }}>{result.product}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{result.tags.length} tags generated — sorted by score</div>
              </div>
              <button onClick={copyAll} style={{ padding: "9px 18px", borderRadius: 10, background: copied ? "rgba(52,211,153,0.1)" : "white", color: copied ? "#34d399" : "black", border: copied ? "1px solid rgba(52,211,153,0.3)" : "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                {copied ? "✓ Copied!" : "Copy All Tags"}
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {result.tags.map((t: any, i: number) => (
                <button key={i} onClick={() => copyOne(t.tag, i)} style={{ padding: "7px 14px", borderRadius: 999, background: tagCopied === i ? "rgba(52,211,153,0.1)" : scoreBg(t.score), border: `1px solid ${tagCopied === i ? "rgba(52,211,153,0.3)" : scoreBorder(t.score)}`, color: tagCopied === i ? "#34d399" : scoreColor(t.score), fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  {tagCopied === i ? "✓ Copied" : t.tag}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Click any tag to copy individually</div>
          </div>

          {/* TAG TABLE */}
          <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Tag Details</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Tag", "Searches/mo", "Competition", "Score"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "11px 24px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.tags.map((t: any, i: number) => (
                  <tr key={i} onClick={() => copyOne(t.tag, i)} style={{ cursor: "pointer" }}>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: "white", fontWeight: 500, borderBottom: i < result.tags.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>{t.tag}</td>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: "rgba(255,255,255,0.5)", borderBottom: i < result.tags.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>{t.volume > 0 ? t.volume.toLocaleString() : "—"}</td>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: compColor(t.competition), fontWeight: 500, borderBottom: i < result.tags.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>{t.competition}</td>
                    <td style={{ padding: "13px 24px", borderBottom: i < result.tags.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 99, height: 4, maxWidth: 100 }}>
                          <div style={{ width: `${Math.min(t.score, 100)}%`, height: 4, borderRadius: 99, background: scoreColor(t.score) }} />
                        </div>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 22 }}>{t.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* INSIGHTS */}
          <div style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 16, padding: "20px 24px", marginTop: 16, backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14, background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>💡 Smart Insights</div>
            {insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: i < insights.length - 1 ? "1px solid rgba(167,139,250,0.06)" : "none" }}>
                <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>{ins.icon}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !loading && !noResult && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.15 }}>✦</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Ready to generate</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Enter a niche to get optimized tags for all POD platforms</div>
        </div>
      )}
    </DashLayout>
  );
}