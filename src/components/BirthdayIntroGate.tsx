"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const SEEN_KEY = "cc-birthday-intro-seen";
const FADE_MS = 700;

type Phase = "intro" | "leaving" | "done";

/**
 * Plays the birthday opening (public/intro/birthday.html, the "Runway
 * Countdown" effect) full-screen over the page, then fades it away when the
 * visitor presses "Enter your website". It plays once per browser session;
 * `?intro=1` forces it and `?intro=0` skips it.
 */
export default function BirthdayIntroGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("intro");
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage can be blocked (private mode); just play the intro.
    }
    if (param === "0" || (seen && param !== "1")) {
      // Already watched this session: reveal the page straight away.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on browser-only storage
      setPhase("done");
    }
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type !== "birthday-intro-done") return;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Ignore: the intro will simply play again next visit.
      }
      setPhase("leaving");
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      html.style.overflow = previous;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(() => setPhase("done"), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <>
      {/* Remount the page as the intro fades so its own entrance animation plays in view. */}
      <div key={phase === "intro" ? "behind" : "live"} inert={phase === "intro"}>
        {children}
      </div>

      {phase !== "done" && (
        <div
          className="fixed inset-0 z-[1000] bg-[#060606] transition-opacity ease-out"
          style={{ opacity: phase === "leaving" ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
        >
          <iframe
            ref={frameRef}
            src="/intro/birthday.html"
            title="Happy Birthday, Chaithrika"
            className="block h-full w-full border-0"
            allow="autoplay"
            onLoad={() => frameRef.current?.focus()}
          />
        </div>
      )}
    </>
  );
}
