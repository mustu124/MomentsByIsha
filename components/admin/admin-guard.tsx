"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "allowed" | "unconfigured">("checking");

  useEffect(() => {
    let isMounted = true;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    async function checkSession() {
      if (!hasSupabaseConfig || !supabase) {
        if (isMounted) setStatus("unconfigured");
        return;
      }

      const client = supabase;
      const { data } = await client.auth.getSession();
      if (!data.session) {
        redirectTimer = setTimeout(async () => {
          const { data: retryData } = await client.auth.getSession();
          if (!retryData.session && isMounted) {
            router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
          }
        }, 700);
        return;
      }

      if (isMounted) setStatus("allowed");
    }

    checkSession();

    const subscription = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session) {
        if (redirectTimer) clearTimeout(redirectTimer);
        setStatus("allowed");
      }
    });

    return () => {
      isMounted = false;
      if (redirectTimer) clearTimeout(redirectTimer);
      subscription?.data.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (status === "checking") {
    return <main className="grid min-h-screen place-items-center bg-[#f7f1ea] text-sm text-ink/60">Checking admin access...</main>;
  }

  if (status === "unconfigured") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f1ea] px-4 text-center">
        <section className="max-w-md rounded-md border border-ink/10 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Supabase setup required</h1>
          <p className="mt-3 text-sm leading-6 text-ink/62">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to use the admin panel.
          </p>
        </section>
      </main>
    );
  }

  return children;
}
