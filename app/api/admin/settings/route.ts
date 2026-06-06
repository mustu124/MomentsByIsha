import { adminJson, getServiceSupabase, requireAdmin } from "@/lib/admin-api-auth";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const { data, error } = await supabase.from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (error) return adminJson({ error: error.message }, 400);

  return adminJson({ settings: data || null });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const payload = await request.json();
  const settingsId = payload.id || crypto.randomUUID();
  const { data, error } = await supabase.from("site_settings").upsert({ ...payload, id: settingsId }).select("*").maybeSingle();
  if (error) return adminJson({ error: error.message }, 400);
  if (!data) return adminJson({ error: "Settings were not saved." }, 400);

  return adminJson({ settings: data });
}
