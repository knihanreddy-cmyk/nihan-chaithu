import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { sanitizePage } from "@/lib/cms/fields";
import { isPageId, PAGES } from "@/lib/cms/registry";
import { collections, isDbConfigured } from "@/lib/db";
import ContentEditor from "../../../components/ContentEditor";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ page: string }> }) {
  await requireAdmin();
  const { page } = await params;
  if (!isPageId(page)) notFound();
  const { schema, defaults } = PAGES[page];

  let data: unknown = defaults;
  let savedAt: string | null = null;
  let error = "";
  if (isDbConfigured()) {
    try {
      const { content } = await collections();
      const doc = await content.findOne({ _id: page });
      data = sanitizePage(schema, doc?.data, defaults);
      savedAt = doc?.updatedAt?.toISOString() ?? null;
    } catch (err) {
      error = err instanceof Error ? err.message : "Could not reach the database";
    }
  }

  return (
    <>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">Database error: {error}</p>}
      <ContentEditor
        key={savedAt ?? "defaults"}
        schema={schema}
        initial={data as Record<string, unknown>}
        canSave={isDbConfigured() && !error}
        savedAt={savedAt}
      />
    </>
  );
}
