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
  // 1. Auth
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. User Supabase
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 3. Trial expiré
  if (user.plan === "trial" && user.trial_ends_at) {
    const trialEnd = new Date(user.trial_ends_at);
    if (new Date() > trialEnd) {
      return NextResponse.json({ error: "trial_expired", message: "Your free trial has expired. Please upgrade to continue." }, { status: 403 });
    }
  }

  // 4. Limite de recherches
  const limit = PLAN_LIMITS[user.plan] || 10;
  if (user.searches_used >= limit) {
    return NextResponse.json({ error: "limit_reached", message: `You've reached your ${limit} searches limit. Upgrade to continue.`, plan: user.plan }, { status: 403 });
  }

  // 5. Incrémenter searches_used
  await supabaseAdmin
    .from("users")
    .update({ searches_used: user.searches_used + 1 })
    .eq("clerk_id", userId);

  const { keyword } = await req.json();
  const isPro = ["pro", "agency"].includes(user.plan);

  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  const base64 = Buffer.from(`${login}:${password}`).toString("base64");

  try {
    const response = await fetch(
      "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
      {
        method: "POST",
        headers: { Authorization: `Basic ${base64}`, "Content-Type": "application/json" },
        body: JSON.stringify([{ keywords: [keyword], language_name: "English", location_code: 2840 }]),
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
        volume: isPro ? m.search_volume || 0 : null,
      }));

    const volumes = monthly.map((m: any) => m.search_volume || 0);
    const max = isPro ? Math.max(...volumes) : null;
    const min = isPro ? Math.min(...volumes) : null;
    const avg = Math.round(volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length);
    const latest = volumes[volumes.length - 1];
    const previous = volumes[volumes.length - 2] || latest;
    const trendPct = previous > 0 ? Math.round(((latest - previous) / previous) * 100) : 0;

    return NextResponse.json({
      keyword,
      months,
      max,
      min,
      avg: isPro ? avg : null,
      trendPct,
      current: isPro ? latest : null,
      verdict: trendPct > 10 ? "Rising" : trendPct < -10 ? "Declining" : "Stable",
      isPro,
      searchesLeft: limit - (user.searches_used + 1),
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}