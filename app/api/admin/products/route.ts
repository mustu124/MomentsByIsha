import { adminJson, getServiceSupabase, requireAdmin } from "@/lib/admin-api-auth";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const payload = await request.json();
  const { data, error } = await supabase.from("products").insert(payload).select("id, name, slug, updated_at").maybeSingle();
  if (error) return adminJson({ error: error.message }, 400);
  if (!data) return adminJson({ error: "Product was not created." }, 400);

  return adminJson({ product: data });
}
