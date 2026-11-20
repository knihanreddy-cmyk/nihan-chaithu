import { unstable_cache } from "next/cache";
import { collections, isDbConfigured } from "@/lib/db";
import { sanitizePage } from "./fields";
import { PAGES, type PageContentMap, type PageId } from "./registry";

export const CONTENT_TAG = "cms-content";

/** Read a page's saved content straight from MongoDB (no cache), merged over the defaults. */
export async function readContentFresh<K extends PageId>(page: K): Promise<PageContentMap[K]> {
  const { schema, defaults } = PAGES[page];
  if (!isDbConfigured()) return defaults;
  const { content } = await collections();
  const doc = await content.findOne({ _id: page });
  return sanitizePage(schema, doc?.data, defaults);
}

/**
 * Content for the public site. Cached, and refreshed when the admin saves.
 * If the database is missing or unreachable the built-in content is used, so the site never breaks.
 */
export async function getContent<K extends PageId>(page: K): Promise<PageContentMap[K]> {
  try {
    // Errors are thrown out of the cached function, so a failed read is never cached.
    return await unstable_cache(() => readContentFresh(page), ["cms-content", page], {
      tags: [CONTENT_TAG],
      revalidate: 3600,
    })();
  } catch (err) {
    console.error(`[cms] Could not load "${page}" content, using defaults:`, err);
    return PAGES[page].defaults;
  }
}
