import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address;
    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + 2);

    await supabaseAdmin.from("users").insert({
      clerk_id: id,
      email: email,
      plan: "trial",
      searches_used: 0,
      searches_limit: 999,
      trial_ends_at: trialEnds.toISOString(),
    });
  }

  return NextResponse.json({ success: true });
}