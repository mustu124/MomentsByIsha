import { adminJson, getServiceSupabase, requireAdmin } from "@/lib/admin-api-auth";

function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (error) return adminJson({ error: error.message }, 400);

  return adminJson({ categories: data || [] });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const payload = stripUndefined(await request.json());
  const { data, error } = await supabase.from("categories").insert(payload).select("*").maybeSingle();
  if (error) return adminJson({ error: error.message }, 400);
  if (!data) return adminJson({ error: "Category was not created." }, 400);

  return adminJson({ category: data });
}
