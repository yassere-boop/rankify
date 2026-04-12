import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const PLAN_LIMITS: Record<string, number> = {
  trial: 10,
  starter: 100,
  pro: 500,
  agency: 999999,
};

export async function POST(req: NextRequest) {
  // 1. Vérifier l'auth
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Récupérer l'utilisateur dans Supabase
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 3. Vérifier le trial expiré
  if (user.plan === "trial" && user.trial_ends_at) {
    const trialEnd = new Date(user.trial_ends_at);
    if (new Date() > trialEnd) {
      return NextResponse.json({
        error: "trial_expired",
        message: "Your free trial has expired. Please upgrade to continue.",
      }, { status: 403 });
    }
  }

  // 4. Vérifier la limite de recherches
  const limit = PLAN_LIMITS[user.plan] || 10;
  if (user.searches_used >= limit) {
    return NextResponse.json({
      error: "limit_reached",
      message: `You've reached your ${limit} searches limit. Upgrade to continue.`,
      plan: user.plan,
    }, { status: 403 });
  }

  // 5. Incrémenter searches_used
  await supabaseAdmin
    .from("users")
    .update({ searches_used: user.searches_used + 1 })
    .eq("clerk_id", userId);

  // 6. Faire la vraie requête DataForSEO
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
      searchesLeft: limit - (user.searches_used + 1),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}