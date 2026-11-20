"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type { PageSchema } from "@/lib/cms/fields";
import { resetContent, saveContent } from "../actions";
import { Fields } from "./fields";

type Obj = Record<string, unknown>;

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
    savedAt ? { kind: "ok", text: `Last saved ${new Date(savedAt).toLocaleString()}` } : null,
  );
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  const save = useCallback(() => {
    if (!canSave || pending) return;
    const snapshot = value;
    startTransition(async () => {
      const res = await saveContent(schema.id, snapshot);
      if (res.ok) {
        setSaved(snapshot);
        setStatus({ kind: "ok", text: `Saved ${new Date(res.savedAt).toLocaleTimeString()} — live on the site now.` });
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

  return (
    <div>
      <div className="sticky top-[100px] z-10 mb-6 flex flex-wrap items-center gap-3 rounded-[22px] border border-white/70 bg-white/70 px-5 py-3 shadow-[0_20px_50px_-35px_rgba(42,27,46,.6)] backdrop-blur-xl md:top-4">
        <div className="mr-auto min-w-0">
          <h1 className="font-playfair text-3xl leading-tight">{schema.title}</h1>
          <p className={`text-xs ${status?.kind === "error" ? "text-red-700" : "text-[#2A1B2E]/55"}`} role="status">
            {dirty ? "Unsaved changes" : (status?.text ?? "Showing the built-in content. Save to store it in the database.")}
          </p>
        </div>
        <a href={schema.path} target="_blank" className="rounded-full px-3.5 py-2 text-sm font-medium text-[#2A1B2E]/65 hover:bg-white">
          View page ↗
        </a>
        {dirty && (
          <button
            type="button"
            onClick={() => setValue(saved)}
            className="rounded-full px-3.5 py-2 text-sm font-medium text-[#2A1B2E]/65 hover:bg-white"
          >
            Discard
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={!canSave || pending || !dirty}
          className="rounded-full bg-[#2A1B2E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3B2741] disabled:opacity-40"
          title={canSave ? "Save (Ctrl+S)" : "Set MONGODB_URI to enable saving"}
        >
          {pending ? "Saving…" : "Save & publish"}
        </button>
      </div>

      <div className="space-y-4">
        {schema.sections.map((section, i) => (
          <details key={section.key} open={i === 0} className="group rounded-[22px] border border-white/70 bg-white/65 shadow-[0_24px_60px_-40px_rgba(42,27,46,.5)] backdrop-blur-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold">
              {section.label}
              <span className="text-sm font-normal text-[#2A1B2E]/40 group-open:rotate-180" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="space-y-5 border-t border-[#2A1B2E]/5 px-5 py-5">
              <Fields
                fields={section.fields}
                value={(value[section.key] as Obj) ?? {}}
                onChange={(v) => setValue((all) => ({ ...all, [section.key]: v }))}
              />
            </div>
          </details>
        ))}
      </div>

      {canSave && (
        <form
          action={resetContent.bind(null, schema.id)}
          className="mt-10 border-t border-[#2A1B2E]/10 pt-6"
          onSubmit={(e) => {
            if (!confirm("Reset this page to the original built-in words and photos? Your saved edits will be deleted.")) e.preventDefault();
          }}
        >
          <button type="submit" className="text-sm text-red-700 hover:text-red-900">
            Reset page to original content
          </button>
        </form>
      )}
    </div>
  );
}
