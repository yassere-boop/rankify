"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PRODUCTS = [
  { name: "T-Shirt", printCost: 8.50, avgPrice: 24.99 },
  { name: "Hoodie", printCost: 18.00, avgPrice: 39.99 },
  { name: "Sweatshirt", printCost: 15.00, avgPrice: 34.99 },
  { name: "Mug", printCost: 6.50, avgPrice: 16.99 },
  { name: "Tote Bag", printCost: 9.00, avgPrice: 22.99 },
  { name: "Poster", printCost: 5.00, avgPrice: 19.99 },
  { name: "Phone Case", printCost: 8.00, avgPrice: 18.99 },
];

const NICHES = [
  { name: "Dog Mom", monthlySearches: 4400, competition: 72 },
  { name: "Cat Lover", monthlySearches: 2900, competition: 65 },
  { name: "Nurse Gift", monthlySearches: 1800, competition: 45 },
  { name: "Teacher Gift", monthlySearches: 2200, competition: 55 },
  { name: "Halloween", monthlySearches: 8900, competition: 70 },
  { name: "Christmas", monthlySearches: 12000, competition: 85 },
  { name: "Birthday", monthlySearches: 6700, competition: 80 },
  { name: "Funny Shirt", monthlySearches: 9500, competition: 95 },
];

