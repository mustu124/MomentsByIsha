import { adminJson, getServiceSupabase, requireAdmin } from "@/lib/admin-api-auth";

const siteImageFields = [
  "home_hero_image_url",
  "home_story_image_url",
  "about_hero_image_url",
  "about_founder_image_url",
];

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
  let skippedImageFields = false;
  let { data, error } = await supabase.from("site_settings").upsert({ ...payload, id: settingsId }).select("*").maybeSingle();
  const errorMessage = error?.message.toLowerCase() || "";
  if (error && siteImageFields.some((field) => errorMessage.includes(field))) {
    const legacyPayload = { ...payload };
    siteImageFields.forEach((field) => delete legacyPayload[field]);
    const legacyResult = await supabase.from("site_settings").upsert({ ...legacyPayload, id: settingsId }).select("*").maybeSingle();
    data = legacyResult.data;
    error = legacyResult.error;
    skippedImageFields = true;
  }
  if (error) return adminJson({ error: error.message }, 400);
  if (!data) return adminJson({ error: "Settings were not saved." }, 400);

  return adminJson({
    settings: data,
    warning: skippedImageFields ? "Settings saved, but image fields need the Supabase image settings SQL before images can be stored." : "",
  });
}
