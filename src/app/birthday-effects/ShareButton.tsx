"use client";

import { useState } from "react";

const SHARE_TEXT =
  "Help us pick Chaithrika's birthday opening! Watch the 10 effects and tell us which number you like best.";

export default function ShareButton() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Chaithrika's birthday opening", text: SHARE_TEXT, url });
        return;
      } catch (error) {
        // The viewer closed the share sheet; nothing else to do.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT}\n${url}`);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 2600);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={share}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#3b1a26] px-6 font-inter text-[13px] font-medium tracking-[0.04em] text-[#fff6f1] transition hover:bg-[#5a2638] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9576f]"
      >
        Share this page
        <span aria-hidden="true">↗</span>
      </button>
      <p aria-live="polite" className="font-inter text-[13px] text-[#7a5560]">
        {status === "copied" && "Link copied — paste it into WhatsApp or a message."}
        {status === "failed" && "Copy the address from your browser bar to share it."}
      </p>
    </div>
  );
}
