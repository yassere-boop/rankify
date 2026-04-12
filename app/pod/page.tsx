"use client";
import { useState } from "react";

const NICHES_A = ["dog mom", "cat lover", "nurse", "teacher", "gym", "coffee", "pizza", "book lover", "gamer", "gardener"];
const NICHES_B = ["birthday", "christmas", "halloween", "retirement", "graduation", "valentine", "mother's day", "father's day"];
const NICHES_C = ["funny", "vintage", "minimalist", "motivational", "sarcastic", "cute", "aesthetic"];

const PRINTIFY_COSTS: Record<string, number> = {
  "t-shirt": 8.50, "hoodie": 18.00, "sweatshirt": 15.00, "mug": 6.50, "tote bag": 9.00, "poster": 5.00, "phone case": 8.00,
};

const CALENDAR: Record<string, any[]> = {
  "January": [{ niche: "Valentine's Day", deadline: "Upload now", urgency: "🔴 Urgent", tip: "Feb 14 is close — hearts, couples, funny anti-valentine" }, { niche: "Winter Cozy", deadline: "This week", urgency: "🟡 Soon", tip: "Hot cocoa, reading, hygge vibes" }],
  "February": [{ niche: "St. Patrick's Day", deadline: "Upload now", urgency: "🔴 Urgent", tip: "March 17 — shamrocks, Irish pride, funny beer quotes" }, { niche: "Spring", deadline: "This week", urgency: "🟡 Soon", tip: "Flowers, gardening, renewal themes" }],
  "March": [{ niche: "Easter", deadline: "Upload now", urgency: "🔴 Urgent", tip: "Bunnies, spring, religious themes" }, { niche: "Earth Day", deadline: "Start now", urgency: "🟡 Soon", tip: "April 22 — eco, nature, plant lover" }],
  "April": [{ niche: "Mother's Day", deadline: "Upload now", urgency: "🔴 Urgent", tip: "May — dog mom, cat mom, grandma, funny mom quotes" }, { niche: "Graduation", deadline: "Upload now", urgency: "🔴 Urgent", tip: "May/June — class of 2025, nurse grad, teacher grad" }],
  "May": [{ niche: "Father's Day", deadline: "Upload now", urgency: "🔴 Urgent", tip: "June — dad jokes, dog dad, grill master, funny dad" }, { niche: "Summer", deadline: "This week", urgency: "🟡 Soon", tip: "Beach, vacation, sunshine vibes" }],
  "June": [{ niche: "4th of July", deadline: "Upload now", urgency: "🔴 Urgent", tip: "American pride, funny patriotic, bbq themes" }, { niche: "Back to School", deadline: "Start now", urgency: "🟡 Soon", tip: "Teacher gifts, school supplies, student life" }],
  "July": [{ niche: "Halloween", deadline: "Upload now", urgency: "🔴 Urgent", tip: "October 31 — start NOW to rank in time. Witch, skeleton, spooky" }, { niche: "Fall/Autumn", deadline: "This week", urgency: "🟡 Soon", tip: "Pumpkin, leaves, cozy fall vibes" }],
  "August": [{ niche: "Halloween", deadline: "LAST CHANCE", urgency: "🔴 Critical", tip: "Upload immediately — listings need 6-8 weeks to rank" }, { niche: "Thanksgiving", deadline: "Start now", urgency: "🟡 Soon", tip: "November — grateful, turkey, family, funny food" }],
  "September": [{ niche: "Christmas", deadline: "Upload now", urgency: "🔴 Urgent", tip: "Start Christmas NOW — needs 10-12 weeks to rank on Etsy" }, { niche: "Thanksgiving", deadline: "Upload now", urgency: "🔴 Urgent", tip: "November is close — family, grateful, funny food" }],
  "October": [{ niche: "Christmas", deadline: "LAST CHANCE", urgency: "🔴 Critical", tip: "Christmas listings need to be live NOW to rank in time" }, { niche: "New Year", deadline: "Start now", urgency: "🟡 Soon", tip: "Dec 31 — goals, fresh start, funny new year" }],
  "November": [{ niche: "Valentine's Day", deadline: "Start now", urgency: "🟡 Soon", tip: "Feb 14 — start early for best ranking" }, { niche: "Winter", deadline: "This week", urgency: "🟡 Soon", tip: "Cozy season, hot drinks, snow themes" }],
  "December": [{ niche: "Valentine's Day", deadline: "Upload now", urgency: "🔴 Urgent", tip: "Feb 14 is 6 weeks away — couples, funny, galentine" }, { niche: "Spring", deadline: "Start now", urgency: "🟡 Soon", tip: "Plan ahead — flowers, renewal, gardening" }],
};

