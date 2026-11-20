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
    <div className="min-h-svh md:flex">
      <AdminNav unread={unread} />
      <div className="min-w-0 flex-1">
        {missing.length > 0 && (
          <div className="mx-4 mt-4 rounded-[14px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 md:mx-14 md:mt-8">
            <strong>Setup needed:</strong> add {missing.join(" and ")} to <code>.env</code> and restart the server.
          </div>
        )}
        <main className="mx-auto max-w-[1180px] px-4 pb-14 pt-6 sm:px-8 md:px-14 md:pt-8">{children}</main>
      </div>
    </div>
  );
}
