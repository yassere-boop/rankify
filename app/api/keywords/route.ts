import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const PRO_PLANS = ["pro", "agency"];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("plan")
    .eq("clerk_id", userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { keyword } = await req.json();
  const isPro = PRO_PLANS.includes(user.plan);
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
        body: JSON.stringify([{
          keywords: [
            keyword,
            `${keyword} gift`,
            `${keyword} shirt`,
            `${keyword} mug`,
            `${keyword} custom`,
            `${keyword} personalized`,
            `${keyword} shop`,
            `${keyword} online`,
            `best ${keyword}`,
            `buy ${keyword}`,
          ],
          language_name: "English",
          location_code: 2840,
        }]),
      }
    );

    const data = await response.json();

    if (!data.tasks || data.tasks[0].status_code !== 20000) {
      return NextResponse.json({ error: "API error" }, { status: 500 });
    }

    const results = data.tasks[0].result || [];

    const related = results
      .filter((item: any) => item.search_volume > 0)
      .map((item: any) => {
        const vol = item.search_volume || 0;
        const comp = item.competition_index || 0;
        const trend = item.monthly_searches?.[0]?.search_volume || 0;
        const prevTrend = item.monthly_searches?.[1]?.search_volume || 0;
        const trendPct = prevTrend > 0 ? Math.round(((trend - prevTrend) / prevTrend) * 100) : 0;

        return {
          kw: item.keyword,
          vol: isPro ? vol.toLocaleString() : "••••",
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
      volume: isPro
        ? (totalVol > 1000 ? `${Math.round(totalVol / 1000)}K` : String(totalVol))
        : "••••",
      competition: avgComp < 33 ? "Low" : avgComp < 66 ? "Medium" : "High",
      compScore: isPro ? Math.round(avgComp) : null,
      opportunity: avgComp < 33 && totalVol > 5000 ? "High" : avgComp > 66 ? "Low" : "Medium",
      trend: mainKw?.trend || "→ Stable",
      related: isPro ? related.slice(0, 10) : related.slice(0, 3),
      isPro,
      plan: user.plan,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}