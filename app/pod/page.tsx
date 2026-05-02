"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DashLayout from "../components/DashLayout";

const NICHES_A = ["dog mom", "cat lover", "nurse", "teacher", "gym", "coffee", "pizza", "book lover", "gamer", "gardener"];
const NICHES_B = ["birthday", "christmas", "halloween", "retirement", "graduation", "valentine", "mother's day", "father's day"];
const NICHES_C = ["funny", "vintage", "minimalist", "motivational", "sarcastic", "cute", "aesthetic"];

const PRINTIFY_COSTS: Record<string, number> = {
  "t-shirt": 8.50, "hoodie": 18.00, "sweatshirt": 15.00, "mug": 6.50, "tote bag": 9.00, "poster": 5.00, "phone case": 8.00,
};

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
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyLabel(days: number) {
  if (days < 0) return { label: "Already passed", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.06)" };
  if (days <= 21) return { label: "🔴 CRITICAL", color: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.25)" };
  if (days <= 56) return { label: "⚠️ Urgent", color: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.25)" };
  if (days <= 84) return { label: "🟡 Upload now", color: "#fb923c", bg: "rgba(251,146,60,0.06)", border: "rgba(251,146,60,0.25)" };
  return { label: "✅ Plenty of time", color: "#34d399", bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.25)" };
}

