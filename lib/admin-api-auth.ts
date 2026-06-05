import { createClient } from "@supabase/supabase-js";

export type AdminAuthResult =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; status: number; message: string };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getServiceSupabase() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function requireAdmin(request: Request): Promise<AdminAuthResult> {
  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return { ok: false, status: 500, message: "Supabase admin environment is not configured." };
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { ok: false, status: 401, message: "Please log in again." };

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) return { ok: false, status: 401, message: "Your admin session expired. Please log in again." };

  return { ok: true, userId: data.user.id, email: data.user.email?.toLowerCase() || null };
}

export function adminJson(body: unknown, status = 200) {
  return Response.json(body, { status });
}
