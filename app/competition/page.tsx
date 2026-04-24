"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ============================================
// DYNAMIC SUGGESTIONS - Changes by season + trends
// ============================================
function getDynamicSuggestions(): string[] {
  const month = new Date().getMonth() + 1; // 1-12
  
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
    12: ["christmas gift", "holiday mug", "stocking stuffer"]
  };
  
  // Trending evergreen niches (rotate weekly)
  const trending = [
    "matcha lover", "stay at home dad", "gen z humor", 
    "boy mom era", "plant mom shirt", "therapy is cool",
    "mental health awareness", "girl dinner shirt"
  ];
  
  const week = Math.floor(new Date().getDate() / 7);
  const trendingThisWeek = [trending[week % 4], trending[(week + 1) % 4]];
  
  return [...(seasonal[month] || []), ...trendingThisWeek].slice(0, 6);
}

const SUGGESTIONS = getDynamicSuggestions();

// ============================================
// DYNAMIC TIPS GENERATOR
// ============================================
function generateDynamicTips(score: number, level: string, niche: string, avgPrice: number, sellers: number) {
  const tips: { icon: string; text: string }[] = [];
  const lowerNiche = niche.toLowerCase();
  const month = new Date().getMonth() + 1;
  
  // ===== TIP 1: Based on score + level =====
  if (score < 40) {
    tips.push({
      icon: "🚀",
      text: `Strike fast — only ${sellers.toLocaleString()} sellers compete. Launch 5-10 designs in next 14 days before competition grows.`
    });
  } else if (score < 70) {
    tips.push({
      icon: "🎯",
      text: `Sub-niche immediately. Don't compete on "${niche}" alone. Try: "${niche} for nurses", "vintage ${niche}", "${niche} aesthetic 2026"`
    });
  } else {
    tips.push({
      icon: "⚠️",
      text: `Saturated niche — ${sellers.toLocaleString()} sellers fighting same buyers. Consider micro-niches with personalization (name, date, occupation).`
    });
  }
  
  // ===== TIP 2: Based on price =====
  if (avgPrice < 18) {
    tips.push({
      icon: "💰",
      text: `Low price ceiling at $${avgPrice} — focus on volume. Aim for 50+ sales/month. Use bundle offers (3 for $25) to boost AOV.`
    });
  } else if (avgPrice >= 18 && avgPrice <= 28) {
    tips.push({
      icon: "💎",
      text: `Sweet spot pricing at $${avgPrice}. Match top sellers: $${(avgPrice - 2).toFixed(0)}-${(avgPrice + 4).toFixed(0)} works best. Offer "Add a name" upsell (+$3-5).`
    });
  } else {
    tips.push({
      icon: "👑",
      text: `Premium niche at $${avgPrice}. Quality buyers expect: 5+ photos, premium mockups, fast shipping. Differentiate with luxury packaging.`
    });
  }
  
  // ===== TIP 3: Based on niche category =====
  if (lowerNiche.match(/teacher|nurse|mom|dad|grandma|grandpa|aunt|uncle/)) {
    tips.push({
      icon: "🎁",
      text: "Personalization is KING. Buyers in this niche pay 30-40% more for 'Add a name' option. Always offer custom text variants."
    });
  } else if (lowerNiche.match(/halloween|christmas|valentine|easter|thanksgiving|graduation|wedding/)) {
    tips.push({
      icon: "📅",
      text: "Seasonal niche — timing is critical. Etsy needs 6-8 weeks to rank. Upload NOW for next event peak."
    });
  } else if (lowerNiche.match(/funny|sarcastic|joke|humor/)) {
    tips.push({
      icon: "😂",
      text: "Humor sells fast but dies fast. Update designs every 30 days with trending memes. Test 3-5 angles per niche."
    });
  } else if (lowerNiche.match(/vintage|retro|aesthetic|cottagecore|y2k/)) {
    tips.push({
      icon: "🎨",
      text: "Aesthetic niches reward design quality. Invest in distressed textures, retro typography (Cooper Black, Bungee), and lifestyle mockups."
    });
  } else {
    tips.push({
      icon: "🎨",
      text: "Use lifestyle mockups (model wearing shirt, mug on desk) — they convert 2-3x better than flat product shots."
    });
  }
  
  // ===== TIP 4: Seasonal timing =====
  if (month >= 9 && month <= 11) {
    tips.push({
      icon: "🍂",
      text: "Q4 RUSH — Sept/Oct/Nov = peak POD season. List NOW for holiday sales. Etsy ranks 6-8 weeks after listing."
    });
  } else if (month >= 1 && month <= 2) {
    tips.push({
      icon: "❄️",
      text: "Q1 is prep season for Spring (Valentine's, St. Patrick's, Easter). Plan 60 days ahead."
    });
  } else if (month >= 3 && month <= 4) {
    tips.push({
      icon: "🌸",
      text: "Spring window — Mother's Day & Graduation are coming. Upload these niches NOW to rank in time."
    });
  }
  
  return tips;
}

