"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { fetchAdminSettings } from "@/lib/admin-data";
import { demoSettings } from "@/lib/demo-data";
import { supabase } from "@/lib/supabase";
import type { SiteSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(demoSettings);
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAdminSettings().then(({ settings, error }) => {
      if (settings) setSettings({ ...demoSettings, ...settings });
      setNotice(error || "");
    });
  }, []);

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setIsSaving(true);
    setNotice("");

    const settingsId = settings.id || crypto.randomUUID();
    const result = settings.id
      ? await supabase.from("site_settings").update(settings, { count: "exact" }).eq("id", settings.id)
      : await supabase.from("site_settings").insert({ ...settings, id: settingsId }, { count: "exact" });

    setIsSaving(false);
    if (result.error) {
      setNotice(result.error.message);
      return;
    }

    const { settings: savedSettings } = await fetchAdminSettings();
    if (savedSettings) setSettings({ ...demoSettings, ...savedSettings });
    setNotice("Settings saved. Public site will reflect this immediately.");
  }

  return (
    <AdminGuard>
      <AdminShell title="Settings">
        <AdminCard className="max-w-4xl">
          <form onSubmit={saveSettings} className="space-y-5">
            <Field label="Brand name" value={settings.brand_name} onChange={(value) => setSettings({ ...settings, brand_name: value })} />
            <Field label="WhatsApp number" value={settings.whatsapp_number || ""} onChange={(value) => setSettings({ ...settings, whatsapp_number: value })} />
            <Field
              label="WhatsApp message template"
              value={settings.whatsapp_message_template || ""}
              onChange={(value) => setSettings({ ...settings, whatsapp_message_template: value })}
            />
            <p className="text-sm leading-6 text-ink/50">Use {"{{product_name}}"} where the selected product name should appear.</p>
            <Field label="Contact email" value={settings.contact_email || ""} onChange={(value) => setSettings({ ...settings, contact_email: value })} />
            <Field label="Instagram URL" value={settings.instagram_url || ""} onChange={(value) => setSettings({ ...settings, instagram_url: value })} />
            <button disabled={isSaving} className="inline-flex items-center gap-2 rounded-md bg-ink px-6 py-4 text-base text-white disabled:opacity-60">
              <Save size={18} />
              {isSaving ? "Saving..." : "Save settings"}
            </button>
            {notice ? <p className="text-base text-ink/60">{notice}</p> : null}
          </form>
        </AdminCard>
      </AdminShell>
    </AdminGuard>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-base">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-md border border-ink/12 px-4 py-3.5 text-base outline-none focus:border-ink" />
    </label>
  );
}
