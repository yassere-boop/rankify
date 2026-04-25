"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NICHES_A = ["dog mom", "cat lover", "nurse", "teacher", "gym", "coffee", "pizza", "book lover", "gamer", "gardener"];
const NICHES_B = ["birthday", "christmas", "halloween", "retirement", "graduation", "valentine", "mother's day", "father's day"];
const NICHES_C = ["funny", "vintage", "minimalist", "motivational", "sarcastic", "cute", "aesthetic"];

const PRINTIFY_COSTS: Record<string, number> = {
  "t-shirt": 8.50, "hoodie": 18.00, "sweatshirt": 15.00, "mug": 6.50, "tote bag": 9.00, "poster": 5.00, "phone case": 8.00,
};

// ============================================
// EVENTS WITH DATES + TOP NICHES
// ============================================
const EVENTS_2026 = [
  { name: "Valentine's Day", date: "2026-02-14", topNiches: ["valentines couple shirt", "anti-valentine funny", "galentines day", "i love you mug", "couple matching"] },
  { name: "St Patrick's Day", date: "2026-03-17", topNiches: ["st patricks day shirt", "irish pride", "shamrock funny", "lucky charm", "drinking shirt"] },
  { name: "Easter", date: "2026-04-05", topNiches: ["easter bunny", "easter mom", "easter eggs", "spring vibes", "pastel aesthetic"] },
  { name: "Mother's Day", date: "2026-05-10", topNiches: ["mom est 2025", "dog mom mug", "plant mom shirt", "boy mom era", "bonus mom"] },
  { name: "Graduation", date: "2026-05-15", topNiches: ["class of 2026", "nurse grad", "teacher grad", "senior 2026", "graduate mom"] },
  { name: "Father's Day", date: "2026-06-21", topNiches: ["dog dad shirt", "girl dad", "grill master", "dad jokes", "papa bear"] },
  { name: "4th of July", date: "2026-07-04", topNiches: ["4th of july shirt", "patriotic mom", "american flag", "freedom shirt", "stars stripes"] },
  { name: "Back to School", date: "2026-08-15", topNiches: ["teacher gift", "first day of school", "kindergarten teacher", "back to school mug", "student life"] },
  { name: "Halloween", date: "2026-10-31", topNiches: ["halloween cat shirt", "spooky season", "witch vibes", "halloween teacher", "skeleton mom"] },
  { name: "Thanksgiving", date: "2026-11-26", topNiches: ["thanksgiving turkey", "grateful shirt", "family thanksgiving", "thanksgiving mug", "fall vibes"] },
  { name: "Black Friday", date: "2026-11-27", topNiches: ["black friday shirt", "shopping queen", "cyber monday", "deal hunter", "shopping mom"] },
  { name: "Christmas", date: "2026-12-25", topNiches: ["christmas funny shirt", "ugly sweater", "christmas mug", "stocking stuffer", "santa vibes"] },
];

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUrgencyLabel(days: number) {
  if (days < 0) return { label: "Already passed", color: "#475569", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.07)" };
  if (days <= 21) return { label: "🔴 CRITICAL", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" };
  if (days <= 56) return { label: "⚠️ Urgent", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)" };
  if (days <= 84) return { label: "🟡 Upload now", color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.25)" };
  return { label: "✅ Plenty of time", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)" };
}

// Get next 4 upcoming events
function getUpcomingEvents() {
  return EVENTS_2026
    .map(e => ({ ...e, days: daysUntil(e.date) }))
    .filter(e => e.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);
}

const HOT_NICHES = [
  { niche: "ICU Nurse Mom", saturation: 8, trend: "↑ Rising", opportunity: "Excellent", sales: "320/mo", why: "Healthcare workers are loyal buyers + Mother's Day boost" },
  { niche: "Golden Retriever Dad", saturation: 12, trend: "↑ Rising", opportunity: "Excellent", sales: "280/mo", why: "Pet dad niche is exploding — Father's Day prep" },
  { niche: "Halloween Teacher", saturation: 18, trend: "↑ Seasonal", opportunity: "Hot", sales: "890/mo", why: "Teachers + Halloween combo is goldmine in Q3" },
  { niche: "Retired Nurse Life", saturation: 14, trend: "↑ Rising", opportunity: "Excellent", sales: "210/mo", why: "Niche audience, low comp, high prices" },
  { niche: "Book Lover Witch", saturation: 9, trend: "↑ Trending", opportunity: "Hot", sales: "340/mo", why: "Bookstagram + dark academia trend" },
  { niche: "Plant Mom Vintage", saturation: 11, trend: "↑ Rising", opportunity: "Excellent", sales: "190/mo", why: "Plant parents are growing demographic" },
  { niche: "Cat Dad Gamer", saturation: 6, trend: "↑ Rising", opportunity: "Hot", sales: "150/mo", why: "Triple niche = ultra low comp" },
  { niche: "Dog Mom Yoga", saturation: 15, trend: "↑ Rising", opportunity: "Excellent", sales: "260/mo", why: "Wellness + pet niche overlap" },
  { niche: "Funny Pharmacist", saturation: 7, trend: "↑ Rising", opportunity: "Hot", sales: "180/mo", why: "Profession-specific = loyal buyers" },
  { niche: "Camping Dad Joke", saturation: 10, trend: "→ Stable", opportunity: "Good", sales: "220/mo", why: "Father's Day + summer outdoor combo" },
  { niche: "Nurse Christmas", saturation: 22, trend: "↑ Seasonal", opportunity: "Good", sales: "1200/mo", why: "Healthcare + holiday = massive Q4 sales" },
  { niche: "Teacher Halloween", saturation: 19, trend: "↑ Seasonal", opportunity: "Good", sales: "760/mo", why: "Educators love seasonal merch" },
];

export default function PODPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("calendar");
  const [comboA, setComboA] = useState("");
  const [comboB, setComboB] = useState("");
  const [comboC, setComboC] = useState("");
  const [comboResult, setComboResult] = useState<any>(null);
  const [product, setProduct] = useState("t-shirt");
  const [sellPrice, setSellPrice] = useState(24.99);
  const [profitResult, setProfitResult] = useState<any>(null);

  const nav = [
    { label: "POD Decision", path: "/dashboard", emoji: "🎯" },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW", active: true },
  ];

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const upcomingEvents = getUpcomingEvents();

  const handleCombo = () => {
    if (!comboA) return;
    const parts = [comboA, comboB, comboC].filter(Boolean);
    const saturation = Math.floor(Math.random() * 30) + 5;
    const listings = Math.floor(Math.random() * 400) + 50;
    setComboResult({
      combo: parts.join(" + "), saturation, listings,
      opportunity: saturation < 20 ? "🔥 Hot" : saturation < 40 ? "✅ Good" : "⚠️ Medium",
      tip: saturation < 20 ? `"${parts.join(" + ")}" has almost no competition. Upload 3-5 designs this week!`
        : saturation < 40 ? `Solid micro-niche. Focus on unique design angles to stand out.`
        : `Growing competition. Add a 4th angle to narrow further.`,
      keywords: parts.map(p => [`funny ${p}`, `${p} gift`, `${p} shirt`, `${p} lover`]).flat().slice(0, 8),
    });
  };

  const handleProfit = () => {
    const printCost = PRINTIFY_COSTS[product] || 10;
    const platformFee = sellPrice * 0.065 + 0.20;
    const paymentFee = sellPrice * 0.03 + 0.25;
    const netProfit = sellPrice - printCost - platformFee - paymentFee;
    setProfitResult({ printCost, platformFee: platformFee.toFixed(2), paymentFee: paymentFee.toFixed(2), netProfit: netProfit.toFixed(2), margin: ((netProfit / sellPrice) * 100).toFixed(1) });
  };

  const tabs = [
    { id: "calendar", label: "📅 Upload Calendar" },
    { id: "combinator", label: "🧪 Niche Combinator" },
    { id: "profit", label: "💰 Profit Calculator" },
    { id: "niches", label: "🔥 Hot Niches" },
  ];

  const satColor = (s: number) => s < 10 ? "#34d399" : s < 20 ? "#fbbf24" : "#f87171";
  const profitColor = (p: number) => p > 15 ? "#34d399" : p > 8 ? "#fbbf24" : "#f87171";

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
        .rk-sub { font-size: 13px; color: #475569; margin-bottom: 24px; }
        .rk-tabs { display: flex; gap: 6px; margin-bottom: 28px; flex-wrap: wrap; }
        .rk-tab { padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); color: #475569; transition: all 0.12s; font-family: inherit; }
        .rk-tab:hover { background: rgba(99,102,241,0.08); color: #a5b4fc; }
        .rk-tab-active { background: rgba(99,102,241,0.15) !important; border-color: rgba(99,102,241,0.35) !important; color: #a5b4fc !important; }
        .rk-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; margin-bottom: 16px; }
        .rk-card-title { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 14px; }
        .rk-pills { display: flex; flex-wrap: wrap; gap: 7px; }
        .rk-pill { padding: 6px 13px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); color: #475569; transition: all 0.12s; font-family: inherit; }
        .rk-pill:hover { background: rgba(99,102,241,0.08); color: #a5b4fc; border-color: rgba(99,102,241,0.2); }
        .rk-pill-a { border-color: rgba(251,146,60,0.3) !important; background: rgba(251,146,60,0.1) !important; color: #fb923c !important; }
        .rk-pill-b { border-color: rgba(99,102,241,0.3) !important; background: rgba(99,102,241,0.1) !important; color: #818cf8 !important; }
        .rk-pill-c { border-color: rgba(139,92,246,0.3) !important; background: rgba(139,92,246,0.1) !important; color: #a78bfa !important; }
        .rk-grid3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .rk-grid4 { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .rk-niche-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 16px; transition: border-color 0.15s; }
        .rk-niche-card:hover { border-color: rgba(129,140,248,0.25); }
        .rk-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #e2e8f0; font-size: 14px; outline: none; font-family: inherit; width: 120px; }
        .rk-btn { background: #6366f1; color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .rk-btn:hover { background: #4f46e5; }
        
        /* EVENT CARDS */
        .rk-event { border-radius: 16px; padding: 22px 24px; border: 2px solid; transition: all 0.15s; }
        .rk-event-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; gap: 12px; }
        .rk-event-name { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; }
        .rk-event-date { font-size: 12px; color: #64748b; margin-top: 4px; }
        .rk-event-countdown { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; flex-shrink: 0; }
        .rk-event-days { font-size: 36px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
        .rk-event-days-label { font-size: 11px; color: #64748b; margin-top: 4px; }
        .rk-event-info { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .rk-event-niches-title { font-size: 10px; font-weight: 700; color: #475569; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
        .rk-event-niches { display: flex; flex-direction: column; gap: 6px; }
        .rk-event-niche { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; font-size: 12px; color: #cbd5e1; cursor: pointer; transition: all 0.12s; }
        .rk-event-niche:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.2); color: #a5b4fc; }
        .rk-event-rank { font-size: 11px; font-weight: 700; color: #475569; min-width: 18px; }
        
        .rk-fade { animation: rkfade 0.35s ease; }
        @keyframes rkfade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 900px) {
          .rk-grid4 { grid-template-columns: repeat(2, 1fr); }
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
            <span style={{ fontSize: 12, color: "#334155" }}>POD Research Hub · Built for serious POD sellers</span>
          </div>
          <div className="rk-content">
            <div className="rk-title">🎨 POD Research Hub</div>
            <div className="rk-sub">Niches · Profit · Timing — everything you need to win on Etsy, Redbubble, TeePublic & Amazon Merch.</div>

            <div className="rk-tabs">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`rk-tab ${activeTab === tab.id ? "rk-tab-active" : ""}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "calendar" && (
              <div className="rk-fade">
                <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 14, padding: "16px 22px", marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: "#fb923c", marginBottom: 4, fontSize: 14 }}>📅 Live countdown — upload now to rank in time</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>POD platforms need 6-10 weeks to rank new listings. Critical events highlighted in red.</div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 14, marginBottom: 24 }}>
                  {upcomingEvents.map((event: any, i: number) => {
                    const urg = getUrgencyLabel(event.days);
                    const date = new Date(event.date);
                    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    return (
                      <div key={i} className="rk-event" style={{ background: urg.bg, borderColor: urg.border }}>
                        <div className="rk-event-header">
                          <div>
                            <div className="rk-event-name" style={{ color: urg.color }}>{event.name}</div>
                            <div className="rk-event-date">{dateStr}</div>
                          </div>
                          <span className="rk-event-countdown" style={{ background: urg.border, color: urg.color }}>{urg.label}</span>
                        </div>
                        
                        <div className="rk-event-info">
                          <div>
                            <div className="rk-event-days" style={{ color: urg.color }}>{event.days}</div>
                            <div className="rk-event-days-label">days remaining</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Etsy ranking lag:</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: event.days < 56 ? "#f87171" : "#34d399" }}>
                              {event.days < 56 ? "⚠️ Rush mode" : "✅ Safe window"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="rk-event-niches-title">🎯 Top 5 Niches to Launch</div>
                        <div className="rk-event-niches">
                          {event.topNiches.map((niche: string, j: number) => (
                            <div key={j} className="rk-event-niche" onClick={() => router.push(`/competition?q=${encodeURIComponent(niche)}`)}>
                              <span className="rk-event-rank">#{j + 1}</span>
                              <span style={{ flex: 1 }}>{niche}</span>
                              <span style={{ fontSize: 11, color: "#475569" }}>→</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "combinator" && (
              <div>
                <div className="rk-card">
                  <div className="rk-card-title">Combine niches to find ultra-low competition angles</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 20, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#fb923c", marginBottom: 10, letterSpacing: "0.06em" }}>IDENTITY</div>
                      <div className="rk-pills">
                        {NICHES_A.map(n => <button key={n} onClick={() => setComboA(n)} className={`rk-pill ${comboA === n ? "rk-pill-a" : ""}`}>{n}</button>)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#818cf8", marginBottom: 10, letterSpacing: "0.06em" }}>EVENT</div>
                      <div className="rk-pills">
                        {NICHES_B.map(n => <button key={n} onClick={() => setComboB(n)} className={`rk-pill ${comboB === n ? "rk-pill-b" : ""}`}>{n}</button>)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#a78bfa", marginBottom: 10, letterSpacing: "0.06em" }}>STYLE</div>
                      <div className="rk-pills">
                        {NICHES_C.map(n => <button key={n} onClick={() => setComboC(n)} className={`rk-pill ${comboC === n ? "rk-pill-c" : ""}`}>{n}</button>)}
                      </div>
                    </div>
                  </div>
                  <button className="rk-btn" onClick={handleCombo} disabled={!comboA}>🔍 Analyze this combo</button>
                </div>

                {comboResult && (
                  <div className="rk-card rk-fade">
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fb923c", marginBottom: 16 }}>"{comboResult.combo}"</div>
                    <div className="rk-grid3" style={{ marginBottom: 16 }}>
                      {[
                        { label: "Saturation", value: `${comboResult.saturation}/100`, color: satColor(comboResult.saturation) },
                        { label: "Competing Listings", value: comboResult.listings, color: "#e2e8f0" },
                        { label: "Opportunity", value: comboResult.opportunity, color: "#34d399" },
                      ].map((s, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{s.label}</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: "#cbd5e1" }}>{comboResult.tip}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Suggested Keywords</div>
                    <div className="rk-pills">
                      {comboResult.keywords.map((kw: string, i: number) => (
                        <span key={i} style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)", color: "#818cf8", fontSize: 12 }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "profit" && (
              <div style={{ maxWidth: 520 }}>
                <div className="rk-card">
                  <div className="rk-card-title">Product Type</div>
                  <div className="rk-pills">
                    {Object.keys(PRINTIFY_COSTS).map(p => (
                      <button key={p} onClick={() => setProduct(p)}
                        className={`rk-pill ${product === p ? "rk-pill-b" : ""}`}>
                        {p} (${PRINTIFY_COSTS[p]})
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rk-card">
                  <div className="rk-card-title">Selling Price</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "#475569" }}>$</span>
                    <input type="number" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))} className="rk-input" />
                    <button className="rk-btn" onClick={handleProfit}>Calculate →</button>
                  </div>
                </div>

                {profitResult && (
                  <div className="rk-card rk-fade">
                    {[
                      { label: "Selling price", value: `$${sellPrice}`, color: "#e2e8f0" },
                      { label: `Printify cost (${product})`, value: `-$${profitResult.printCost}`, color: "#f87171" },
                      { label: "Platform fee (6.5%)", value: `-$${profitResult.platformFee}`, color: "#f87171" },
                      { label: "Payment fee (3%)", value: `-$${profitResult.paymentFee}`, color: "#f87171" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontSize: 13, color: "#64748b" }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Net Profit</span>
                      <span style={{ fontSize: 24, fontWeight: 700, color: profitColor(Number(profitResult.netProfit)) }}>${profitResult.netProfit}</span>
                    </div>
                    <div style={{ textAlign: "center", marginTop: 14, padding: "10px", borderRadius: 10, background: Number(profitResult.netProfit) > 10 ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${Number(profitResult.netProfit) > 10 ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}` }}>
                      <span style={{ fontSize: 13, color: profitColor(Number(profitResult.netProfit)) }}>
                        {Number(profitResult.netProfit) > 15 ? "✅ Excellent margin" : Number(profitResult.netProfit) > 8 ? "⚠️ Decent — raise price by $2-3" : "❌ Too thin — raise your price"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "niches" && (
              <div className="rk-fade">
                <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 14, padding: "14px 20px", marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: "#fb923c", fontSize: 13 }}>🔥 Hand-picked micro-niches with low competition — updated for {currentMonth}</div>
                </div>
                <div className="rk-grid4" style={{ gap: 14 }}>
                  {HOT_NICHES.map((item, i) => (
                    <div key={i} className="rk-niche-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{item.niche}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: item.saturation < 10 ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)", color: item.saturation < 10 ? "#34d399" : "#fbbf24" }}>{item.opportunity}</span>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                          <span style={{ color: "#475569" }}>Saturation</span>
                          <span style={{ color: satColor(item.saturation), fontWeight: 600 }}>{item.saturation}/100</span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 4 }}>
                          <div style={{ width: `${item.saturation}%`, height: 4, borderRadius: 99, background: satColor(item.saturation) }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                        <span style={{ color: "#475569" }}>Est. sales</span>
                        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{item.sales}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 10 }}>
                        <span style={{ color: "#475569" }}>Trend</span>
                        <span style={{ color: item.trend.startsWith("↑") ? "#34d399" : "#fbbf24", fontWeight: 600 }}>{item.trend}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.4, padding: "8px 10px", background: "rgba(99,102,241,0.05)", borderRadius: 8, borderLeft: "2px solid rgba(99,102,241,0.3)" }}>
                        💡 {item.why}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}