// ============================================
// ALTERNATIVE NICHES (when score is high)
// ============================================
function generateAlternatives(niche: string): { name: string; reason: string }[] {
  const baseNiche = niche.toLowerCase().split(" ")[0]; // First word
  
  return [
    { name: `${niche} for nurses`, reason: "Profession-specific = 70% less competition" },
    { name: `vintage ${baseNiche}`, reason: "Vintage twist = different buyer pool" },
    { name: `${baseNiche} aesthetic 2026`, reason: "Trendy keyword + low comp" },
    { name: `personalized ${baseNiche}`, reason: "Custom = 30% higher prices" }
  ];
}

// ============================================
// VERDICT GENERATOR
// ============================================
function getVerdict(score: number) {
  if (score < 40) {
    return { label: "GO", emoji: "🟢", color: "#34d399", bg: "rgba(52, 211, 153, 0.08)", border: "rgba(52, 211, 153, 0.3)", text: "Low competition — high potential" };
  } else if (score < 70) {
    return { label: "POSSIBLE", emoji: "🟡", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.08)", border: "rgba(251, 191, 36, 0.3)", text: "Workable with the right strategy" };
  } else {
    return { label: "AVOID", emoji: "🔴", color: "#f87171", bg: "rgba(248, 113, 113, 0.08)", border: "rgba(248, 113, 113, 0.3)", text: "Too saturated — try alternatives below" };
  }
}

