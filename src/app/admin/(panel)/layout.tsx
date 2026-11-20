import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-session";
import { collections, isDbConfigured } from "@/lib/db";
import { isImageKitConfigured } from "@/lib/imagekit";
import AdminNav from "./AdminNav";

export const metadata: Metadata = { title: "Portfolio CMS", robots: { index: false } };

async function unreadCount() {
  if (!isDbConfigured()) return 0;
  try {
    return await (await collections()).enquiries.countDocuments({ read: false });
  } catch {
    return 0;
  }
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const unread = await unreadCount();
  const missing = [
    !isDbConfigured() && "MONGODB_URI (saving content and enquiries)",
    !isImageKitConfigured() && "IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY / IMAGEKIT_URL_ENDPOINT (photo uploads)",
  ].filter(Boolean) as string[];

  return (
    <div className="admin relative min-h-svh bg-[#F3EFF4] font-inter text-[#2A1B2E] md:flex">
      {/* Soft colour field, as on the homepage and the login */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#F4B6C8] opacity-50 blur-[120px]" />
        <div className="absolute -bottom-56 -right-40 h-[38rem] w-[38rem] rounded-full bg-[#A9D8D0] opacity-45 blur-[130px]" />
        <div className="absolute left-1/2 top-1/4 h-80 w-80 rounded-full bg-[#F7D9A8] opacity-30 blur-[110px]" />
      </div>

      <AdminNav unread={unread} />
      <div className="relative min-w-0 flex-1">
        {missing.length > 0 && (
          <div className="mx-4 mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 backdrop-blur md:mx-10 md:mt-6">
            <strong>Setup needed:</strong> add {missing.join(" and ")} to <code>.env</code> and restart the server.
          </div>
        )}
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
