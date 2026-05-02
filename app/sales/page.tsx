"use client";
import { useState } from "react";
import DashLayout from "../components/DashLayout";

const PRODUCTS = [
  { name: "T-Shirt", printCost: 8.50, avgPrice: 24.99 },
  { name: "Hoodie", printCost: 18.00, avgPrice: 39.99 },
  { name: "Sweatshirt", printCost: 15.00, avgPrice: 34.99 },
  { name: "Mug", printCost: 6.50, avgPrice: 16.99 },
  { name: "Tote Bag", printCost: 9.00, avgPrice: 22.99 },
  { name: "Poster", printCost: 5.00, avgPrice: 19.99 },
  { name: "Phone Case", printCost: 8.00, avgPrice: 18.99 },
];

function getDynamicNiches() {
  const month = new Date().getMonth() + 1;
  const evergreen = [
    { name: "Dog Mom", monthlySearches: 4400, competition: 72 },
    { name: "Cat Lover", monthlySearches: 2900, competition: 65 },
    { name: "Nurse Gift", monthlySearches: 1800, competition: 45 },
    { name: "Teacher Gift", monthlySearches: 2200, competition: 55 },
  ];
  const seasonal: Record<number, any[]> = {
    1: [{ name: "Valentine's", monthlySearches: 14000, competition: 78 }],
    2: [{ name: "Valentine's", monthlySearches: 22000, competition: 80 }],
    3: [{ name: "St Patrick's", monthlySearches: 9500, competition: 60 }],
    4: [{ name: "Mother's Day", monthlySearches: 18000, competition: 70 }, { name: "Graduation", monthlySearches: 12000, competition: 65 }],
    5: [{ name: "Mother's Day", monthlySearches: 28000, competition: 75 }, { name: "Father's Day", monthlySearches: 15000, competition: 65 }],
    6: [{ name: "Father's Day", monthlySearches: 22000, competition: 70 }, { name: "Pride", monthlySearches: 8000, competition: 50 }],
    7: [{ name: "4th of July", monthlySearches: 16000, competition: 60 }, { name: "Halloween", monthlySearches: 8900, competition: 70 }],
    8: [{ name: "Back to School", monthlySearches: 14000, competition: 55 }, { name: "Halloween", monthlySearches: 18000, competition: 75 }],
    9: [{ name: "Halloween", monthlySearches: 35000, competition: 80 }, { name: "Christmas", monthlySearches: 14000, competition: 75 }],
    10: [{ name: "Halloween", monthlySearches: 55000, competition: 88 }, { name: "Christmas", monthlySearches: 25000, competition: 80 }],
    11: [{ name: "Christmas", monthlySearches: 45000, competition: 85 }, { name: "Thanksgiving", monthlySearches: 12000, competition: 60 }],
    12: [{ name: "Christmas", monthlySearches: 60000, competition: 90 }, { name: "New Year", monthlySearches: 8000, competition: 55 }],
  };
  return [...(seasonal[month] || []), ...evergreen].slice(0, 8);
}

