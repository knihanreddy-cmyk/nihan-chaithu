"use client";

import { useState } from "react";
import { deleteMedia } from "../../actions";
import UploadButton from "../../components/UploadButton";
import { thumb, type MediaItem } from "../../types";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export default function MediaLibrary({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  const remove = async (item: MediaItem) => {
    if (!confirm(`Delete ${item.name} from ImageKit? This cannot be undone.`)) return;
    setBusy(item.id);
    setMessage("");
    const res = await deleteMedia(item.id);
    setBusy(null);
    if (res.ok) setItems((list) => list.filter((m) => m.id !== item.id));
    else setMessage(res.error ?? "Could not delete");
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied.");
    } catch {
      setMessage(url);
    }
  };

  const shown = items.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <UploadButton onUploaded={(item) => setItems((list) => [item, ...list.filter((m) => m.id !== item.id)])} />
        <input
          type="search"
          placeholder="Search by file name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-[#2A1B2E]/15 bg-white px-3 py-2 text-sm sm:max-w-xs"
        />
        <span className="text-sm text-[#2A1B2E]/55">{items.length} photos</span>
      </div>
      {message && (
        <p className="mt-3 rounded-lg bg-white p-3 text-sm ring-1 ring-[#2A1B2E]/10" role="status">
          {message}
        </p>
      )}

      {shown.length === 0 ? (
        <p className="mt-6 rounded-[22px] border border-dashed border-[#2A1B2E]/15 bg-white/40 p-12 text-center text-sm text-[#2A1B2E]/55 backdrop-blur">
          {items.length ? "No photos match." : "No photos yet. Upload some to get started."}
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-[22px] border border-white/70 bg-white/65 shadow-[0_24px_60px_-40px_rgba(42,27,46,.5)] backdrop-blur-xl">
              <div className="aspect-[4/5] bg-[#E9DDF0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(m.url, 480)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium" title={m.name}>
                  {m.name}
                </p>
                <p className="text-xs text-[#2A1B2E]/55">
                  {m.width}×{m.height} · {kb(m.size)}
                </p>
                <div className="mt-2 flex gap-3 text-xs">
                  <button type="button" className="text-[#2A1B2E]/65 hover:text-[#2A1B2E]" onClick={() => copy(m.url)}>
                    Copy link
                  </button>
                  <a className="text-[#2A1B2E]/65 hover:text-[#2A1B2E]" href={m.url} target="_blank" rel="noreferrer">
                    Open
                  </a>
                  <button
                    type="button"
                    className="ml-auto text-red-700 hover:text-red-900 disabled:opacity-50"
                    disabled={busy === m.id}
                    onClick={() => remove(m)}
                  >
                    {busy === m.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
