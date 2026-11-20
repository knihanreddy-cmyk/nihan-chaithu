"use client";

import { useEffect, useRef, useState } from "react";
import { listMedia } from "../actions";
import { thumb, type MediaItem } from "../types";
import UploadButton from "./UploadButton";

/** Shared, lazily-loaded copy of the library so every image field doesn't refetch it. */
let cache: Promise<MediaItem[]> | null = null;
const loadLibrary = (refresh = false) => {
  if (!cache || refresh) cache = listMedia().catch((e) => {
    cache = null;
    throw e;
  });
  return cache;
};

export default function MediaPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (item: MediaItem) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      loadLibrary()
        .then(setItems)
        .catch((e) => setError(e instanceof Error ? e.message : "Could not load photos"));
    } else if (!open && d.open) d.close();
  }, [open]);

  const pick = (item: MediaItem) => {
    onPick(item);
    onClose();
  };

  const shown = (items ?? []).filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(960px,calc(100vw-24px))] max-h-[calc(100svh-24px)] rounded-2xl bg-white p-0 text-stone-900 shadow-xl backdrop:bg-stone-900/50"
    >
      <div className="flex max-h-[calc(100svh-24px)] flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-stone-200 p-4">
          <h2 className="mr-auto text-lg font-semibold">Choose a photo</h2>
          <input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-40 rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
          />
          <UploadButton
            multiple={false}
            label="Upload new"
            onUploaded={(item) => {
              loadLibrary(true);
              pick(item);
            }}
          />
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100">
            Close
          </button>
        </div>
        <div className="min-h-[240px] overflow-y-auto p-4">
          {error && <p className="text-sm text-red-700">{error}</p>}
          {!items && !error && <p className="text-sm text-stone-500">Loading photos…</p>}
          {items && shown.length === 0 && (
            <p className="text-sm text-stone-500">
              {items.length ? "No photos match." : "The library is empty. Upload a photo to use it here."}
            </p>
          )}
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {shown.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => pick(m)}
                  className="group block w-full overflow-hidden rounded-lg ring-1 ring-stone-200 hover:ring-2 hover:ring-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900"
                  title={m.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(m.url, 300)} alt={m.name} loading="lazy" className="aspect-square w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}
