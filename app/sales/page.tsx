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

  const menuItems = [
    { icon: "🔍", label: "Keyword Research", path: "/dashboard" },
    { icon: "📊", label: "Competition", path: "/competition" },
    { icon: "📈", label: "Trends", path: "/trends" },
    { icon: "🏷️", label: "Tag Generator", path: "/tags" },
    { icon: "⭐", label: "Listing Optimizer", path: "/listing" },
    { icon: "📋", label: "Sales Estimator", path: "/sales", active: true },
    { icon: "🎨", label: "POD Research", path: "/pod", isNew: true },
  ];

  const calculate = () => {
    const etsyFee = sellPrice * 0.065 + 0.20;
    const paymentFee = sellPrice * 0.03 + 0.25;
    const netProfit = sellPrice - product.printCost - etsyFee - paymentFee;
    const margin = ((netProfit / sellPrice) * 100).toFixed(1);
    const competitionFactor = (100 - niche.competition) / 100;
    const searchFactor = Math.min(niche.monthlySearches / 10000, 1);
    const conversionRate = 0.02;
    const estimatedVisitors = niche.monthlySearches * searchFactor * competitionFactor * listings * 0.01;
    const monthlySales = Math.floor(estimatedVisitors * conversionRate * listings);
    const monthlyRevenue = (monthlySales * sellPrice).toFixed(2);
    const monthlyProfit = (monthlySales * netProfit).toFixed(2);
    const yearlyProfit = (Number(monthlyProfit) * 12).toFixed(2);

    setResult({
      netProfit: netProfit.toFixed(2),
      margin,
      monthlySales,
      monthlyRevenue,
      monthlyProfit,
      yearlyProfit,
      breakEven: Math.ceil(product.printCost / netProfit),
      rating: netProfit > 12 && monthlySales > 50 ? "Excellent" : netProfit > 8 && monthlySales > 20 ? "Good" : "Low",
    });
  };

  const getRatingColor = (r: string) => r === "Excellent" ? "text-green-400" : r === "Good" ? "text-yellow-400" : "text-red-400";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <aside className="w-52 border-r border-white/10 p-4 flex flex-col gap-1 shrink-0">
        <div className="text-xl font-black text-white mb-6">
          Rank<span className="text-purple-400">ify</span>
        </div>
        {menuItems.map((item, i) => (
          <button key={i} onClick={() => router.push(item.path)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition text-left
              ${item.active ? "bg-purple-600/30 text-purple-300" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.isNew && <span className="ml-auto bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">NEW</span>}
          </button>
        ))}
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">📋 Sales Estimator</h1>
          <p className="text-white/40 text-sm">Estimate your monthly sales and profit before you design</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white/50 text-xs font-bold uppercase mb-4">Product Type</p>
            <div className="flex flex-wrap gap-2">
              {PRODUCTS.map(p => (
                <button key={p.name} onClick={() => { setProduct(p); setSellPrice(p.avgPrice); }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${product.name === p.name ? "bg-purple-600 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
                  {p.name} (${p.printCost})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white/50 text-xs font-bold uppercase mb-4">Niche</p>
            <div className="flex flex-wrap gap-2">
              {NICHES.map(n => (
                <button key={n.name} onClick={() => setNiche(n)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${niche.name === n.name ? "bg-purple-600 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
                  {n.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white/50 text-xs font-bold uppercase mb-4">Selling Price</p>
            <div className="flex items-center gap-3">
              <span className="text-white/50">$</span>
              <input type="number" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white w-32 focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white/50 text-xs font-bold uppercase mb-4">Number of Listings</p>
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 25, 50, 100].map(n => (
                <button key={n} onClick={() => setListings(n)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${listings === n ? "bg-purple-600 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={calculate}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-2xl font-bold text-lg transition mb-6">
          Calculate My Potential 🚀
        </button>

        {result && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Profit per Sale", value: `$${result.netProfit}`, sub: `${result.margin}% margin`, color: "text-green-400" },
                { label: "Est. Monthly Sales", value: result.monthlySales, sub: `${listings} listings`, color: "text-white" },
                { label: "Monthly Revenue", value: `$${result.monthlyRevenue}`, sub: "gross", color: "text-white" },
                { label: "Monthly Profit", value: `$${result.monthlyProfit}`, sub: "after all fees", color: "text-green-400" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-white/30 text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs mb-1">Yearly Profit Potential</p>
                <p className="text-3xl font-black text-purple-300">${result.yearlyProfit}</p>
                <p className="text-white/30 text-xs mt-1">if sales stay consistent</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs mb-1">Overall Rating</p>
                <p className={`text-3xl font-black ${getRatingColor(result.rating)}`}>{result.rating}</p>
                <p className="text-white/30 text-xs mt-1">based on margin & volume</p>
              </div>
            </div>

            <div className={`rounded-2xl p-5 border ${result.rating === "Excellent" ? "bg-green-500/10 border-green-500/30" : result.rating === "Good" ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <p className="font-bold text-white mb-1">
                {result.rating === "Excellent" ? "✅ Great opportunity!" : result.rating === "Good" ? "⚠️ Decent opportunity" : "❌ Low potential"}
              </p>
              <p className="text-white/60 text-sm">
                {result.rating === "Excellent"
                  ? `${product.name} in ${niche.name} niche looks very profitable. Upload ${listings} listings and expect strong returns.`
                  : result.rating === "Good"
                  ? `Decent potential. Consider raising your price by $2-5 or adding more listings to increase returns.`
                  : `Margins are thin or competition is too high. Try a different niche or product type.`}
              </p>
            </div>
          </>
        )}

        {!result && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-white/30 text-sm">Select your product, niche and price then click Calculate</p>
          </div>
        )}
      </div>
    </main>
  );
}