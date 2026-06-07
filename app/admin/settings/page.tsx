"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Save, Upload } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { fetchAdminSettings } from "@/lib/admin-data";
import { getSafeAdminAccessToken } from "@/lib/admin-session";
import { demoSettings } from "@/lib/demo-data";
import type { SiteSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(demoSettings);
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<keyof SiteSettings | "">("");

  useEffect(() => {
    fetchAdminSettings().then(({ settings, error }) => {
      if (settings) setSettings({ ...demoSettings, ...settings });
      setNotice(error || "");
    });
  }, []);

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setNotice("");

    const accessToken = await getSafeAdminAccessToken();
    if (!accessToken) {
      setIsSaving(false);
      setNotice("Please log in again.");
      return;
    }

    const settingsId = settings.id || crypto.randomUUID();
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...settings, id: settingsId }),
    });
    const result = await response.json();

    setIsSaving(false);
    if (!response.ok) {
      setNotice(result.error || "Settings were not saved.");
      return;
    }

    const savedSettings = result.settings || (await fetchAdminSettings()).settings;
    if (savedSettings) setSettings({ ...demoSettings, ...savedSettings });
    setNotice(result.warning || "Settings saved. Public site will reflect this immediately.");
  }

  async function uploadImage(key: keyof SiteSettings, file: File) {
    const accessToken = await getSafeAdminAccessToken();
    if (!accessToken) {
      setNotice("Please log in again.");
      return;
    }

    setUploadingKey(key);
    setNotice("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "site-banners");

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setNotice(result.error || "Image upload failed. Please try again.");
        return;
      }
      setSettings((current) => ({ ...current, [key]: result.publicUrl || "" }));
      setNotice("Image uploaded. Click Save Settings to publish this change.");
    } finally {
      setUploadingKey("");
    }
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
            <section className="border-t border-ink/10 pt-6">
              <div className="flex items-center gap-3">
                <ImagePlus size={22} />
                <div>
                  <h2 className="text-2xl font-semibold">Website Images</h2>
                  <p className="mt-1 text-sm leading-6 text-ink/52">
                    Upload homepage banners and About page imagery without changing products.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <ImageSetting
                  label="Homepage Hero Banner"
                  field="home_hero_image_url"
                  value={settings.home_hero_image_url || ""}
                  isUploading={uploadingKey === "home_hero_image_url"}
                  onChange={(value) => setSettings({ ...settings, home_hero_image_url: value })}
                  onUpload={uploadImage}
                />
                <ImageSetting
                  label="Homepage Story Banner"
                  field="home_story_image_url"
                  value={settings.home_story_image_url || ""}
                  isUploading={uploadingKey === "home_story_image_url"}
                  onChange={(value) => setSettings({ ...settings, home_story_image_url: value })}
                  onUpload={uploadImage}
                />
                <ImageSetting
                  label="About Hero Banner"
                  field="about_hero_image_url"
                  value={settings.about_hero_image_url || ""}
                  isUploading={uploadingKey === "about_hero_image_url"}
                  onChange={(value) => setSettings({ ...settings, about_hero_image_url: value })}
                  onUpload={uploadImage}
                />
                <ImageSetting
                  label="About Founder Image"
                  field="about_founder_image_url"
                  value={settings.about_founder_image_url || ""}
                  isUploading={uploadingKey === "about_founder_image_url"}
                  onChange={(value) => setSettings({ ...settings, about_founder_image_url: value })}
                  onUpload={uploadImage}
                />
              </div>
            </section>
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

function ImageSetting({
  label,
  field,
  value,
  isUploading,
  onChange,
  onUpload,
}: {
  label: string;
  field: keyof SiteSettings;
  value: string;
  isUploading: boolean;
  onChange: (value: string) => void;
  onUpload: (field: keyof SiteSettings, file: File) => void;
}) {
  return (
    <section className="rounded-md border border-ink/10 bg-[#fffaf4] p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#f4eadc]">
        {value ? <img src={value} alt={`${label} preview`} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm text-ink/40">No Image Selected</div>}
      </div>
      <Field label={label} value={value} onChange={onChange} />
      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-ink/20 bg-white px-4 py-3 text-sm">
        <Upload size={16} />
        {isUploading ? "Uploading..." : "Upload Image"}
        <input
          className="hidden"
          type="file"
          accept="image/*,.webp,.jpg,.jpeg,.png,.heic,.heif"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) onUpload(field, file);
          }}
        />
      </label>
    </section>
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
