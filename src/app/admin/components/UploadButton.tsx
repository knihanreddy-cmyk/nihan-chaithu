"use client";

import { useId, useRef, useState } from "react";
import type { MediaItem } from "../types";
import { uploadPhoto } from "./upload";

export default function UploadButton({
  onUploaded,
  multiple = true,
  label = "Upload photos",
}: {
  onUploaded: (item: MediaItem) => void;
  multiple?: boolean;
  label?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    setErrors([]);
    setProgress({ done: 0, total: list.length });
    for (const [i, file] of list.entries()) {
      try {
        onUploaded(await uploadPhoto(file));
      } catch (err) {
        setErrors((e) => [...e, err instanceof Error ? err.message : `${file.name} failed`]);
      }
      setProgress({ done: i + 1, total: list.length });
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        id={id}
        onChange={(e) => onFiles(e.target.files)}
        disabled={!!progress}
      />
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#2A1B2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3B2741] aria-disabled:opacity-60"
        aria-disabled={!!progress}
      >
        {progress ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…` : label}
      </label>
      {errors.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-red-700" role="alert">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
