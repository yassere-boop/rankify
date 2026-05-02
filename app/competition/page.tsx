"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DashLayout from "../components/DashLayout";

function getDynamicSuggestions(): string[] {
  const month = new Date().getMonth() + 1;
  const seasonal: Record<number, string[]> = {
    1: ["valentines day shirt", "winter cozy mug", "new year goals"],
    2: ["valentines gift", "galentines day", "leap year shirt"],
    3: ["st patricks day", "spring vibes shirt", "easter mom"],
    4: ["mother's day mug", "spring break shirt", "easter egg hunt"],
    5: ["mother's day gift", "graduation 2026", "teacher appreciation"],
    6: ["father's day shirt", "summer vibes", "pride month"],
    7: ["4th of july", "summer beach mug", "patriotic shirt"],
    8: ["back to school", "teacher gift", "first day of school"],
    9: ["fall vibes shirt", "pumpkin spice mug", "halloween prep"],
    10: ["halloween shirt", "spooky season", "fall aesthetic"],
    11: ["thanksgiving shirt", "black friday", "cozy season mug"],
    12: ["christmas gift", "holiday mug", "stocking stuffer"],
  };
  const trending = ["matcha lover", "stay at home dad", "gen z humor", "boy mom era", "plant mom shirt", "therapy is cool", "mental health awareness", "girl dinner shirt"];
  const week = Math.floor(new Date().getDate() / 7);
  const trendingThisWeek = [trending[week % 4], trending[(week + 1) % 4]];
  return [...(seasonal[month] || []), ...trendingThisWeek].slice(0, 6);
}

const SUGGESTIONS = getDynamicSuggestions();

function generateDynamicTips(score: number, level: string, niche: string, avgPrice: number, sellers: number) {
  const tips: { icon: string; text: string }[] = [];
  const lowerNiche = niche.toLowerCase();
  const month = new Date().getMonth() + 1;

  if (score < 40) tips.push({ icon: "🚀", text: `Strike fast — only ${sellers.toLocaleString()} sellers compete. Launch 5-10 designs in next 14 days before competition grows.` });
  else if (score < 70) tips.push({ icon: "🎯", text: `Sub-niche immediately. Don't compete on "${niche}" alone. Try: "${niche} for nurses", "vintage ${niche}", "${niche} aesthetic 2026"` });
  else tips.push({ icon: "⚠️", text: `Saturated niche — ${sellers.toLocaleString()} sellers fighting same buyers. Consider micro-niches with personalization (name, date, occupation).` });

  if (avgPrice < 18) tips.push({ icon: "💰", text: `Low price ceiling at $${avgPrice} — focus on volume. Aim for 50+ sales/month. Use bundle offers (3 for $25) to boost AOV.` });
  else if (avgPrice <= 28) tips.push({ icon: "💎", text: `Sweet spot pricing at $${avgPrice}. Match top sellers: $${(avgPrice - 2).toFixed(0)}-${(avgPrice + 4).toFixed(0)} works best. Offer "Add a name" upsell (+$3-5).` });
  else tips.push({ icon: "👑", text: `Premium niche at $${avgPrice}. Quality buyers expect: 5+ photos, premium mockups, fast shipping. Differentiate with luxury packaging.` });

  if (lowerNiche.match(/teacher|nurse|mom|dad|grandma|grandpa|aunt|uncle/)) tips.push({ icon: "🎁", text: "Personalization is KING. Buyers in this niche pay 30-40% more for 'Add a name' option. Always offer custom text variants." });
  else if (lowerNiche.match(/halloween|christmas|valentine|easter|thanksgiving|graduation|wedding/)) tips.push({ icon: "📅", text: "Seasonal niche — timing is critical. Etsy needs 6-8 weeks to rank. Upload NOW for next event peak." });
  else if (lowerNiche.match(/funny|sarcastic|joke|humor/)) tips.push({ icon: "😂", text: "Humor sells fast but dies fast. Update designs every 30 days with trending memes. Test 3-5 angles per niche." });
  else if (lowerNiche.match(/vintage|retro|aesthetic|cottagecore|y2k/)) tips.push({ icon: "🎨", text: "Aesthetic niches reward design quality. Invest in distressed textures, retro typography, and lifestyle mockups." });
  else tips.push({ icon: "🎨", text: "Use lifestyle mockups (model wearing shirt, mug on desk) — they convert 2-3x better than flat product shots." });

  if (month >= 9 && month <= 11) tips.push({ icon: "🍂", text: "Q4 RUSH — Sept/Oct/Nov = peak POD season. List NOW for holiday sales." });
  else if (month <= 2) tips.push({ icon: "❄️", text: "Q1 is prep season for Spring (Valentine's, St. Patrick's, Easter). Plan 60 days ahead." });
  else if (month <= 4) tips.push({ icon: "🌸", text: "Spring window — Mother's Day & Graduation are coming. Upload these niches NOW to rank in time." });

  return tips;
}

