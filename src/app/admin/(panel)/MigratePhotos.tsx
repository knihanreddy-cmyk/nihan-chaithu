"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { migrateLocalImages } from "../actions";

export default function MigratePhotos({ total }: { total: number }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(total);
  const [errors, setErrors] = useState<string[]>([]);

  const run = async () => {
    setRunning(true);
    setErrors([]);
    try {
      let remaining = total;
      let stalled = 0;
      while (remaining > 0 && stalled < 2) {
        const res = await migrateLocalImages();
        setErrors((e) => [...e, ...res.errors]);
        stalled = res.moved === 0 ? stalled + 1 : 0;
        remaining = res.remaining;
        setLeft(remaining);
      }
    } catch (err) {
      setErrors((e) => [...e, err instanceof Error ? err.message : "Failed"]);
    } finally {
      setRunning(false);
      router.refresh();
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={run}
        disabled={running}
        className="rounded-full bg-[#2A1B2E] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(42,27,46,.8)] hover:bg-[#3B2741] disabled:opacity-60"
      >
        {running ? `Moving… ${total - left} of ${total}` : "Move photos to ImageKit"}
      </button>
      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-red-700">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
