import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";
import { isAuthConfigured } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in — Portfolio CMS", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <div className="admin min-h-svh bg-stone-100 font-inter text-stone-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Chaithrika &amp; Nihan</p>
        <h1 className="mt-2 text-2xl font-semibold">Portfolio CMS</h1>
        <p className="mt-1 text-sm text-stone-500">Sign in to edit the pages, photos and enquiries.</p>
        {!isAuthConfigured() && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
            Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> in{" "}
            <code>.env</code>, then restart the server.
          </p>
        )}
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