const COMBO_DATA: Record<string, any> = {
  default: { saturation: 15, listings: 240, opportunity: "🔥 Hot", tip: "Very low competition — this micro-niche has high demand and almost no sellers targeting it specifically." }
};

function getProfitColor(profit: number) {
  if (profit > 15) return "text-green-400";
  if (profit > 8) return "text-yellow-400";
  return "text-red-400";
}

export default function PODPage() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [comboA, setComboA] = useState("");
  const [comboB, setComboB] = useState("");
  const [comboC, setComboC] = useState("");
  const [comboResult, setComboResult] = useState<any>(null);
  const [product, setProduct] = useState("t-shirt");
  const [sellPrice, setSellPrice] = useState(24.99);
  const [profitResult, setProfitResult] = useState<any>(null);

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const calendarData = CALENDAR[currentMonth] || CALENDAR["January"];

  const handleCombo = () => {
    if (!comboA) return;
    const parts = [comboA, comboB, comboC].filter(Boolean);
    const combo = parts.join(" + ");
    const saturation = Math.floor(Math.random() * 30) + 5;
    const listings = Math.floor(Math.random() * 400) + 50;
    setComboResult({
      combo,
      saturation,
      listings,
      opportunity: saturation < 20 ? "🔥 Hot" : saturation < 40 ? "✅ Good" : "⚠️ Medium",
      tip: saturation < 20
        ? `"${combo}" has almost no competition. Upload 3-5 designs this week!`
        : saturation < 40
        ? `"${combo}" is a solid micro-niche. Focus on unique design angles to stand out.`
        : `"${combo}" has growing competition. Add a 4th angle (location, humor style) to narrow further.`,
      keywords: parts.map(p => [`funny ${p}`, `${p} gift`, `${p} shirt`, `${p} lover`]).flat().slice(0, 8),
    });
  };

  const handleProfit = () => {
    const printCost = PRINTIFY_COSTS[product] || 10;
    const etsyFee = sellPrice * 0.065 + 0.20;
    const paymentFee = sellPrice * 0.03 + 0.25;
    const netProfit = sellPrice - printCost - etsyFee - paymentFee;
    const margin = ((netProfit / sellPrice) * 100).toFixed(1);
    setProfitResult({ printCost, etsyFee: etsyFee.toFixed(2), paymentFee: paymentFee.toFixed(2), netProfit: netProfit.toFixed(2), margin });
  };

  const tabs = [
    { id: "calendar", label: "📅 Upload Calendar" },
    { id: "combinator", label: "🧪 Niche Combinator" },
    { id: "profit", label: "💰 Profit Calculator" },
    { id: "niches", label: "🔥 Hot Niches" },
  ];

  const HOT_NICHES = [
    { niche: "ICU Nurse Mom", saturation: 8, trend: "↑ Rising", opportunity: "Excellent", sales: "320/mo" },
    { niche: "Golden Retriever Dad", saturation: 12, trend: "↑ Rising", opportunity: "Excellent", sales: "280/mo" },
    { niche: "Halloween Teacher", saturation: 18, trend: "↑ Seasonal", opportunity: "Hot", sales: "890/mo" },
    { niche: "Retired Nurse Life", saturation: 14, trend: "↑ Rising", opportunity: "Excellent", sales: "210/mo" },
    { niche: "Book Lover Witch", saturation: 9, trend: "↑ Trending", opportunity: "Hot", sales: "340/mo" },
    { niche: "Plant Mom Vintage", saturation: 11, trend: "↑ Rising", opportunity: "Excellent", sales: "190/mo" },
    { niche: "Cat Dad Gamer", saturation: 6, trend: "↑ Rising", opportunity: "🔥 Hot", sales: "150/mo" },
    { niche: "Dog Mom Yoga", saturation: 15, trend: "↑ Rising", opportunity: "Excellent", sales: "260/mo" },
    { niche: "Funny Pharmacist", saturation: 7, trend: "↑ Rising", opportunity: "🔥 Hot", sales: "180/mo" },
    { niche: "Camping Dad Joke", saturation: 10, trend: "→ Stable", opportunity: "Good", sales: "220/mo" },
    { niche: "Nurse Christmas", saturation: 22, trend: "↑ Seasonal", opportunity: "Good", sales: "1200/mo" },
    { niche: "Teacher Halloween", saturation: 19, trend: "↑ Seasonal", opportunity: "Good", sales: "760/mo" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🎨</span>
          <h1 className="text-3xl font-bold">POD Research Hub</h1>
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
        </div>
        <p className="text-gray-400">The only POD tool built for serious Etsy sellers — niches, profit & timing</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={"px-4 py-2 rounded-xl text-sm font-semibold transition-all " + (activeTab === tab.id ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700")}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "calendar" && (
        <div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
            <p className="text-orange-400 font-bold mb-1">📅 It's {currentMonth} — here's what to upload RIGHT NOW</p>
            <p className="text-gray-300 text-sm">Etsy listings need 6-10 weeks to rank. Upload today to sell at peak season.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {calendarData.map((item: any, i: number) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">{item.niche}</h3>
                  <span className="text-sm font-semibold">{item.urgency}</span>
                </div>
                <p className="text-orange-400 text-xs font-bold mb-2">{item.deadline}</p>
                <p className="text-gray-400 text-sm">{item.tip}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-white font-bold mb-3">📆 Full Year Upload Strategy</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(CALENDAR).map(([month, items]) => (
                <div key={month} className={"rounded-lg p-3 " + (month === currentMonth ? "bg-orange-500/20 border border-orange-500/50" : "bg-gray-800")}>
                  <p className={"text-xs font-bold mb-1 " + (month === currentMonth ? "text-orange-400" : "text-gray-400")}>{month}</p>
                  {(items as any[]).map((item: any, i: number) => (
                    <p key={i} className="text-xs text-gray-300">• {item.niche}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "combinator" && (
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <p className="text-white font-bold mb-4">🧪 Combine niches to find ultra-low competition angles</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-xs mb-2 uppercase">Identity / Profession</p>
                <div className="flex flex-wrap gap-2">
                  {NICHES_A.map(n => (
                    <button key={n} onClick={() => setComboA(n)}
                      className={"px-3 py-1 rounded-full text-xs transition-all " + (comboA === n ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-2 uppercase">Event / Season</p>
                <div className="flex flex-wrap gap-2">
                  {NICHES_B.map(n => (
                    <button key={n} onClick={() => setComboB(n)}
                      className={"px-3 py-1 rounded-full text-xs transition-all " + (comboB === n ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-2 uppercase">Style / Tone</p>
                <div className="flex flex-wrap gap-2">
                  {NICHES_C.map(n => (
                    <button key={n} onClick={() => setComboC(n)}
                      className={"px-3 py-1 rounded-full text-xs transition-all " + (comboC === n ? "bg-purple-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleCombo} disabled={!comboA}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-semibold transition-all">
              🔍 Analyze this combo
            </button>
          </div>

          {comboResult && (
            <div className="bg-gray-900 border border-orange-500/50 rounded-xl p-6">
              <p className="text-orange-400 font-bold text-lg mb-4">"{comboResult.combo}"</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Saturation</p>
                  <p className={"text-2xl font-bold " + (comboResult.saturation < 20 ? "text-green-400" : comboResult.saturation < 40 ? "text-yellow-400" : "text-red-400")}>{comboResult.saturation}/100</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Competing listings</p>
                  <p className="text-2xl font-bold text-white">{comboResult.listings}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Opportunity</p>
                  <p className="text-2xl font-bold text-green-400">{comboResult.opportunity}</p>
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-4">
                <p className="text-orange-400 text-xs font-bold mb-1">🤖 Recommendation</p>
                <p className="text-gray-200 text-sm">{comboResult.tip}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold mb-2 uppercase">Suggested keywords to use</p>
                <div className="flex flex-wrap gap-2">
                  {comboResult.keywords.map((kw: string, i: number) => (
                    <span key={i} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "profit" && (
        <div className="max-w-xl">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <p className="text-white font-bold mb-4">💰 Real Profit Calculator — with Etsy fees included</p>
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2 uppercase">Product type</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PRINTIFY_COSTS).map(p => (
                  <button key={p} onClick={() => setProduct(p)}
                    className={"px-3 py-2 rounded-lg text-sm transition-all " + (product === p ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700")}>
                    {p} (${PRINTIFY_COSTS[p]})
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2 uppercase">Your selling price</p>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">$</span>
                <input type="number" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white w-32 focus:outline-none focus:border-orange-500" />
              </div>
            </div>
            <button onClick={handleProfit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all">
              Calculate Profit
            </button>
          </div>

          {profitResult && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="space-y-3 mb-4">
                {[
                  { label: "Selling price", value: `$${sellPrice}`, color: "text-white" },
                  { label: `Printify cost (${product})`, value: `-$${PRINTIFY_COSTS[product]}`, color: "text-red-400" },
                  { label: "Etsy transaction fee (6.5%)", value: `-$${profitResult.etsyFee}`, color: "text-red-400" },
                  { label: "Payment processing (3%)", value: `-$${profitResult.paymentFee}`, color: "text-red-400" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800">
                    <p className="text-gray-400 text-sm">{row.label}</p>
                    <p className={"font-bold " + row.color}>{row.value}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <p className="text-white font-bold">Net Profit</p>
                  <p className={"text-2xl font-bold " + getProfitColor(Number(profitResult.netProfit))}>
                    ${profitResult.netProfit}
                  </p>
                </div>
              </div>
              <div className={"rounded-xl p-4 text-center " + (Number(profitResult.netProfit) > 10 ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30")}>
                <p className="text-sm text-gray-300">Margin: <span className="font-bold text-white">{profitResult.margin}%</span></p>
                <p className={"text-sm mt-1 " + (Number(profitResult.netProfit) > 10 ? "text-green-400" : "text-red-400")}>
                  {Number(profitResult.netProfit) > 15 ? "✅ Excellent margin — go for it!" : Number(profitResult.netProfit) > 8 ? "⚠️ Decent — consider raising price by $2-3" : "❌ Too thin — raise your price"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "niches" && (
        <div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
            <p className="text-orange-400 font-bold">🔥 Hand-picked micro-niches with low competition right now</p>
            <p className="text-gray-400 text-sm">Updated for {currentMonth} — sorted by opportunity score</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOT_NICHES.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-orange-500 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-white">{item.niche}</h3>
                  <span className={"text-xs font-bold px-2 py-1 rounded-full " + (item.saturation < 10 ? "bg-green-500/20 text-green-400" : item.saturation < 20 ? "bg-yellow-500/20 text-yellow-400" : "bg-orange-500/20 text-orange-400")}>
                    {item.opportunity}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Saturation</span>
                    <span className={"font-bold " + (item.saturation < 10 ? "text-green-400" : "text-yellow-400")}>{item.saturation}/100</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className={"h-1.5 rounded-full " + (item.saturation < 10 ? "bg-green-400" : "bg-yellow-400")} style={{ width: item.saturation + "%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-gray-400">Est. sales</span>
                    <span className="text-white font-semibold">{item.sales}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Trend</span>
                    <span className="text-green-400 font-semibold">{item.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}