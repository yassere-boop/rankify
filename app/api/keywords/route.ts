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
            keywords: [
              keyword,
              `${keyword} etsy`,
              `${keyword} handmade`,
              `${keyword} custom`,
              `${keyword} gift`,
              `buy ${keyword}`,
              `${keyword} shop`,
              `${keyword} online`,
              `personalised ${keyword}`,
              `${keyword} print`,
            ],
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

    const results = data.tasks[0].result || [];

    const related = results.map((item: any) => {
      const vol = item.search_volume || 0;
      const comp = item.competition_index || 0;
      const trend = item.monthly_searches?.[0]?.search_volume || 0;
      const prevTrend = item.monthly_searches?.[1]?.search_volume || 0;
      const trendPct = prevTrend > 0 ? Math.round(((trend - prevTrend) / prevTrend) * 100) : 0;

      return {
        kw: item.keyword,
        vol: vol.toLocaleString(),
        comp: comp < 33 ? "Low" : comp < 66 ? "Medium" : "High",
        trend: trendPct > 0 ? `↑ +${trendPct}%` : trendPct < 0 ? `↓ ${trendPct}%` : "→ Stable",
        rawVol: vol,
        rawComp: comp,
      };
    });

    const mainKw = related.find((r: any) => r.kw === keyword) || related[0];
    const totalVol = mainKw?.rawVol || 0;
    const avgComp = related.reduce((acc: number, r: any) => acc + r.rawComp, 0) / (related.length || 1);

    return NextResponse.json({
      volume: totalVol > 1000 ? `${Math.round(totalVol / 1000)}K` : String(totalVol),
      competition: avgComp < 33 ? "Low" : avgComp < 66 ? "Medium" : "High",
      compScore: Math.round(avgComp),
      opportunity: avgComp < 33 && totalVol > 5000 ? "High" : avgComp > 66 ? "Low" : "Medium",
      trend: mainKw?.trend || "→ Stable",
      related: related.slice(0, 10),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
