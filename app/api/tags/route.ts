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

  const { product } = await req.json();

  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  const base64 = Buffer.from(`${login}:${password}`).toString("base64");

  const seeds = [
    product, `${product} handmade`, `${product} custom`, `${product} gift`,
    `${product} personalised`, `${product} etsy`, `${product} print`,
    `${product} shop`, `buy ${product}`, `${product} unique`,
    `${product} redbubble`, `${product} design`, `${product} art`,
    `${product} vintage`, `${product} aesthetic`,
  ];

  try {
    const response = await fetch(
      "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
      {
        method: "POST",
        headers: { Authorization: `Basic ${base64}`, "Content-Type": "application/json" },
        body: JSON.stringify([{ keywords: seeds, language_name: "English", location_code: 2840 }]),
      }
    );

    const data = await response.json();

    if (!data.tasks || data.tasks[0].status_code !== 20000) {
      return NextResponse.json({ error: "API error" }, { status: 500 });
    }

    const results = data.tasks[0].result || [];
    const isPro = ["pro", "agency"].includes(user.plan);

    const sorted = results
      .filter((r: any) => r.search_volume > 0)
      .sort((a: any, b: any) => b.search_volume - a.search_volume);

    const tags = sorted.map((r: any) => ({
      tag: r.keyword,
      volume: isPro ? r.search_volume : null,
      competition: r.competition_index < 33 ? "Low" : r.competition_index < 66 ? "Medium" : "High",
      score: isPro ? Math.round((r.search_volume / 1000) * (1 - r.competition_index / 100) * 100) : null,
    }));

    const shortTags = product.split(" ").filter((w: string) => w.length > 2).map((w: string) => ({
      tag: w.toLowerCase(), volume: null, competition: "Low", score: 50,
    }));

    const allTags = [...tags, ...shortTags].slice(0, isPro ? 13 : 5);

    return NextResponse.json({
      tags: allTags,
      product,
      isPro,
      searchesLeft: limit - (user.searches_used + 1),
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}