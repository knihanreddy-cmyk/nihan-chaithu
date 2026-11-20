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
      <div className="sticky top-[104px] z-10 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-stone-200 bg-stone-100/95 px-4 py-3 backdrop-blur md:top-0 md:-mx-8 md:px-8">
        <div className="mr-auto min-w-0">
          <h1 className="text-xl font-semibold">{schema.title}</h1>
          <p className={`text-xs ${status?.kind === "error" ? "text-red-700" : "text-stone-500"}`} role="status">
            {dirty ? "Unsaved changes" : (status?.text ?? "Showing the built-in content. Save to store it in the database.")}
          </p>
        </div>
        <a href={schema.path} target="_blank" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-white">
          View page ↗
        </a>
        {dirty && (
          <button
            type="button"
            onClick={() => setValue(saved)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-white"
          >
            Discard
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={!canSave || pending || !dirty}
          className="rounded-lg bg-stone-900 px-5 py-2 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-40"
          title={canSave ? "Save (Ctrl+S)" : "Set MONGODB_URI to enable saving"}
        >
          {pending ? "Saving…" : "Save & publish"}
        </button>
      </div>

      <div className="space-y-4">
        {schema.sections.map((section, i) => (
          <details key={section.key} open={i === 0} className="group rounded-xl bg-white ring-1 ring-stone-200">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold">
              {section.label}
              <span className="text-sm font-normal text-stone-400 group-open:rotate-180" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="space-y-5 border-t border-stone-100 px-5 py-5">
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
          className="mt-10 border-t border-stone-200 pt-6"
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
