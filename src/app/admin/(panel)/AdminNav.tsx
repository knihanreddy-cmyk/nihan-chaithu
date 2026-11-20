"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageBackground } from "@/components/designs/shared";
import { logout } from "../actions";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/pages/home", label: "Home page" },
  { href: "/admin/pages/chaithrika", label: "Chaithrika" },
  { href: "/admin/pages/nihan", label: "Nihan" },
  { href: "/admin/media", label: "Photos" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminNav({ unread }: { unread: number }) {
  usePageBackground("#F5F0E8");
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {/* Desktop: a slim editorial rail */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-9 border-r border-[#DDD3C6] px-7 py-8 md:flex">
        <Link href="/admin" className="block">
          <span className="block font-fraunces text-[26px] leading-[1.05]">
            Chaithrika
            <br />
            <i className="text-[#9C3F5C]">&amp;</i> Nihan
          </span>
          <span className="mt-2.5 block text-[11px] font-semibold tracking-[0.2em] text-[#6B635A]">STUDIO EDITION</span>
        </Link>

        <nav aria-label="Admin" className="flex flex-col">
          {LINKS.map((l, i) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className="group flex min-h-11 items-baseline gap-3 pt-2.5 text-[15px] text-[#5A534B] transition-colors hover:text-[#1E1B18] aria-[current=page]:font-semibold aria-[current=page]:text-[#1E1B18]"
              >
                <span className="font-fraunces text-[13px] text-[#6B635A] group-aria-[current=page]:text-[#9C3F5C]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative">
                  {l.label}
                  {active && <span aria-hidden="true" className="absolute -bottom-1 left-0 h-px w-full bg-[#9C3F5C]" />}
                </span>
                {l.href === "/admin/enquiries" && unread > 0 && (
                  <span className="text-xs font-semibold text-[#9C3F5C]">{unread} new</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1.5 text-[13px]">
          <a href="/" target="_blank" className="text-[#9C3F5C] hover:text-[#6E2440]">
            View website ↗
          </a>
          <form action={logout}>
            <button type="submit" className="text-[#5A534B] hover:text-[#1E1B18]">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile: masthead + scrollable section tabs */}
      <header className="sticky top-0 z-20 border-b border-[#1E1B18] bg-[#F5F0E8]/95 backdrop-blur md:hidden">
        <div className="flex items-baseline justify-between px-4 pb-2 pt-3">
          <Link href="/admin" className="font-fraunces text-xl">
            Chaithrika <i className="text-[#9C3F5C]">&amp;</i> Nihan
          </Link>
          <div className="flex gap-4 text-[13px]">
            <a href="/" target="_blank" className="text-[#9C3F5C]">
              Site ↗
            </a>
            <form action={logout}>
              <button type="submit" className="text-[#5A534B]">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Admin" className="flex gap-5 overflow-x-auto px-4 pb-2">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className="flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent text-sm text-[#5A534B] aria-[current=page]:border-[#9C3F5C] aria-[current=page]:font-semibold aria-[current=page]:text-[#1E1B18]"
            >
              <span className="font-fraunces text-xs text-[#9C3F5C]">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
              {l.href === "/admin/enquiries" && unread > 0 && (
                <span className="rounded-full bg-[#9C3F5C] px-1.5 text-[11px] font-semibold text-white">{unread}</span>
              )}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