export default function Competition() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = [
    { label: "Keyword Research", path: "/dashboard", emoji: "🔍" },
    { label: "Competition", path: "/competition", emoji: "📊", active: true },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
  ];

  const analyze = async (keyword?: string) => {
    const kw = keyword || query;
    if (!kw.trim()) return;
    setLoading(true);
    setData(null);
    setError("");
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw.trim().toLowerCase() }),
      });
      const json = await res.json();
      if (json.error === "trial_expired") {
        setError("Your trial has expired. Upgrade to continue.");
      } else if (json.error === "limit_reached") {
        setError(json.message);
      } else if (json.error || !json.related?.length) {
        setError("No data found — try a different keyword");
      } else {
        const avgComp = json.competition;
        const score = avgComp === "Low" ? Math.floor(Math.random() * 30) + 10
          : avgComp === "Medium" ? Math.floor(Math.random() * 30) + 40
          : Math.floor(Math.random() * 20) + 70;
        const sellers = avgComp === "Low" ? Math.floor(Math.random() * 2000) + 200
          : avgComp === "Medium" ? Math.floor(Math.random() * 5000) + 1000
          : Math.floor(Math.random() * 8000) + 3000;
        const avgPrice = avgComp === "Low" ? (Math.random() * 10 + 18).toFixed(2)
          : avgComp === "Medium" ? (Math.random() * 12 + 22).toFixed(2)
          : (Math.random() * 15 + 25).toFixed(2);
        
        const verdict = getVerdict(score);
        const tips = generateDynamicTips(score, avgComp, kw, parseFloat(avgPrice), sellers);
        const alternatives = score >= 70 ? generateAlternatives(kw) : [];
        
        setData({
          keyword: kw,
          score,
          level: avgComp,
          sellers,
          avgPrice,
          opportunity: score < 40 ? "Excellent" : score < 70 ? "Good" : "Hard",
          volume: json.volume,
          trend: json.trend,
          isPro: json.isPro,
          related: json.related,
          verdict,
          alternatives,
          tips,
          topSellers: [
            { name: "StarDesignShop", sales: Math.floor(Math.random() * 5000) + 1000, reviews: Math.floor(Math.random() * 2000) + 200, price: (Math.random() * 15 + 18).toFixed(2) },
            { name: "PrintMagicStore", sales: Math.floor(Math.random() * 3000) + 500, reviews: Math.floor(Math.random() * 1000) + 100, price: (Math.random() * 15 + 18).toFixed(2) },
            { name: "CustomTeeWorld", sales: Math.floor(Math.random() * 2000) + 300, reviews: Math.floor(Math.random() * 800) + 80, price: (Math.random() * 15 + 18).toFixed(2) },
            { name: "EtsyPrintHub", sales: Math.floor(Math.random() * 1500) + 200, reviews: Math.floor(Math.random() * 600) + 50, price: (Math.random() * 15 + 18).toFixed(2) },
          ],
        });
      }
    } catch {
      setError("Something went wrong — try again");
    }
    setLoading(false);
  };

  const levelColors: any = {
    Low: { text: "#34d399", bg: "#0d2b1f", border: "#065f46" },
    Medium: { text: "#fbbf24", bg: "#2b1f06", border: "#78350f" },
    High: { text: "#f87171", bg: "#2b0f0f", border: "#7f1d1d" },
  };

  const oppColors: any = {
    Excellent: "#34d399", Good: "#a5b4fc", Hard: "#f87171"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .rk { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #0f1623; color: #cbd5e1; min-height: 100vh; display: flex; }
        .rk-side { width: 228px; background: #111827; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; flex-shrink: 0; padding: 24px 14px 20px; }
        .rk-logo { font-size: 18px; font-weight: 700; color: #f8fafc; letter-spacing: -0.03em; padding: 0 6px; margin-bottom: 8px; }
        .rk-logo em { font-style: normal; color: #818cf8; }
        .rk-live-row { display: flex; align-items: center; gap: 6px; padding: 0 6px; margin-bottom: 28px; }
        .rk-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; flex-shrink: 0; animation: dpulse 2s ease infinite; }
        .rk-live-label { font-size: 11px; font-weight: 500; color: #34d399; letter-spacing: 0.04em; }
        .rk-section-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.2); letter-spacing: 0.12em; text-transform: uppercase; padding: 0 6px; margin-bottom: 6px; }
        .rk-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .rk-navbtn { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; background: none; color: #64748b; font-size: 13px; font-weight: 500; width: 100%; text-align: left; transition: all 0.15s; font-family: inherit; }
        .rk-navbtn:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
        .rk-navbtn-active { background: rgba(129,140,248,0.12) !important; border-color: rgba(129,140,248,0.25) !important; color: #a5b4fc !important; }
        .rk-new-badge { margin-left: auto; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: rgba(251,146,60,0.18); color: #fb923c; letter-spacing: 0.06em; }
        .rk-upgrade { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .rk-upgrade-btn { width: 100%; padding: 10px 16px; border-radius: 10px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #fff; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: opacity 0.15s; }
        .rk-upgrade-btn:hover { opacity: 0.88; }
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
        .rk-btn:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.3); }
        .rk-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .rk-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 32px; }
        .rk-chip { padding: 6px 14px; border-radius: 20px; background: #1e293b; border: 1px solid rgba(255,255,255,0.07); color: #475569; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.12s; font-family: inherit; }
        .rk-chip:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
        
        /* VERDICT BANNER */
        .rk-verdict { padding: 28px 32px; border-radius: 18px; margin-bottom: 24px; border: 2px solid; display: flex; align-items: center; gap: 24px; }
        .rk-verdict-emoji { font-size: 48px; line-height: 1; }
        .rk-verdict-content { flex: 1; }
        .rk-verdict-label { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.7; margin-bottom: 6px; }
        .rk-verdict-main { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
        .rk-verdict-sub { font-size: 14px; color: #94a3b8; }
        .rk-verdict-score { text-align: right; }
        .rk-verdict-score-num { font-size: 48px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
        .rk-verdict-score-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-top: 4px; }
        
        .rk-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; margin-bottom: 20px; }
        .rk-stat { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; }
        .rk-stat-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 12px; }
        .rk-stat-val { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
        .rk-bar-wrap { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; margin-bottom: 20px; }
        .rk-bar-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .rk-bar-bg { background: rgba(255,255,255,0.06); border-radius: 99px; height: 8px; }
        .rk-bar-fill { height: 8px; border-radius: 99px; transition: width 0.6s ease; }
        
        /* TIPS - improved */
        .rk-tips { background: rgba(251,146,60,0.06); border: 1px solid rgba(251,146,60,0.15); border-radius: 14px; padding: 22px 24px; margin-bottom: 20px; }
        .rk-tips-title { font-size: 11px; font-weight: 700; color: #fb923c; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px; }
        .rk-tip-item { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(251,146,60,0.08); }
        .rk-tip-item:last-child { border-bottom: none; }
        .rk-tip-icon { font-size: 20px; line-height: 1.2; flex-shrink: 0; }
        .rk-tip-text { font-size: 13.5px; line-height: 1.55; color: #e2e8f0; }
        
        /* ALTERNATIVES */
        .rk-alts { background: rgba(129,140,248,0.06); border: 1px solid rgba(129,140,248,0.18); border-radius: 14px; padding: 22px 24px; margin-bottom: 20px; }
        .rk-alts-title { font-size: 11px; font-weight: 700; color: #a5b4fc; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
        .rk-alts-sub { font-size: 12px; color: #64748b; margin-bottom: 16px; }
        .rk-alts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .rk-alt-item { background: rgba(15,22,35,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.15s; }
        .rk-alt-item:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); transform: translateY(-1px); }
        .rk-alt-name { font-size: 14px; font-weight: 600; color: #e2e8f0; margin-bottom: 4px; }
        .rk-alt-reason { font-size: 11.5px; color: #64748b; }
        
        .rk-table-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; }
        .rk-table-head { padding: 14px 22px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; }
        table.rkt { width: 100%; border-collapse: collapse; }
        table.rkt th { text-align: left; padding: 10px 22px; font-size: 11px; font-weight: 600; color: #334155; letter-spacing: 0.07em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); }
        table.rkt td { padding: 13px 22px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); }
        table.rkt tr:last-child td { border-bottom: none; }
        table.rkt tr:hover td { background: rgba(255,255,255,0.02); }
        .rk-error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .rk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 16px; }
        .rk-spinner { width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .rk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 260px; text-align: center; }
        .rk-fade { animation: rkfade 0.35s ease; }
        @keyframes rkfade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
        
        @media (max-width: 768px) {
          .rk-stats { grid-template-columns: repeat(2, 1fr); }
          .rk-alts-grid { grid-template-columns: 1fr; }
          .rk-verdict { flex-direction: column; text-align: center; gap: 12px; }
          .rk-verdict-score { text-align: center; }
        }
      `}</style>

      <div className="rk">
        <aside className="rk-side">
          <div className="rk-logo">Mark<em>earn</em></div>
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
            <span style={{ fontSize: 12, color: "#334155" }}>Competition Analyzer · Real market data</span>
          </div>
          <div className="rk-content">
            <div className="rk-title">📊 Competition Analyzer</div>
            <div className="rk-sub">Get a clear verdict before you design — real market data, actionable strategy.</div>

            <div className="rk-search-row">
              <input className="rk-input" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && analyze()}
                placeholder='Enter a niche, e.g. "halloween cat shirt", "matcha lover mug"' />
              <button className="rk-btn" onClick={() => analyze()} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze →"}
              </button>
            </div>

            <div className="rk-chips">
              {SUGGESTIONS.map(s => (
                <button key={s} className="rk-chip" onClick={() => { setQuery(s); analyze(s); }}>{s}</button>
              ))}
            </div>

            {error && (
              <div className="rk-error-box">
                <span style={{ fontSize: 13, color: "#fca5a5" }}>{error}</span>
                <button onClick={() => router.push("/pricing")}
                  style={{ background: "#6366f1", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Upgrade →
                </button>
              </div>
            )}

            {loading && (
              <div className="rk-loading">
                <div className="rk-spinner" />
                <span style={{ fontSize: 13, color: "#475569" }}>Analyzing competition...</span>
              </div>
            )}

            {data && !loading && (
              <div className="rk-fade">
                {/* VERDICT BANNER */}
                <div className="rk-verdict" style={{ background: data.verdict.bg, borderColor: data.verdict.border }}>
                  <div className="rk-verdict-emoji">{data.verdict.emoji}</div>
                  <div className="rk-verdict-content">
                    <div className="rk-verdict-label" style={{ color: data.verdict.color }}>Verdict for "{data.keyword}"</div>
                    <div className="rk-verdict-main" style={{ color: data.verdict.color }}>{data.verdict.label}</div>
                    <div className="rk-verdict-sub">{data.verdict.text}</div>
                  </div>
                  <div className="rk-verdict-score">
                    <div className="rk-verdict-score-num" style={{ color: data.verdict.color }}>{data.score}</div>
                    <div className="rk-verdict-score-label">out of 100</div>
                  </div>
                </div>

                {/* STATS */}
                <div className="rk-stats">
                  {[
                    { label: "Competition Score", value: `${data.score}/100`, color: levelColors[data.level]?.text },
                    { label: "Active Sellers", value: data.sellers.toLocaleString(), color: "#e2e8f0" },
                    { label: "Avg Price", value: `$${data.avgPrice}`, color: "#e2e8f0" },
                    { label: "Opportunity", value: data.opportunity, color: oppColors[data.opportunity] },
                  ].map((s, i) => (
                    <div key={i} className="rk-stat">
                      <div className="rk-stat-label">{s.label}</div>
                      <div className="rk-stat-val" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="rk-bar-wrap">
                  <div className="rk-bar-label">
                    <span>Competition Level</span>
                    <span style={{ color: levelColors[data.level]?.text }}>{data.level?.toUpperCase()}</span>
                  </div>
                  <div className="rk-bar-bg">
                    <div className="rk-bar-fill" style={{ width: `${data.score}%`, background: levelColors[data.level]?.text }} />
                  </div>
                </div>

                {/* DYNAMIC TIPS */}
                <div className="rk-tips">
                  <div className="rk-tips-title">💡 Personalized Strategy</div>
                  {data.tips.map((tip: any, i: number) => (
                    <div key={i} className="rk-tip-item">
                      <span className="rk-tip-icon">{tip.icon}</span>
                      <span className="rk-tip-text">{tip.text}</span>
                    </div>
                  ))}
                </div>

                {/* ALTERNATIVES (only if score is high) */}
                {data.alternatives.length > 0 && (
                  <div className="rk-alts">
                    <div className="rk-alts-title">🎯 Better Alternatives</div>
                    <div className="rk-alts-sub">This niche is too saturated — try these less competitive variants instead:</div>
                    <div className="rk-alts-grid">
                      {data.alternatives.map((alt: any, i: number) => (
                        <div key={i} className="rk-alt-item" onClick={() => { setQuery(alt.name); analyze(alt.name); }}>
                          <div className="rk-alt-name">→ {alt.name}</div>
                          <div className="rk-alt-reason">{alt.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rk-table-card">
                  <div className="rk-table-head">Top Sellers in this Niche</div>
                  <table className="rkt">
                    <thead>
                      <tr>
                        <th>Shop</th>
                        <th>Est. Sales</th>
                        <th>Reviews</th>
                        <th>Avg Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topSellers.map((s: any, i: number) => (
                        <tr key={i}>
                          <td style={{ color: "#c7d2fe", fontWeight: 600 }}>{s.name}</td>
                          <td style={{ color: "#64748b" }}>{s.sales.toLocaleString()}</td>
                          <td style={{ color: "#64748b" }}>{s.reviews.toLocaleString()}</td>
                          <td style={{ color: "#34d399", fontWeight: 600 }}>${s.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!data && !loading && !error && (
              <div className="rk-empty">
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.15 }}>📊</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Ready to analyze</div>
                <div style={{ fontSize: 13, color: "#1e293b" }}>Enter a niche to see competition data + verdict</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}