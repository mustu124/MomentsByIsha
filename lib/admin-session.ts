"use client";

import { supabase } from "@/lib/supabase";

function clearStoredSupabaseSession() {
  if (typeof window === "undefined") return;

  [window.localStorage, window.sessionStorage].forEach((storage) => {
    Object.keys(storage)
      .filter((key) => key.includes("supabase") || key.startsWith("sb-"))
      .forEach((key) => storage.removeItem(key));
  });
}

export async function clearAdminSession() {
  try {
    await supabase?.auth.signOut();
  } catch {
    // Stale refresh tokens can make sign-out throw. Local cleanup below is still enough.
  } finally {
    clearStoredSupabaseSession();
  }
}

export async function getSafeAdminSession() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      await clearAdminSession();
      return null;
    }
    return data.session;
  } catch {
    await clearAdminSession();
    return null;
  }
}

export async function getSafeAdminAccessToken() {
  const session = await getSafeAdminSession();
  return session?.access_token || "";
}