export default function SalesEstimator() {
  const NICHES = getDynamicNiches();
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [niche, setNiche] = useState(NICHES[0]);
  const [sellPrice, setSellPrice] = useState(24.99);
  const [listings, setListings] = useState(10);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const platformFee = sellPrice * 0.065 + 0.20;
    const paymentFee = sellPrice * 0.03 + 0.25;
    const netProfit = sellPrice - product.printCost - platformFee - paymentFee;
    const margin = ((netProfit / sellPrice) * 100).toFixed(1);
    const competitionFactor = (100 - niche.competition) / 100;
    const searchFactor = Math.min(niche.monthlySearches / 10000, 1);
    const estimatedVisitors = niche.monthlySearches * searchFactor * competitionFactor * listings * 0.01;
    const monthlySales = Math.max(Math.floor(estimatedVisitors * 0.02 * listings), 1);
    const monthlyRevenue = (monthlySales * sellPrice).toFixed(2);
    const monthlyProfit = (monthlySales * netProfit).toFixed(2);
    const yearlyProfit = (Number(monthlyProfit) * 12).toFixed(2);
    const scaleListings = listings * 5;
    const scaleSales = Math.max(Math.floor(estimatedVisitors * 0.02 * scaleListings * 5), 1);
    const scaleProfit = (scaleSales * netProfit).toFixed(2);

    setResult({
      netProfit: netProfit.toFixed(2), margin, monthlySales,
      monthlyRevenue, monthlyProfit, yearlyProfit,
      platformFee: platformFee.toFixed(2), paymentFee: paymentFee.toFixed(2),
      scaleListings, scaleProfit,
      rating: netProfit > 12 && monthlySales > 50 ? "Excellent" : netProfit > 8 && monthlySales > 20 ? "Good" : "Low",
    });
  };

  const ratingColor = (r: string) => r === "Excellent" ? "#34d399" : r === "Good" ? "#fbbf24" : "#f87171";

  const getActionPlan = () => {
    if (!result) return [];
    const plan = [];
    if (result.rating === "Low") {
      plan.push({ icon: "💰", text: `Raise selling price to $${(sellPrice + 5).toFixed(2)} — adds $5 per sale` });
      plan.push({ icon: "🎯", text: `Switch to lower-competition niche (current: ${niche.competition}/100 competition)` });
      plan.push({ icon: "📦", text: `Lower-cost product: try Mug ($6.50) or Poster ($5) for better margins` });
    } else if (result.rating === "Good") {
      plan.push({ icon: "📈", text: `Scale to ${result.scaleListings} listings → est. $${result.scaleProfit}/mo profit (5x growth)` });
      plan.push({ icon: "💰", text: `Add personalization upsell (+$3-5 per sale) to boost margins` });
      plan.push({ icon: "🎨", text: `Test 3 design variations per listing to find winners` });
    } else {
      plan.push({ icon: "🚀", text: `You're on fire! Scale to ${result.scaleListings} listings → est. $${result.scaleProfit}/mo` });
      plan.push({ icon: "🌐", text: `Multi-list on Redbubble + TeePublic for free additional revenue` });
      plan.push({ icon: "💎", text: `Add premium variant at $${(sellPrice + 8).toFixed(2)} for higher margins` });
    }
    return plan;
  };

  const actionPlan = getActionPlan();

  const pillStyle = (active: boolean) => ({
    padding: "8px 16px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    border: `1px solid ${active ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.06)"}`,
    background: active ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.02)",
    color: active ? "#c4b5fd" : "rgba(255,255,255,0.5)",
    transition: "all 0.15s",
    fontFamily: "inherit" as const,
  });

  return (
    <DashLayout topbarLabel="Sales Estimator · POD profit calculator">
      <div className="dash-hero-title">Sales <em>estimator.</em></div>
      <div className="dash-hero-sub">Estimate your monthly sales, profit & action plan to reach those numbers.</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 16 }}>
        <div className="dash-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Product Type</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {PRODUCTS.map((p) => (
              <button key={p.name} onClick={() => { setProduct(p); setSellPrice(p.avgPrice); }} style={pillStyle(product.name === p.name)}>
                {p.name} · ${p.printCost}
              </button>
            ))}
          </div>
        </div>
        <div className="dash-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Niche (current season)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {NICHES.map((n) => (
              <button key={n.name} onClick={() => setNiche(n)} style={pillStyle(niche.name === n.name)}>{n.name}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 16 }}>
        <div className="dash-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Selling Price</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }}>$</span>
            <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit", width: 130 }} />
          </div>
        </div>
        <div className="dash-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Number of Listings</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {[5, 10, 25, 50, 100].map((n) => (
              <button key={n} onClick={() => setListings(n)} style={pillStyle(listings === n)}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={calculate} style={{ width: "100%", padding: "16px", borderRadius: 14, background: "white", color: "black", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 24, transition: "all 0.2s" }}>
        Calculate My Potential 🚀
      </button>

      {result && (
        <div className="fade-up">
          {/* MAIN STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Profit/Sale", value: `$${result.netProfit}`, sub: `${result.margin}% margin`, color: "#34d399" },
              { label: "Est. Monthly Sales", value: result.monthlySales, sub: `${listings} listings`, color: "white" },
              { label: "Monthly Revenue", value: `$${result.monthlyRevenue}`, sub: "gross", color: "white" },
              { label: "Monthly Profit", value: `$${result.monthlyProfit}`, sub: "after all fees", color: "#34d399" },
            ].map((s, i) => (
              <div key={i} className="dash-card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>{s.label}</div>
                <div className="serif" style={{ fontSize: 28, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* FEE BREAKDOWN */}
          <div className="dash-card">
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>💳 Fee Breakdown (per sale)</div>
            {[
              { label: "Selling price", value: `+$${sellPrice}`, color: "white" },
              { label: `${product.name} print cost (Printify)`, value: `-$${product.printCost}`, color: "#f87171" },
              { label: "Platform fee (6.5% + $0.20)", value: `-$${result.platformFee}`, color: "#f87171" },
              { label: "Payment fee (3% + $0.25)", value: `-$${result.paymentFee}`, color: "#f87171" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", fontSize: 13 }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 6 }}>
              <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>Net profit per sale</span>
              <span className="serif" style={{ color: "#34d399", fontSize: 22, lineHeight: 1 }}>${result.netProfit}</span>
            </div>
          </div>

          {/* BIG STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
            <div className="dash-card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Yearly Profit Potential</div>
              <div className="serif" style={{ fontSize: 42, color: "#c4b5fd", lineHeight: 1 }}>${result.yearlyProfit}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>if sales stay consistent</div>
            </div>
            <div className="dash-card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Overall Rating</div>
              <div className="serif" style={{ fontSize: 42, color: ratingColor(result.rating), lineHeight: 1 }}>{result.rating}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>based on margin & volume</div>
            </div>
          </div>

          {/* RATING BANNER */}
          <div style={{
            borderRadius: 14, padding: "16px 22px", marginBottom: 16,
            background: result.rating === "Excellent" ? "rgba(52,211,153,0.06)" : result.rating === "Good" ? "rgba(251,191,36,0.06)" : "rgba(248,113,113,0.06)",
            border: `1px solid ${result.rating === "Excellent" ? "rgba(52,211,153,0.2)" : result.rating === "Good" ? "rgba(251,191,36,0.2)" : "rgba(248,113,113,0.2)"}`,
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ fontWeight: 700, color: ratingColor(result.rating), marginBottom: 6, fontSize: 14 }}>
              {result.rating === "Excellent" ? "✅ Great opportunity!" : result.rating === "Good" ? "⚠️ Decent opportunity" : "❌ Low potential"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              {result.rating === "Excellent"
                ? `${product.name} in ${niche.name} niche looks very profitable. Upload ${listings} listings and expect strong returns.`
                : result.rating === "Good"
                ? `Decent potential. Consider raising your price by $2-5 or adding more listings to increase returns.`
                : `Margins are thin or competition is too high. Try a different niche or product type.`}
            </div>
          </div>

          {/* ACTION PLAN */}
          <div style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 16, padding: "20px 26px", backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14, background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>🎯 Action Plan to Reach These Numbers</div>
            {actionPlan.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < actionPlan.length - 1 ? "1px solid rgba(167,139,250,0.06)" : "none" }}>
                <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>{a.icon}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && (
        <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          Select your product, niche and price then click Calculate
        </div>
      )}
    </DashLayout>
  );
}