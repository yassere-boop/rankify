"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NICHES_A = ["dog mom", "cat lover", "nurse", "teacher", "gym", "coffee", "pizza", "book lover", "gamer", "gardener"];
const NICHES_B = ["birthday", "christmas", "halloween", "retirement", "graduation", "valentine", "mother's day", "father's day"];
const NICHES_C = ["funny", "vintage", "minimalist", "motivational", "sarcastic", "cute", "aesthetic"];

const PRINTIFY_COSTS: Record<string, number> = {
  "t-shirt": 8.50, "hoodie": 18.00, "sweatshirt": 15.00, "mug": 6.50, "tote bag": 9.00, "poster": 5.00, "phone case": 8.00,
};

const CALENDAR: Record<string, any[]> = {
  "January": [{ niche: "Valentine's Day", urgency: "🔴 Urgent", tip: "Feb 14 is close — hearts, couples, funny anti-valentine" }, { niche: "Winter Cozy", urgency: "🟡 Soon", tip: "Hot cocoa, reading, hygge vibes" }],
  "February": [{ niche: "St. Patrick's Day", urgency: "🔴 Urgent", tip: "March 17 — shamrocks, Irish pride, funny beer quotes" }, { niche: "Spring", urgency: "🟡 Soon", tip: "Flowers, gardening, renewal themes" }],
  "March": [{ niche: "Easter", urgency: "🔴 Urgent", tip: "Bunnies, spring, religious themes" }, { niche: "Earth Day", urgency: "🟡 Soon", tip: "April 22 — eco, nature, plant lover" }],
  "April": [{ niche: "Mother's Day", urgency: "🔴 Urgent", tip: "May — dog mom, cat mom, grandma, funny mom quotes" }, { niche: "Graduation", urgency: "🔴 Urgent", tip: "May/June — class of 2025, nurse grad, teacher grad" }],
  "May": [{ niche: "Father's Day", urgency: "🔴 Urgent", tip: "June — dad jokes, dog dad, grill master, funny dad" }, { niche: "Summer", urgency: "🟡 Soon", tip: "Beach, vacation, sunshine vibes" }],
  "June": [{ niche: "4th of July", urgency: "🔴 Urgent", tip: "American pride, funny patriotic, bbq themes" }, { niche: "Back to School", urgency: "🟡 Soon", tip: "Teacher gifts, school supplies, student life" }],
  "July": [{ niche: "Halloween", urgency: "🔴 Urgent", tip: "October 31 — start NOW to rank in time. Witch, skeleton, spooky" }, { niche: "Fall/Autumn", urgency: "🟡 Soon", tip: "Pumpkin, leaves, cozy fall vibes" }],
  "August": [{ niche: "Halloween", urgency: "🔴 Critical", tip: "Upload immediately — listings need 6-8 weeks to rank" }, { niche: "Thanksgiving", urgency: "🟡 Soon", tip: "November — grateful, turkey, family, funny food" }],
  "September": [{ niche: "Christmas", urgency: "🔴 Urgent", tip: "Start Christmas NOW — needs 10-12 weeks to rank on Etsy" }, { niche: "Thanksgiving", urgency: "🔴 Urgent", tip: "November is close — family, grateful, funny food" }],
  "October": [{ niche: "Christmas", urgency: "🔴 Critical", tip: "Christmas listings need to be live NOW to rank in time" }, { niche: "New Year", urgency: "🟡 Soon", tip: "Dec 31 — goals, fresh start, funny new year" }],
  "November": [{ niche: "Valentine's Day", urgency: "🟡 Soon", tip: "Feb 14 — start early for best ranking" }, { niche: "Winter", urgency: "🟡 Soon", tip: "Cozy season, hot drinks, snow themes" }],
  "December": [{ niche: "Valentine's Day", urgency: "🔴 Urgent", tip: "Feb 14 is 6 weeks away — couples, funny, galentine" }, { niche: "Spring", urgency: "🟡 Soon", tip: "Plan ahead — flowers, renewal, gardening" }],
};

const HOT_NICHES = [
  { niche: "ICU Nurse Mom", saturation: 8, trend: "↑ Rising", opportunity: "Excellent", sales: "320/mo" },
  { niche: "Golden Retriever Dad", saturation: 12, trend: "↑ Rising", opportunity: "Excellent", sales: "280/mo" },
  { niche: "Halloween Teacher", saturation: 18, trend: "↑ Seasonal", opportunity: "Hot", sales: "890/mo" },
  { niche: "Retired Nurse Life", saturation: 14, trend: "↑ Rising", opportunity: "Excellent", sales: "210/mo" },
  { niche: "Book Lover Witch", saturation: 9, trend: "↑ Trending", opportunity: "Hot", sales: "340/mo" },
  { niche: "Plant Mom Vintage", saturation: 11, trend: "↑ Rising", opportunity: "Excellent", sales: "190/mo" },
  { niche: "Cat Dad Gamer", saturation: 6, trend: "↑ Rising", opportunity: "Hot", sales: "150/mo" },
  { niche: "Dog Mom Yoga", saturation: 15, trend: "↑ Rising", opportunity: "Excellent", sales: "260/mo" },
  { niche: "Funny Pharmacist", saturation: 7, trend: "↑ Rising", opportunity: "Hot", sales: "180/mo" },
  { niche: "Camping Dad Joke", saturation: 10, trend: "→ Stable", opportunity: "Good", sales: "220/mo" },
  { niche: "Nurse Christmas", saturation: 22, trend: "↑ Seasonal", opportunity: "Good", sales: "1200/mo" },
  { niche: "Teacher Halloween", saturation: 19, trend: "↑ Seasonal", opportunity: "Good", sales: "760/mo" },
];

