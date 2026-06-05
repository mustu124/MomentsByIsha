"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-porcelain text-sm text-ink/60">Loading login...</main>}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!hasSupabaseConfig || !supabase) {
      setMessage("Add Supabase environment variables before using admin login.");
      return;
    }
    setIsLoading(true);
    await supabase.auth.signOut();
    const cleanedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanedEmail, password: password.trim() });
    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }
    const { data: persistedSession } = await supabase.auth.getSession();
    setIsLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (!persistedSession.session) {
      setMessage("Login succeeded, but the browser could not save the session. Clear the session and try once more.");
      return;
    }
    window.location.href = searchParams.get("next") || "/admin/dashboard";
  }

  async function clearSession() {
    setMessage("");
    setPassword("");
    if (hasSupabaseConfig && supabase) await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      Object.keys(window.localStorage)
        .filter((key) => key.includes("supabase") || key.startsWith("sb-"))
        .forEach((key) => window.localStorage.removeItem(key));
    }
    setMessage("Saved session cleared. Please log in again.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-porcelain px-4 py-12">
      <section className="w-full max-w-md rounded-md border border-ink/10 bg-white/72 p-8 shadow-soft">
        <BrandLogo size="md" />
        <p className="mt-3 text-sm leading-6 text-ink/62">
          Admin access for catalogue updates, product images, pricing, and WhatsApp settings.
        </p>
        {searchParams.get("message") === "admin-required" ? (
          <p className="mt-4 rounded-md bg-[#f4eadc] px-4 py-3 text-sm leading-6 text-clay">
            Please log in again. Your previous browser session was cleared.
          </p>
        ) : null}
        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          <label className="block text-sm">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-sm border border-ink/14 bg-white px-4 py-3 outline-none focus:border-ink" type="email" autoComplete="email" required />
          </label>
          <label className="block text-sm">
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-sm border border-ink/14 bg-white px-4 py-3 outline-none focus:border-ink" type="password" autoComplete="current-password" required />
          </label>
          <button disabled={isLoading} className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-medium uppercase tracking-[0.16em] text-porcelain disabled:opacity-60">
            <LogIn size={16} />
            {isLoading ? "Signing in" : "Login"}
          </button>
        </form>
        {message ? <p className="mt-4 text-sm text-clay">{message}</p> : null}
        <button type="button" onClick={clearSession} className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-ink/45 underline-offset-4 hover:text-ink hover:underline">
          Clear saved session
        </button>
      </section>
    </main>
  );
}