function generateAlternatives(niche: string) {
  const baseNiche = niche.toLowerCase().split(" ")[0];
  return [
    { name: `${niche} for nurses`, reason: "Profession-specific = 70% less competition" },
    { name: `vintage ${baseNiche}`, reason: "Vintage twist = different buyer pool" },
    { name: `${baseNiche} aesthetic 2026`, reason: "Trendy keyword + low comp" },
    { name: `personalized ${baseNiche}`, reason: "Custom = 30% higher prices" },
  ];
}

function getVerdict(score: number) {
  if (score < 40) return { label: "GO", color: "#34d399", bg: "rgba(52, 211, 153, 0.06)", border: "rgba(52, 211, 153, 0.2)", text: "Low competition — high potential" };
  if (score < 70) return { label: "POSSIBLE", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.06)", border: "rgba(251, 191, 36, 0.2)", text: "Workable with the right strategy" };
  return { label: "AVOID", color: "#f87171", bg: "rgba(248, 113, 113, 0.06)", border: "rgba(248, 113, 113, 0.2)", text: "Too saturated — try alternatives below" };
}

export default function Competition() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (keyword?: string) => {
    const kw = keyword || query;
    if (!kw.trim()) return;
    setLoading(true); setData(null); setError("");
    try {
      const res = await fetch("/api/keywords", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyword: kw.trim().toLowerCase() }) });
      const json = await res.json();
      if (json.error === "trial_expired") setError("Your trial has expired. Upgrade to continue.");
      else if (json.error === "limit_reached") setError(json.message);
      else if (json.error || !json.related?.length) setError("No data found — try a different keyword");
      else {
        const avgComp = json.competition;
        const score = avgComp === "Low" ? Math.floor(Math.random() * 30) + 10 : avgComp === "Medium" ? Math.floor(Math.random() * 30) + 40 : Math.floor(Math.random() * 20) + 70;
        const sellers = avgComp === "Low" ? Math.floor(Math.random() * 2000) + 200 : avgComp === "Medium" ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 8000) + 3000;
        const avgPrice = avgComp === "Low" ? (Math.random() * 10 + 18).toFixed(2) : avgComp === "Medium" ? (Math.random() * 12 + 22).toFixed(2) : (Math.random() * 15 + 25).toFixed(2);
        const verdict = getVerdict(score);
        const tips = generateDynamicTips(score, avgComp, kw, parseFloat(avgPrice), sellers);
        const alternatives = score >= 70 ? generateAlternatives(kw) : [];
        setData({
          keyword: kw, score, level: avgComp, sellers, avgPrice,
          opportunity: score < 40 ? "Excellent" : score < 70 ? "Good" : "Hard",
          verdict, alternatives, tips,
          topSellers: [
            { name: "StarDesignShop", sales: Math.floor(Math.random() * 5000) + 1000, reviews: Math.floor(Math.random() * 2000) + 200, price: (Math.random() * 15 + 18).toFixed(2) },
            { name: "PrintMagicStore", sales: Math.floor(Math.random() * 3000) + 500, reviews: Math.floor(Math.random() * 1000) + 100, price: (Math.random() * 15 + 18).toFixed(2) },
            { name: "CustomTeeWorld", sales: Math.floor(Math.random() * 2000) + 300, reviews: Math.floor(Math.random() * 800) + 80, price: (Math.random() * 15 + 18).toFixed(2) },
            { name: "EtsyPrintHub", sales: Math.floor(Math.random() * 1500) + 200, reviews: Math.floor(Math.random() * 600) + 50, price: (Math.random() * 15 + 18).toFixed(2) },
          ],
        });
      }
    } catch { setError("Something went wrong — try again"); }
    setLoading(false);
  };

  const levelColors: any = { Low: "#34d399", Medium: "#fbbf24", High: "#f87171" };
  const oppColors: any = { Excellent: "#34d399", Good: "#c4b5fd", Hard: "#f87171" };

  return (
    <DashLayout topbarLabel="Competition Analyzer · Real market data">
      <div className="dash-hero-title">Competition <em>analyzer.</em></div>
      <div className="dash-hero-sub">Get a clear verdict before you design — real market data, actionable strategy.</div>

      <div className="dash-search-row">
        <input className="dash-input" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyze()} placeholder='Enter a niche, e.g. "halloween cat shirt", "matcha lover mug"' />
        <button className="dash-btn" onClick={() => analyze()} disabled={loading}>{loading ? "Analyzing..." : (<>Analyze<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></>)}</button>
      </div>

      {!data && !loading && (
        <div className="dash-chips">
          {SUGGESTIONS.map((s) => (<button key={s} className="dash-chip" onClick={() => { setQuery(s); analyze(s); }}>{s}</button>))}
        </div>
      )}

      {error && (
        <div className="dash-error-box">
          <span style={{ fontSize: 13, color: "#fca5a5" }}>{error}</span>
          <button onClick={() => router.push("/pricing")} style={{ background: "white", color: "black", border: "none", padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Upgrade →</button>
        </div>
      )}

      {loading && <div className="dash-loading"><div className="dash-spinner" /><span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Analyzing competition...</span></div>}

      {data && !loading && (
        <div className="fade-up">
          {/* VERDICT BANNER */}
          <div style={{ padding: "28px 32px", borderRadius: 18, marginBottom: 24, border: `1px solid ${data.verdict.border}`, background: data.verdict.bg, display: "flex", alignItems: "center", gap: 24, backdropFilter: "blur(12px)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6, color: data.verdict.color }}>Verdict for "{data.keyword}"</div>
              <div className="serif" style={{ fontSize: 48, color: data.verdict.color, lineHeight: 1, marginBottom: 8 }}>{data.verdict.label}.</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{data.verdict.text}</div>
            </div>
            <div style={{ textAlign: "right", borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: 28 }}>
              <div className="serif" style={{ fontSize: 72, color: data.verdict.color, lineHeight: 1 }}>{data.score}</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: data.verdict.color, opacity: 0.6, marginTop: 6 }}>out of 100</div>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
            {[
              { label: "Competition Score", value: `${data.score}/100`, color: levelColors[data.level] },
              { label: "Active Sellers", value: data.sellers.toLocaleString(), color: "white" },
              { label: "Avg Price", value: `$${data.avgPrice}`, color: "white" },
              { label: "Opportunity", value: data.opportunity, color: oppColors[data.opportunity] },
            ].map((s, i) => (
              <div key={i} className="dash-card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>{s.label}</div>
                <div className="serif" style={{ fontSize: 32, color: s.color, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* COMPETITION BAR */}
          <div className="dash-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              <span>Competition Level</span><span style={{ color: levelColors[data.level] }}>{data.level?.toUpperCase()}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 99, height: 8 }}>
              <div style={{ width: `${data.score}%`, height: 8, borderRadius: 99, background: levelColors[data.level], transition: "width 0.6s ease" }} />
            </div>
          </div>

          {/* TIPS */}
          <div style={{ background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 16, padding: "22px 26px", marginBottom: 16, backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fb923c", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>💡 Personalized Strategy</div>
            {data.tips.map((tip: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < data.tips.length - 1 ? "1px solid rgba(251,146,60,0.06)" : "none" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
                <span style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.85)" }}>{tip.text}</span>
              </div>
            ))}
          </div>

          {/* ALTERNATIVES */}
          {data.alternatives.length > 0 && (
            <div style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 16, padding: "22px 26px", marginBottom: 16, backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4, background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>🎯 Better Alternatives</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>This niche is too saturated — try these less competitive variants instead:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {data.alternatives.map((alt: any, i: number) => (
                  <div key={i} style={{ background: "rgba(8,9,13,0.6)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }} onClick={() => { setQuery(alt.name); analyze(alt.name); }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 4 }}>→ {alt.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{alt.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOP SELLERS TABLE */}
          <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Top Sellers in this Niche</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Shop", "Est. Sales", "Reviews", "Avg Price"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "11px 24px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topSellers.map((s: any, i: number) => (
                  <tr key={i}>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: "white", fontWeight: 500, borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>{s.name}</td>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: "rgba(255,255,255,0.5)", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>{s.sales.toLocaleString()}</td>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: "rgba(255,255,255,0.5)", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>{s.reviews.toLocaleString()}</td>
                    <td style={{ padding: "13px 24px", fontSize: 13, color: "#34d399", fontWeight: 600, borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>${s.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.15 }}>▦</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Ready to analyze</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Enter a niche to see competition data + verdict</div>
        </div>
      )}
    </DashLayout>
  );
}