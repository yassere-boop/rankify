import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { product } = await req.json();
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  const base64 = Buffer.from(login + ":" + password).toString("base64");
  const keywords = [product, product + " etsy", product + " handmade", product + " custom", product + " gift", "buy " + product, product + " shop", product + " print", "personalised " + product, product + " redbubble"];
  try {
    const response = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live", {
      method: "POST",
      headers: { Authorization: "Basic " + base64, "Content-Type": "application/json" },
      body: JSON.stringify([{ keywords, language_name: "English", location_code: 2840 }]),
    });
    const data = await response.json();
    if (!data.tasks || data.tasks[0].status_code !== 20000) {
      return NextResponse.json({ error: "API error" }, { status: 500 });
    }
    const results = data.tasks[0].result || [];
    const main = results.find((r: any) => r.keyword === product) || results[0];
    if (!main) return NextResponse.json({ error: "No data" }, { status: 404 });
    const volume = main.search_volume || 0;
    const comp = main.competition_index || 0;
    const trend = main.monthly_searches?.[0]?.search_volume || 0;
    const prevTrend = main.monthly_searches?.[1]?.search_volume || 0;
    const trendPct = prevTrend > 0 ? Math.round(((trend - prevTrend) / prevTrend) * 100) : 0;
    const volumeScore = Math.min(volume / 1000, 40);
    const compScore = Math.max(0, 30 - (comp / 100) * 30);
    const trendScore = Math.min(Math.max(trendPct, 0), 30);
    const totalScore = Math.round(volumeScore + compScore + trendScore);
    const verdict = totalScore >= 60 ? "Winner" : totalScore >= 35 ? "Potential" : "Avoid";
    const related = results.slice(0, 8).map((r: any) => {
      const t = r.monthly_searches?.[0]?.search_volume || 0;
      const p = r.monthly_searches?.[1]?.search_volume || 0;
      const pct = p > 0 ? Math.round(((t - p) / p) * 100) : 0;
      return {
        kw: r.keyword,
        vol: (r.search_volume || 0).toLocaleString(),
        comp: (r.competition_index || 0) < 33 ? "Low" : (r.competition_index || 0) < 66 ? "Medium" : "High",
        trend: pct > 0 ? "+" + pct + "%" : pct < 0 ? pct + "%" : "Stable",
      };
    });
    return NextResponse.json({
      product,
      score: totalScore,
      verdict,
      volume: volume > 1000 ? Math.round(volume / 1000) + "K" : String(volume),
      competition: comp < 33 ? "Low" : comp < 66 ? "Medium" : "High",
      compScore: Math.round(comp),
      trend: trendPct > 0 ? "+" + trendPct + "%" : trendPct < 0 ? trendPct + "%" : "Stable",
      trendPct,
      related,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
