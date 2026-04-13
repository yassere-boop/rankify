import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

function getPlanFromProductName(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes("agency")) return "agency";
  if (name.includes("pro")) return "pro";
  if (name.includes("starter")) return "starter";
  return "starter";
}

function getSearchesLimit(plan: string): number {
  const limits: Record<string, number> = {
    starter: 100,
    pro: 500,
    agency: 999999,
  };
  return limits[plan] || 100;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  // Verify signature
  if (secret && signature) {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");
    if (digest !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta?.event_name;
  const data = payload.data?.attributes;
  const userEmail = data?.user_email;
  const productName = data?.product_name || "";
  const status = data?.status;

  console.log("Lemon Squeezy event:", eventName, userEmail, productName, status);

  if (!userEmail) {
    return NextResponse.json({ received: true });
  }

  // Handle subscription created or updated
  if (eventName === "subscription_created" || eventName === "subscription_updated") {
    const plan = getPlanFromProductName(productName);
    const searchesLimit = getSearchesLimit(plan);

    if (status === "active" || status === "on_trial") {
      await supabaseAdmin
        .from("users")
        .update({
          plan,
          searches_limit: searchesLimit,
          searches_used: 0,
        })
        .eq("email", userEmail);
    }
  }

  // Handle subscription cancelled or expired
  if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
    await supabaseAdmin
      .from("users")
      .update({
        plan: "trial",
        searches_limit: 10,
      })
      .eq("email", userEmail);
  }

  return NextResponse.json({ received: true });
}