import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.from("token_log").select("id").limit(1);
  } catch {
    return NextResponse.json({ status: "alive", note: "db check skipped" });
  }

  return NextResponse.json({ status: "alive", timestamp: new Date().toISOString() });
}