export default function SalesEstimator() {
  const router = useRouter();
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [niche, setNiche] = useState(NICHES[0]);
  const [sellPrice, setSellPrice] = useState(24.99);
  const [listings, setListings] = useState(10);
  const [result, setResult] = useState<any>(null);

  const nav = [
    { label: "Keyword Research", path: "/dashboard", emoji: "🔍" },
    { label: "Competition", path: "/competition", emoji: "📊" },
    { label: "Trends", path: "/trends", emoji: "📈" },
    { label: "Tag Generator", path: "/tags", emoji: "🏷️" },
    { label: "Listing Optimizer", path: "/listing", emoji: "⭐" },
    { label: "Sales Estimator", path: "/sales", emoji: "💰", active: true },
    { label: "POD Research", path: "/pod", emoji: "🎨", badge: "NEW" },
  ];

  const calculate = () => {
    const etsyFee = sellPrice * 0.065 + 0.20;
    const paymentFee = sellPrice * 0.03 + 0.25;
    const netProfit = sellPrice - product.printCost - etsyFee - paymentFee;
    const margin = ((netProfit / sellPrice) * 100).toFixed(1);
    const competitionFactor = (100 - niche.competition) / 100;
    const searchFactor = Math.min(niche.monthlySearches / 10000, 1);
    const estimatedVisitors = niche.monthlySearches * searchFactor * competitionFactor * listings * 0.01;
    const monthlySales = Math.max(Math.floor(estimatedVisitors * 0.02 * listings), 1);
    const monthlyRevenue = (monthlySales * sellPrice).toFixed(2);
    const monthlyProfit = (monthlySales * netProfit).toFixed(2);
    const yearlyProfit = (Number(monthlyProfit) * 12).toFixed(2);
    setResult({
      netProfit: netProfit.toFixed(2), margin, monthlySales,
      monthlyRevenue, monthlyProfit, yearlyProfit,
      rating: netProfit > 12 && monthlySales > 50 ? "Excellent" : netProfit > 8 && monthlySales > 20 ? "Good" : "Low",
    });
  };

  const ratingColor = (r: string) => r === "Excellent" ? "#34d399" : r === "Good" ? "#fbbf24" : "#f87171";

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
        .rk-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; margin-bottom: 16px; }
        .rk-card-title { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 14px; }
        .rk-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .rk-pill { padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); color: #475569; transition: all 0.12s; font-family: inherit; }
        .rk-pill:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
        .rk-pill-active { background: rgba(99,102,241,0.15) !important; border-color: rgba(99,102,241,0.4) !important; color: #a5b4fc !important; }
        .rk-grid2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px; margin-bottom: 16px; }
        .rk-input-wrap { display: flex; align-items: center; gap: 8px; }
        .rk-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #e2e8f0; font-size: 14px; outline: none; font-family: inherit; width: 120px; transition: all 0.15s; }
        .rk-input:focus { border-color: rgba(129,140,248,0.6); }
        .rk-calc-btn { width: 100%; padding: 14px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 15px; font-weight: 700; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; margin-bottom: 20px; letter-spacing: 0.01em; }
        .rk-calc-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .rk-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; margin-bottom: 16px; }
        .rk-stat { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 16px 18px; }
        .rk-stat-label { font-size: 10px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 10px; }
        .rk-stat-val { font-size: 22px; font-weight: 700; }
        .rk-stat-sub { font-size: 11px; color: #475569; margin-top: 3px; }
        .rk-big-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; margin-bottom: 16px; }
        .rk-big-stat { background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 20px 22px; }
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
            <span style={{ fontSize: 12, color: "#334155" }}>Sales Estimator · Profit calculator with Etsy fees</span>
          </div>
          <div className="rk-content">
            <div className="rk-title">💰 Sales Estimator</div>
            <div className="rk-sub">Estimate your monthly sales and profit before you design</div>

            <div className="rk-grid2">
              <div className="rk-card">
                <div className="rk-card-title">Product Type</div>
                <div className="rk-pills">
                  {PRODUCTS.map(p => (
                    <button key={p.name} onClick={() => { setProduct(p); setSellPrice(p.avgPrice); }}
                      className={`rk-pill ${product.name === p.name ? "rk-pill-active" : ""}`}>
                      {p.name} · ${p.printCost}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rk-card">
                <div className="rk-card-title">Niche</div>
                <div className="rk-pills">
                  {NICHES.map(n => (
                    <button key={n.name} onClick={() => setNiche(n)}
                      className={`rk-pill ${niche.name === n.name ? "rk-pill-active" : ""}`}>
                      {n.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rk-grid2">
              <div className="rk-card">
                <div className="rk-card-title">Selling Price</div>
                <div className="rk-input-wrap">
                  <span style={{ color: "#475569", fontSize: 16 }}>$</span>
                  <input type="number" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))} className="rk-input" />
                </div>
              </div>
              <div className="rk-card">
                <div className="rk-card-title">Number of Listings</div>
                <div className="rk-pills">
                  {[5, 10, 25, 50, 100].map(n => (
                    <button key={n} onClick={() => setListings(n)}
                      className={`rk-pill ${listings === n ? "rk-pill-active" : ""}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="rk-calc-btn" onClick={calculate}>
              Calculate My Potential 🚀
            </button>

            {result && (
              <div className="rk-fade">
                <div className="rk-stats">
                  {[
                    { label: "Profit/Sale", value: `$${result.netProfit}`, sub: `${result.margin}% margin`, color: "#34d399" },
                    { label: "Est. Monthly Sales", value: result.monthlySales, sub: `${listings} listings`, color: "#e2e8f0" },
                    { label: "Monthly Revenue", value: `$${result.monthlyRevenue}`, sub: "gross", color: "#e2e8f0" },
                    { label: "Monthly Profit", value: `$${result.monthlyProfit}`, sub: "after all fees", color: "#34d399" },
                  ].map((s, i) => (
                    <div key={i} className="rk-stat">
                      <div className="rk-stat-label">{s.label}</div>
                      <div className="rk-stat-val" style={{ color: s.color }}>{s.value}</div>
                      <div className="rk-stat-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="rk-big-grid">
                  <div className="rk-big-stat">
                    <div className="rk-stat-label">Yearly Profit Potential</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#a5b4fc", marginTop: 8 }}>${result.yearlyProfit}</div>
                    <div className="rk-stat-sub" style={{ marginTop: 4 }}>if sales stay consistent</div>
                  </div>
                  <div className="rk-big-stat">
                    <div className="rk-stat-label">Overall Rating</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: ratingColor(result.rating), marginTop: 8 }}>{result.rating}</div>
                    <div className="rk-stat-sub" style={{ marginTop: 4 }}>based on margin & volume</div>
                  </div>
                </div>

                <div style={{
                  borderRadius: 14, padding: "16px 22px",
                  background: result.rating === "Excellent" ? "rgba(52,211,153,0.06)" : result.rating === "Good" ? "rgba(251,191,36,0.06)" : "rgba(248,113,113,0.06)",
                  border: `1px solid ${result.rating === "Excellent" ? "rgba(52,211,153,0.2)" : result.rating === "Good" ? "rgba(251,191,36,0.2)" : "rgba(248,113,113,0.2)"}`,
                }}>
                  <div style={{ fontWeight: 700, color: ratingColor(result.rating), marginBottom: 6, fontSize: 14 }}>
                    {result.rating === "Excellent" ? "✅ Great opportunity!" : result.rating === "Good" ? "⚠️ Decent opportunity" : "❌ Low potential"}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                    {result.rating === "Excellent"
                      ? `${product.name} in ${niche.name} niche looks very profitable. Upload ${listings} listings and expect strong returns.`
                      : result.rating === "Good"
                      ? `Decent potential. Consider raising your price by $2-5 or adding more listings to increase returns.`
                      : `Margins are thin or competition is too high. Try a different niche or product type.`}
                  </div>
                </div>
              </div>
            )}

            {!result && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 120, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#334155" }}>Select your product, niche and price then click Calculate</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}