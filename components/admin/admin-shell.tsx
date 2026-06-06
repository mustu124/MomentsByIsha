"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, FolderTree, LogOut, Settings } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { clearAdminSession } from "@/lib/admin-session";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  const pathname = usePathname();

  async function signOut() {
    await clearAdminSession();
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-[#f7f1ea] text-base text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-ink/10 bg-white lg:block">
        <div className="flex h-24 items-center gap-4 border-b border-ink/10 px-7">
          <BrandLogo size="md" showText={false} />
          <div>
            <p className="text-lg font-semibold">Moments By Isha</p>
            <p className="text-sm text-ink/52">Admin</p>
          </div>
        </div>
        <nav className="space-y-2 p-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-base transition ${
                  active ? "bg-ink text-white" : "text-ink/68 hover:bg-[#f7f1ea] hover:text-ink"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-[#f7f1ea]/90 backdrop-blur">
          <div className="flex min-h-24 items-center justify-between gap-4 px-5 sm:px-7 lg:px-10">
            <div className="min-w-0">
              <p className="text-sm uppercase tracking-[0.16em] text-ink/48">Admin Panel</p>
              <h1 className="truncate text-2xl font-semibold sm:text-3xl">{title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {action}
              <button onClick={signOut} className="inline-flex items-center gap-2 rounded-md border border-ink/12 bg-white px-5 py-3 text-base">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-ink/10 px-5 py-3 lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full border border-ink/10 bg-white px-5 py-2.5 text-base">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-5 py-7 sm:px-7 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