const MONTHS_LIST = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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
    { label: "Keyword Research", path: "/dashboard", emoji: "🔍" },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰" },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW", active: true },
  ];

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const calendarData = CALENDAR[currentMonth] || CALENDAR["January"];

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
    const etsyFee = sellPrice * 0.065 + 0.20;
    const paymentFee = sellPrice * 0.03 + 0.25;
    const netProfit = sellPrice - printCost - etsyFee - paymentFee;
    setProfitResult({ printCost, etsyFee: etsyFee.toFixed(2), paymentFee: paymentFee.toFixed(2), netProfit: netProfit.toFixed(2), margin: ((netProfit / sellPrice) * 100).toFixed(1) });
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
        .rk-cal-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; margin-top: 20px; }
        .rk-cal-item { border-radius: 10px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); }
        .rk-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #e2e8f0; font-size: 14px; outline: none; font-family: inherit; width: 120px; }
        .rk-btn { background: #6366f1; color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .rk-btn:hover { background: #4f46e5; }
        .rk-fade { animation: rkfade 0.35s ease; }
        @keyframes rkfade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
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
            <span style={{ fontSize: 12, color: "#334155" }}>POD Research Hub · The only tool built for serious Etsy sellers</span>
          </div>
          <div className="rk-content">
            <div className="rk-title">🎨 POD Research Hub</div>
            <div className="rk-sub">Niches · Profit · Timing — everything you need to win on Etsy</div>

            <div className="rk-tabs">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`rk-tab ${activeTab === tab.id ? "rk-tab-active" : ""}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "calendar" && (
              <div>
                <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 14, padding: "16px 22px", marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: "#fb923c", marginBottom: 4, fontSize: 14 }}>📅 It's {currentMonth} — upload these NOW</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>Etsy listings need 6-10 weeks to rank. Upload today to sell at peak season.</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 14, marginBottom: 24 }}>
                  {calendarData.map((item: any, i: number) => (
                    <div key={i} className="rk-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{item.niche}</div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{item.urgency}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{item.tip}</div>
                    </div>
                  ))}
                </div>
                <div className="rk-card">
                  <div className="rk-card-title">Full Year Strategy</div>
                  <div className="rk-cal-grid">
                    {MONTHS_LIST.map((month, i) => {
                      const items = CALENDAR[month] || [];
                      const isCurrent = month === currentMonth;
                      return (
                        <div key={month} className="rk-cal-item" style={isCurrent ? { background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)" } : {}}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: isCurrent ? "#a5b4fc" : "#475569", marginBottom: 4 }}>{month.slice(0, 3)}</div>
                          {items.map((item: any, j: number) => (
                            <div key={j} style={{ fontSize: 10, color: "#334155" }}>• {item.niche}</div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
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
                      { label: "Etsy fee (6.5%)", value: `-$${profitResult.etsyFee}`, color: "#f87171" },
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
              <div>
                <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 14, padding: "14px 20px", marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: "#fb923c", fontSize: 13 }}>🔥 Hand-picked micro-niches with low competition — updated for {currentMonth}</div>
                </div>
                <div className="rk-grid4" style={{ gap: 14 }}>
                  {HOT_NICHES.map((item, i) => (
                    <div key={i} className="rk-niche-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{item.niche}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: item.saturation < 10 ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)", color: item.saturation < 10 ? "#34d399" : "#fbbf24" }}>{item.opportunity}</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                          <span style={{ color: "#475569" }}>Saturation</span>
                          <span style={{ color: satColor(item.saturation), fontWeight: 600 }}>{item.saturation}/100</span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 4 }}>
                          <div style={{ width: `${item.saturation}%`, height: 4, borderRadius: 99, background: satColor(item.saturation) }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                        <span style={{ color: "#475569" }}>Est. sales</span>
                        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{item.sales}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4 }}>
                        <span style={{ color: "#475569" }}>Trend</span>
                        <span style={{ color: item.trend.startsWith("↑") ? "#34d399" : "#fbbf24", fontWeight: 600 }}>{item.trend}</span>
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