function getUpcomingEvents() {
  return EVENTS_2026.map((e) => ({ ...e, days: daysUntil(e.date) })).filter((e) => e.days >= 0).sort((a, b) => a.days - b.days).slice(0, 4);
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
      keywords: parts.map((p) => [`funny ${p}`, `${p} gift`, `${p} shirt`, `${p} lover`]).flat().slice(0, 8),
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

  const tabStyle = (active: boolean) => ({
    padding: "9px 18px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: `1px solid ${active ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.06)"}`,
    background: active ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.02)",
    color: active ? "#c4b5fd" : "rgba(255,255,255,0.5)",
    transition: "all 0.15s",
    fontFamily: "inherit" as const,
  });

  const pillBase = (color: "a" | "b" | "c", active: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      a: { bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.3)", text: "#fb923c" },
      b: { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", text: "#c4b5fd" },
      c: { bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.3)", text: "#f9a8d4" },
    };
    return {
      padding: "6px 13px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      border: `1px solid ${active ? colors[color].border : "rgba(255,255,255,0.06)"}`,
      background: active ? colors[color].bg : "rgba(255,255,255,0.02)",
      color: active ? colors[color].text : "rgba(255,255,255,0.5)",
      transition: "all 0.12s",
      fontFamily: "inherit" as const,
    };
  };

  return (
    <DashLayout topbarLabel="POD Research Hub · Built for serious POD sellers">
      <div className="dash-hero-title">POD <em>research hub.</em></div>
      <div className="dash-hero-sub">Niches · Profit · Timing — everything you need to win on Etsy, Redbubble, TeePublic & Amazon Merch.</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(activeTab === tab.id)}>{tab.label}</button>
        ))}
      </div>

      {/* CALENDAR TAB */}
      {activeTab === "calendar" && (
        <div className="fade-up">
          <div style={{ background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 16, padding: "18px 24px", marginBottom: 20, backdropFilter: "blur(12px)" }}>
            <div style={{ fontWeight: 700, color: "#fb923c", marginBottom: 4, fontSize: 14 }}>📅 Live countdown — upload now to rank in time</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>POD platforms need 6-10 weeks to rank new listings. Critical events highlighted in red.</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
            {upcomingEvents.map((event: any, i: number) => {
              const urg = getUrgencyLabel(event.days);
              const date = new Date(event.date);
              const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              return (
                <div key={i} style={{ borderRadius: 16, padding: "22px 24px", border: `1px solid ${urg.border}`, background: urg.bg, backdropFilter: "blur(12px)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: urg.color, letterSpacing: "-0.02em" }}>{event.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{dateStr}</div>
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, background: urg.border, color: urg.color, flexShrink: 0 }}>{urg.label}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div className="serif" style={{ fontSize: 48, color: urg.color, lineHeight: 1 }}>{event.days}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>days remaining</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Etsy ranking lag:</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: event.days < 56 ? "#f87171" : "#34d399" }}>{event.days < 56 ? "⚠️ Rush mode" : "✅ Safe window"}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>🎯 Top 5 Niches to Launch</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {event.topNiches.map((niche: string, j: number) => (
                      <div key={j} onClick={() => router.push(`/competition?q=${encodeURIComponent(niche)}`)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.85)", cursor: "pointer", transition: "all 0.15s" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", minWidth: 18 }}>#{j + 1}</span>
                        <span style={{ flex: 1 }}>{niche}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>→</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COMBINATOR TAB */}
      {activeTab === "combinator" && (
        <div className="fade-up">
          <div className="dash-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Combine niches to find ultra-low competition angles</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#fb923c", marginBottom: 10, letterSpacing: "0.08em" }}>IDENTITY</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {NICHES_A.map((n) => <button key={n} onClick={() => setComboA(n)} style={pillBase("a", comboA === n)}>{n}</button>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#c4b5fd", marginBottom: 10, letterSpacing: "0.08em" }}>EVENT</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {NICHES_B.map((n) => <button key={n} onClick={() => setComboB(n)} style={pillBase("b", comboB === n)}>{n}</button>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#f9a8d4", marginBottom: 10, letterSpacing: "0.08em" }}>STYLE</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {NICHES_C.map((n) => <button key={n} onClick={() => setComboC(n)} style={pillBase("c", comboC === n)}>{n}</button>)}
                </div>
              </div>
            </div>
            <button onClick={handleCombo} disabled={!comboA} style={{ background: comboA ? "white" : "rgba(255,255,255,0.05)", color: comboA ? "black" : "rgba(255,255,255,0.3)", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 600, cursor: comboA ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}>
              🔍 Analyze this combo
            </button>
          </div>

          {comboResult && (
            <div className="dash-card fade-up">
              <div className="serif" style={{ fontSize: 28, color: "#fb923c", marginBottom: 18, lineHeight: 1.1 }}>"{comboResult.combo}"</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Saturation", value: `${comboResult.saturation}/100`, color: satColor(comboResult.saturation) },
                  { label: "Competing Listings", value: comboResult.listings, color: "white" },
                  { label: "Opportunity", value: comboResult.opportunity, color: "#34d399" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{s.label}</div>
                    <div className="serif" style={{ fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 12, padding: "13px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>{comboResult.tip}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Suggested Keywords</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {comboResult.keywords.map((kw: string, i: number) => (
                  <span key={i} style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)", color: "#c4b5fd", fontSize: 12 }}>{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROFIT TAB */}
      {activeTab === "profit" && (
        <div className="fade-up" style={{ maxWidth: 560 }}>
          <div className="dash-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Product Type</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.keys(PRINTIFY_COSTS).map((p) => (
                <button key={p} onClick={() => setProduct(p)} style={pillBase("b", product === p)}>{p} (${PRINTIFY_COSTS[p]})</button>
              ))}
            </div>
          </div>
          <div className="dash-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Selling Price</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }}>$</span>
              <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit", width: 130 }} />
              <button onClick={handleProfit} style={{ background: "white", color: "black", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>Calculate →</button>
            </div>
          </div>

          {profitResult && (
            <div className="dash-card fade-up">
              {[
                { label: "Selling price", value: `$${sellPrice}`, color: "white" },
                { label: `Printify cost (${product})`, value: `-$${profitResult.printCost}`, color: "#f87171" },
                { label: "Platform fee (6.5%)", value: `-$${profitResult.platformFee}`, color: "#f87171" },
                { label: "Payment fee (3%)", value: `-$${profitResult.paymentFee}`, color: "#f87171" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Net Profit</span>
                <span className="serif" style={{ fontSize: 32, color: profitColor(Number(profitResult.netProfit)), lineHeight: 1 }}>${profitResult.netProfit}</span>
              </div>
              <div style={{
                textAlign: "center", marginTop: 14, padding: "12px",
                borderRadius: 12,
                background: Number(profitResult.netProfit) > 10 ? "rgba(52,211,153,0.06)" : "rgba(248,113,113,0.06)",
                border: `1px solid ${Number(profitResult.netProfit) > 10 ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
              }}>
                <span style={{ fontSize: 13, color: profitColor(Number(profitResult.netProfit)) }}>
                  {Number(profitResult.netProfit) > 15 ? "✅ Excellent margin" : Number(profitResult.netProfit) > 8 ? "⚠️ Decent — raise price by $2-3" : "❌ Too thin — raise your price"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* HOT NICHES TAB */}
      {activeTab === "niches" && (
        <div className="fade-up">
          <div style={{ background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 16, padding: "16px 22px", marginBottom: 20, backdropFilter: "blur(12px)" }}>
            <div style={{ fontWeight: 700, color: "#fb923c", fontSize: 13 }}>🔥 Hand-picked micro-niches with low competition — updated for {currentMonth}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {HOT_NICHES.map((item, i) => (
              <div key={i} className="dash-card" style={{ marginBottom: 0, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: 1.3 }}>{item.niche}</div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: item.saturation < 10 ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)", color: item.saturation < 10 ? "#34d399" : "#fbbf24", flexShrink: 0 }}>{item.opportunity}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>Saturation</span>
                    <span style={{ color: satColor(item.saturation), fontWeight: 600 }}>{item.saturation}/100</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 99, height: 4 }}>
                    <div style={{ width: `${item.saturation}%`, height: 4, borderRadius: 99, background: satColor(item.saturation) }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Est. sales</span>
                  <span style={{ color: "white", fontWeight: 600 }}>{item.sales}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Trend</span>
                  <span style={{ color: item.trend.startsWith("↑") ? "#34d399" : "#fbbf24", fontWeight: 600 }}>{item.trend}</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, padding: "9px 11px", background: "rgba(167,139,250,0.04)", borderRadius: 8, borderLeft: "2px solid rgba(167,139,250,0.3)" }}>
                  💡 {item.why}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashLayout>
  );
}