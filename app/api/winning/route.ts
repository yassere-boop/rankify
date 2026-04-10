import { NextResponse } from "next/server";

export async function GET() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  const base64 = Buffer.from(login + ":" + password).toString("base64");

  const productList = ["custom pet portrait","aesthetic phone case","vintage botanical print","boho tote bag","matching couple hoodie","crystal candle","soy candle gift","personalised mug","custom name necklace","funny quote tshirt","holographic sticker","printable wall art","custom baby blanket","personalised bracelet","oversized hoodie","custom phone case","scented candle set","personalised keyring","cat lover gift","dog mom gift","birth flower necklace","custom star map","minimalist ring","personalised notebook","funny socks gift","custom tote bag","aesthetic poster","personalised candle","custom hoodie","vintage tshirt"];

  try {
    const response = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live", {
      method: "POST",
      headers: { Authorization: "Basic " + base64, "Content-Type": "application/json" },
      body: JSON.stringify([{ keywords: productList, language_name: "English", location_code: 2840 }]),
    });

    const data = await response.json();

    if (!data.tasks || data.tasks[0].status_code !== 20000) {
      return NextResponse.json({ error: "API error" }, { status: 500 });
    }

    const results = data.tasks[0].result || [];

    const products = results.map((r: any) => {
      const vol = r.search_volume || 0;
      const comp = r.competition_index || 0;
      const trend = r.monthly_searches?.[0]?.search_volume || 0;
      const prevTrend = r.monthly_searches?.[1]?.search_volume || 0;
      const trendPct = prevTrend > 0 ? Math.round(((trend - prevTrend) / prevTrend) * 100) : 0;
      const volumeScore = Math.min(vol / 500, 40);
      const compScore = Math.max(0, 30 - (comp / 100) * 30);
      const trendScore = Math.min(Math.max(trendPct, 0), 30);
      const totalScore = Math.round(volumeScore + compScore + trendScore);
      return {
        name: r.keyword,
        volume: vol > 1000 ? Math.round(vol / 1000) + "K" : String(vol),
        rawVolume: vol,
        competition: comp < 33 ? "Low" : comp < 66 ? "Medium" : "High",
        trend: trendPct > 0 ? "+" + trendPct + "%" : trendPct < 0 ? trendPct + "%" : "Stable",
        trendPct,
        score: totalScore,
        verdict: totalScore >= 55 ? "Winner" : totalScore >= 35 ? "Potential" : "Avoid",
      };
    }).filter((p: any) => p.rawVolume > 100).sort((a: any, b: any) => b.score - a.score).slice(0, 20);

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}