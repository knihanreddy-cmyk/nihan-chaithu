"use client";

import { ArrowUpRight, ChevronDown, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { PageSchema } from "@/lib/cms/fields";
import { resetContent, saveContent } from "../actions";
import { FieldGrid } from "./fields";

type Obj = Record<string, unknown>;

/** Fixed locale and time zone, so the server and the browser render the same text. */
const stamp = (iso: string, withDate = true) =>
  new Intl.DateTimeFormat("en-IN", {
    ...(withDate ? { dateStyle: "medium" as const } : {}),
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));

const two = (n: number) => String(n).padStart(2, "0");
const anchor = (key: string) => `section-${key}`;

export default function ContentEditor({
  schema,
  initial,
  canSave,
  savedAt,
}: {
  schema: PageSchema;
  initial: Obj;
  canSave: boolean;
  savedAt: string | null;
}) {
  const [value, setValue] = useState<Obj>(initial);
  const [saved, setSaved] = useState<Obj>(initial);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(
    savedAt ? { kind: "ok", text: `Saved ${stamp(savedAt)}` } : null,
  );
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [active, setActive] = useState(schema.sections[0]?.key ?? "");
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  const save = useCallback(() => {
    if (!canSave || pending) return;
    const snapshot = value;
    startTransition(async () => {
      const res = await saveContent(schema.id, snapshot);
      if (res.ok) {
        setSaved(snapshot);
        setStatus({ kind: "ok", text: `Published ${stamp(res.savedAt, false)} — live on the site` });
      } else setStatus({ kind: "error", text: res.error });
    });
  }, [canSave, pending, schema.id, value]);

  // Ctrl/Cmd+S saves; warn before leaving with unsaved changes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [save, dirty]);

  // Highlight the section in view in the "On this page" index.
  useEffect(() => {
    const els = schema.sections.map((s) => document.getElementById(anchor(s.key))).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id.replace("section-", ""));
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [schema.sections]);

  const toggle = (key: string) =>
    setCollapsed((c) => {
      const next = new Set(c);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const statusText = dirty
    ? "Unsaved changes"
    : (status?.text ?? (canSave ? "Showing the original content — save to publish your edits" : "Saving is off until the database is connected"));
  const dot = status?.kind === "error" ? "bg-red-600" : dirty ? "bg-[#9C3F5C]" : "bg-[#3E8F6A]";

  return (
    <div>
      {/* Header + save bar */}
      <header className="sticky top-[97px] z-10 -mx-4 mb-8 border-b border-[#1E1B18] bg-[#F5F0E8]/95 px-4 pb-4 pt-3 backdrop-blur sm:-mx-8 sm:px-8 md:top-0 md:-mx-14 md:px-14 md:pt-7">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
          <div className="mr-auto min-w-0">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#9C3F5C]">
              <Link href="/admin" className="hover:underline">
                PAGES
              </Link>{" "}
              · {schema.path}
            </p>
            <h1 className="mt-1.5 font-fraunces text-[40px] font-light leading-none tracking-tight sm:text-[48px]">{schema.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={schema.path}
              target="_blank"
              className="inline-flex h-11 items-center gap-1.5 rounded-[12px] border border-[#DDD3C6] bg-[#FFFDF9] px-4 text-sm font-medium transition hover:border-[#1E1B18]"
            >
              View page
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </a>
            {dirty && (
              <button
                type="button"
                onClick={() => setValue(saved)}
                className="inline-flex h-11 items-center rounded-[12px] px-4 text-sm font-medium text-[#5A534B] transition hover:bg-[#1E1B18]/5 hover:text-[#1E1B18]"
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!canSave || pending || !dirty}
              className="inline-flex h-11 items-center gap-3 rounded-[12px] bg-[#1E1B18] pl-5 pr-2 text-sm font-semibold text-[#F5F0E8] transition hover:bg-[#3A3530] disabled:bg-[#1E1B18]/25 disabled:text-[#1E1B18]/50"
              title={canSave ? "Save & publish (Ctrl+S)" : "Set MONGODB_URI to enable saving"}
            >
              {pending ? "Publishing…" : "Save & publish"}
              <kbd className="rounded-md bg-white/15 px-1.5 py-0.5 font-manrope text-[11px] font-medium">Ctrl S</kbd>
            </button>
          </div>
        </div>
        <p className={`mt-3 flex items-center gap-2 text-[13px] ${status?.kind === "error" ? "text-red-700" : "text-[#5A534B]"}`} role="status">
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot} ${dirty ? "animate-pulse" : ""}`} />
          {statusText}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* On this page */}
        <nav aria-label="Sections" className="hidden lg:block">
          <div className="sticky top-[190px]">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-[#6B635A]">ON THIS PAGE</p>
            <ol className="flex flex-col border-l border-[#DDD3C6]">
              {schema.sections.map((s, i) => {
                const on = active === s.key;
                return (
                  <li key={s.key}>
                    <a
                      href={`#${anchor(s.key)}`}
                      aria-current={on ? "true" : undefined}
                      className={`-ml-px flex items-baseline gap-2.5 border-l-2 py-2 pl-4 text-sm transition ${
                        on ? "border-[#9C3F5C] font-semibold text-[#1E1B18]" : "border-transparent text-[#5A534B] hover:text-[#1E1B18]"
                      }`}
                    >
                      <span className={`font-fraunces text-xs ${on ? "text-[#9C3F5C]" : "text-[#A79E92]"}`}>{two(i + 1)}</span>
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>

        {/* Sections */}
        <div className="flex min-w-0 flex-col gap-6">
          {schema.sections.map((section, i) => {
            const isOpen = !collapsed.has(section.key);
            return (
              <section
                key={section.key}
                id={anchor(section.key)}
                className="scroll-mt-[200px] overflow-hidden rounded-[18px] border border-[#DDD3C6] bg-[#FFFDF9] shadow-[0_1px_0_rgba(30,27,24,.04)]"
              >
                <h2>
                  <button
                    type="button"
                    onClick={() => toggle(section.key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-[#F5F0E8]/50"
                  >
                    <span className="font-fraunces text-[15px] text-[#9C3F5C]">{two(i + 1)}</span>
                    <span className="mr-auto font-fraunces text-[26px] font-light leading-tight">{section.label}</span>
                    <span className="hidden text-xs text-[#6B635A] sm:inline">
                      {section.fields.length} field{section.fields.length === 1 ? "" : "s"}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#6B635A] transition-transform ${isOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </button>
                </h2>
                {isOpen && (
                  <div className="border-t border-[#EFE8DD] px-6 pb-7 pt-6">
                    <FieldGrid
                      fields={section.fields}
                      value={(value[section.key] as Obj) ?? {}}
                      onChange={(v) => setValue((all) => ({ ...all, [section.key]: v }))}
                    />
                  </div>
                )}
              </section>
            );
          })}

          {canSave && (
            <form
              action={resetContent.bind(null, schema.id)}
              className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-dashed border-[#D9B4C0] px-6 py-5"
              onSubmit={(e) => {
                if (!confirm("Reset this page to the original built-in words and photos? Your saved edits will be deleted.")) e.preventDefault();
              }}
            >
              <div>
                <p className="font-fraunces text-xl font-light">Start over</p>
                <p className="mt-0.5 text-[13px] text-[#6B635A]">Put back the original words and photos for this page.</p>
              </div>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#9C3F5C]/40 px-4 text-sm font-medium text-[#9C3F5C] transition hover:bg-[#9C3F5C] hover:text-[#FFFDF9]"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                Reset page
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
