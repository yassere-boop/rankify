import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // 1. Vérifier la signature Clerk
    const payload = await req.text();
    const headers = {
      "svix-id": req.headers.get("svix-id") || "",
      "svix-timestamp": req.headers.get("svix-timestamp") || "",
      "svix-signature": req.headers.get("svix-signature") || "",
    };

    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
    }

    let event: any;
    try {
      const wh = new Webhook(secret);
      event = wh.verify(payload, headers);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { type, data } = event;

    // 2. User créé
    if (type === "user.created") {
      const { id, email_addresses } = data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        return NextResponse.json({ error: "No email" }, { status: 400 });
      }

      // Vérifier si le user existe déjà (double inscription)
      const { data: existing } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("clerk_id", id)
        .single();

      if (existing) {
        return NextResponse.json({ success: true, note: "User already exists" });
      }

      // Vérifier si email existe déjà (Google + email)
      const { data: existingEmail } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (existingEmail) {
        // Mettre à jour le clerk_id si l'email existe déjà
        await supabaseAdmin
          .from("users")
          .update({ clerk_id: id })
          .eq("email", email);
        return NextResponse.json({ success: true, note: "Updated existing user" });
      }

      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 1);

      const { error } = await supabaseAdmin.from("users").insert({
        clerk_id: id,
        email: email,
        plan: "trial",
        searches_used: 0,
        searches_limit: 10,
        trial_ends_at: trialEnds.toISOString(),
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // 3. User supprimé
    if (type === "user.deleted") {
      const { id } = data;
      await supabaseAdmin.from("users").delete().eq("clerk_id", id);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}