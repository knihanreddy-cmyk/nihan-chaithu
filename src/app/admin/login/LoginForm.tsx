"use client";

import { useActionState, useState } from "react";
import { usePageBackground } from "@/components/designs/shared";
import { login } from "../actions";

const inputCls =
  "mt-1.5 block h-[54px] w-full rounded-[14px] border border-[#CFC6BA] bg-[#FFFDF9] px-[18px] text-[15px] text-[#1E1B18] outline-none transition focus:border-[1.5px] focus:border-[#1E1B18] focus:shadow-[4px_4px_0_#E7C9D2]";
const labelCls = "block text-xs font-semibold tracking-[0.08em] text-[#5A534B]";

export default function LoginForm({ next }: { next: string }) {
  usePageBackground("#F5F0E8");
  const [state, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-8 flex flex-col gap-3.5">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <span className={labelCls}>Email</span>
        <input name="email" type="email" autoComplete="username" required autoFocus className={inputCls} />
      </label>

      <label className="relative block">
        <span className={labelCls}>Password</span>
        <input
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          required
          className={`${inputCls} pr-[70px]`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute bottom-[5px] right-1.5 h-11 rounded-[10px] px-3.5 text-[13px] font-medium text-[#5A534B] hover:bg-[#1E1B18]/5 hover:text-[#1E1B18]"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
        >
          {show ? "Hide" : "Show"}
        </button>
      </label>

      {state?.error && (
        <p className="rounded-[14px] border border-[#E7C9D2] bg-[#9C3F5C]/[.06] px-4 py-3 text-sm text-[#7A2E47]" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-3.5 flex h-[58px] items-center justify-center gap-3 rounded-[14px] bg-[#1E1B18] text-[15px] font-semibold text-[#F5F0E8] transition hover:bg-[#3A3530] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E7C9D2] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#F5F0E8]/30 border-t-[#F5F0E8]" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          <>
            Enter the studio
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5"
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
