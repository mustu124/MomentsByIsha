import { adminJson, getServiceSupabase, requireAdmin } from "@/lib/admin-api-auth";

function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const { id } = await params;
  const payload = stripUndefined(await request.json());
  const { data, error } = await supabase.from("categories").update(payload).eq("id", id).select("*").maybeSingle();
  if (error) return adminJson({ error: error.message }, 400);
  if (!data) return adminJson({ error: "Category was not found." }, 404);

  return adminJson({ category: data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const { id } = await params;
  const { data, error } = await supabase.from("categories").delete().eq("id", id).select("id").maybeSingle();
  if (error) return adminJson({ error: error.message }, 400);
  if (!data) return adminJson({ error: "Category was not found." }, 404);

  return adminJson({ category: data });
}
