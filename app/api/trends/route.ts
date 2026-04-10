 import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();

  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  const base64 = Buffer.from(`${login}:${password}`).toString("base64");

  try {
    const response = await fetch(
      "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            keywords: [keyword],
            language_name: "English",
            location_code: 2840,
          },
        ]),
      }
    );

    const data = await response.json();

    if (!data.tasks || data.tasks[0].status_code !== 20000) {
      return NextResponse.json({ error: "API error" }, { status: 500 });
    }

    const result = data.tasks[0].result?.[0];
    if (!result) return NextResponse.json({ error: "No data" }, { status: 404 });

    const monthly = result.monthly_searches || [];

    const months = monthly
      .slice()
      .reverse()
      .map((m: any) => ({
        month: `${m.year}-${String(m.month).padStart(2, "0")}`,
        volume: m.search_volume || 0,
      }));

    const volumes = months.map((m: any) => m.volume);
    const max = Math.max(...volumes);
    const min = Math.min(...volumes);
    const avg = Math.round(volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length);
    const latest = volumes[volumes.length - 1];
    const previous = volumes[volumes.length - 2] || latest;
    const trendPct = previous > 0 ? Math.round(((latest - previous) / previous) * 100) : 0;

    return NextResponse.json({
      keyword,
      months,
      max,
      min,
      avg,
      trendPct,
      current: latest,
      verdict: trendPct > 10 ? "Rising" : trendPct < -10 ? "Declining" : "Stable",
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
