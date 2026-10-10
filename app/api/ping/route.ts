import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Run on every request, never cache. Without this, Next.js can pre-render
// this GET route at build time and the cron would get a cached response
// that never touches Supabase.
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // supabase-js does not throw on failure — it returns { error }.
  // Check it explicitly so a failed ping shows up as a 500 in Vercel logs.
  const { error } = await supabase
    .from("keepalive_log")
    .insert({ notes: "cron_ping" });

  if (error) {
    console.error("keepalive_log insert failed:", error.message);
    return NextResponse.json(
      { status: "db_error", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "alive" });
}
