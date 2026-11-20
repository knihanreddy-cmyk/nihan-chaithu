"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageBackground } from "@/components/designs/shared";
import { logout } from "../actions";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages/home", label: "Home page" },
  { href: "/admin/pages/chaithrika", label: "Chaithrika" },
  { href: "/admin/pages/nihan", label: "Nihan" },
  { href: "/admin/media", label: "Photos" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminNav() {
  usePageBackground("#f5f5f4");
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 z-20 border-b border-stone-200 bg-white md:h-svh md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-4 py-3 md:block md:px-5 md:py-6">
        <Link href="/admin" className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            Chaithrika &amp; Nihan
          </span>
          <span className="block text-lg font-semibold">Portfolio CMS</span>
        </Link>
        <a href="/" target="_blank" className="text-sm text-stone-500 hover:text-stone-900 md:hidden">
          View site ↗
        </a>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3 md:pb-0" aria-label="Admin">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 aria-[current=page]:bg-stone-900 aria-[current=page]:text-white"
          >
            {l.label}
          </Link>
        ))}
        <form action={logout} className="md:hidden">
          <button type="submit" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-stone-500">
            Sign out
          </button>
        </form>
      </nav>
      <div className="hidden px-5 pt-8 md:block">
        <a href="/" target="_blank" className="block text-sm text-stone-500 hover:text-stone-900">
          View site ↗
        </a>
        <form action={logout} className="mt-3">
          <button type="submit" className="text-sm text-stone-500 hover:text-stone-900">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
