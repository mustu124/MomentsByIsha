import { adminJson, getServiceSupabase, requireAdmin } from "@/lib/admin-api-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const { id } = await params;
  const payload = await request.json();
  const { data, error } = await supabase.from("products").update(payload).eq("id", id).select("id, name, slug, updated_at").maybeSingle();
  if (error) return adminJson({ error: error.message }, 400);
  if (!data) return adminJson({ error: "Product was not found." }, 404);

  return adminJson({ product: data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const supabase = getServiceSupabase();
  if (!supabase) return adminJson({ error: "Supabase service role is not configured." }, 500);

  const { id } = await params;
  const { data, error } = await supabase.from("products").delete().eq("id", id).select("id").maybeSingle();
  if (error) return adminJson({ error: error.message }, 400);
  if (!data) return adminJson({ error: "Product was not found." }, 404);

  return adminJson({ product: data });
}
