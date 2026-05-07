import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getSupabaseAdmin();
  const { data: { user }, error: authErr } = await db.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile, error } = await db
    .from("pattern_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  // Fetch last 7 entries for the dashboard
  const { data: recentEntries } = await db
    .from("daily_entries")
    .select("entry_date, energy_score, mood, daily_insight")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false })
    .limit(7);

  // Subscription status
  const { data: subscription } = await db
    .from("subscriptions")
    .select("status, plan, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    profile,
    recentEntries: recentEntries ?? [],
    subscription:  subscription ?? null,
  });
}
