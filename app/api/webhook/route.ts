import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (type === "user.created") {
      const { id, email_addresses } = data;
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
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}