import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    await supabase.from("keepalive_log").insert({ notes: "cron_ping" });
  } catch {
    // Log failure must never break the ping response
    console.error("keepalive_log insert failed");
  }

  return NextResponse.json({ status: "alive" });
}
