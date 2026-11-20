"use client";

import { Compass, ExternalLink, House, Images, Inbox, LayoutDashboard, LogOut, Sparkles, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageBackground } from "@/components/designs/shared";
import { logout } from "../actions";

const LINKS: { href: string; label: string; icon: LucideIcon; group: "main" | "pages" | "library" }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { href: "/admin/pages/home", label: "Home page", icon: House, group: "pages" },
  { href: "/admin/pages/chaithrika", label: "Chaithrika", icon: Sparkles, group: "pages" },
  { href: "/admin/pages/nihan", label: "Nihan", icon: Compass, group: "pages" },
  { href: "/admin/media", label: "Photos", icon: Images, group: "library" },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, group: "library" },
];

const GROUPS = [
  { id: "main", label: "" },
  { id: "pages", label: "Pages" },
  { id: "library", label: "Library" },
] as const;

export default function AdminNav({ unread }: { unread: number }) {
  usePageBackground("#F3EFF4");
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const item = (l: (typeof LINKS)[number], compact = false) => {
    const Icon = l.icon;
    const badge = l.href === "/admin/enquiries" && unread > 0 ? unread : 0;
    return (
      <Link
        key={l.href}
        href={l.href}
        aria-current={isActive(l.href) ? "page" : undefined}
        className={`group flex items-center gap-3 whitespace-nowrap rounded-full text-sm font-medium text-[#2A1B2E]/65 transition hover:bg-white/70 hover:text-[#2A1B2E] aria-[current=page]:bg-[#2A1B2E] aria-[current=page]:text-white aria-[current=page]:shadow-[0_10px_24px_-12px_rgba(42,27,46,.8)] ${
          compact ? "px-3.5 py-2" : "px-4 py-2.5"
        }`}
      >
        <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
        {l.label}
        {badge > 0 && (
          <span className="ml-auto rounded-full bg-[#D9577F] px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
            {badge}
            <span className="sr-only"> unread</span>
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop: glass sidebar */}
      <aside className="sticky top-0 z-20 hidden h-svh w-72 shrink-0 p-4 md:block">
        <div className="flex h-full flex-col rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-[0_30px_80px_-50px_rgba(42,27,46,.6)] backdrop-blur-xl">
          <Link href="/admin" className="block px-2 pt-1">
            <span className="block font-playfair text-[1.45rem] leading-tight tracking-tight">
              Chaithrika <i className="text-[#D9577F]">&amp;</i> Nihan
            </span>
            <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2A1B2E]/45">
              Portfolio CMS
            </span>
          </Link>

          <nav className="mt-8 flex-1 space-y-6" aria-label="Admin">
            {GROUPS.map((g) => (
              <div key={g.id}>
                {g.label && (
                  <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2A1B2E]/40">{g.label}</p>
                )}
                <div className="space-y-1">{LINKS.filter((l) => l.group === g.id).map((l) => item(l))}</div>
              </div>
            ))}
          </nav>

          <div className="space-y-1 border-t border-[#2A1B2E]/10 pt-4">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-[#2A1B2E]/65 hover:bg-white/70 hover:text-[#2A1B2E]"
            >
              <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.7} aria-hidden="true" />
              View website
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-[#2A1B2E]/65 hover:bg-white/70 hover:text-[#9E2F52]"
              >
                <LogOut className="h-4.5 w-4.5" strokeWidth={1.7} aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile: glass top bar with scrollable pills */}
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/60 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <Link href="/admin" className="font-playfair text-lg tracking-tight">
            Chaithrika <i className="text-[#D9577F]">&amp;</i> Nihan
          </Link>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" className="rounded-full p-2 text-[#2A1B2E]/60 hover:bg-white" aria-label="View website">
              <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.7} />
            </a>
            <form action={logout}>
              <button type="submit" className="rounded-full p-2 text-[#2A1B2E]/60 hover:bg-white" aria-label="Sign out">
                <LogOut className="h-4.5 w-4.5" strokeWidth={1.7} />
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3" aria-label="Admin">
          {LINKS.map((l) => item(l, true))}
        </nav>
      </header>
    </>
  );
}
