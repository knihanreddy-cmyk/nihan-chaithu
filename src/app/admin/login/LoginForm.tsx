"use client";

import { useActionState, useState } from "react";
import { usePageBackground } from "@/components/designs/shared";
import { login } from "../actions";

const inputCls =
  "peer block w-full rounded-2xl border border-[#2A1B2E]/15 bg-white/80 px-4 pb-2.5 pt-6 text-[15px] text-[#2A1B2E] outline-none transition placeholder-transparent focus:border-[#D9577F] focus:bg-white focus:ring-4 focus:ring-[#D9577F]/15";
const labelCls =
  "pointer-events-none absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2A1B2E]/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-[#D9577F]";

export default function LoginForm({ next }: { next: string }) {
  usePageBackground("#F3EFF4");
  const [state, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-7 space-y-4">
      <input type="hidden" name="next" value={next} />

      <div className="relative">
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="Email"
          required
          autoFocus
          className={inputCls}
        />
        <label htmlFor="login-email" className={labelCls}>
          Email
        </label>
      </div>

      <div className="relative">
        <input
          id="login-password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Password"
          required
          className={`${inputCls} pr-16`}
        />
        <label htmlFor="login-password" className={labelCls}>
          Password
        </label>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-medium text-[#2A1B2E]/60 hover:bg-[#2A1B2E]/5 hover:text-[#2A1B2E]"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-2xl bg-[#D9577F]/10 px-4 py-3 text-sm text-[#9E2F52]" role="alert">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9577F]" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#2A1B2E] px-6 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_14px_30px_-12px_rgba(42,27,46,.7)] transition hover:bg-[#3B2741] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D9577F]/30 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
