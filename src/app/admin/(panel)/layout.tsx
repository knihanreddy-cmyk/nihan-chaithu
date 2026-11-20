import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-session";
import { isDbConfigured } from "@/lib/db";
import { isImageKitConfigured } from "@/lib/imagekit";
import AdminNav from "./AdminNav";

export const metadata: Metadata = { title: "Portfolio CMS", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const missing = [
    !isDbConfigured() && "MONGODB_URI (saving content and enquiries)",
    !isImageKitConfigured() && "IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY / IMAGEKIT_URL_ENDPOINT (photo uploads)",
  ].filter(Boolean) as string[];

  return (
    <div className="admin min-h-svh bg-stone-100 font-inter text-stone-900 md:flex">
      <AdminNav />
      <div className="min-w-0 flex-1">
        {missing.length > 0 && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 md:px-8">
            <strong>Setup needed:</strong> add {missing.join(" and ")} to <code>.env.local</code> and restart the server.
          </div>
        )}
        <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
