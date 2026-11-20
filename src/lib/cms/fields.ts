/**
 * A tiny schema language for CMS content. The same schema drives the admin form
 * (what fields to show) and the server-side sanitiser (what is allowed to be saved).
 */

/** A photo used on the site: a local /public path or an ImageKit URL. */
export type Img = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Optional CSS object-position, e.g. "50% 20%", to keep the subject in a cropped frame. */
  position?: string;
};

type Base = { key: string; label: string; help?: string };

export type Field =
  | (Base & { type: "text" })
  | (Base & { type: "textarea"; rows?: number })
  | (Base & { type: "url" })
  | (Base & { type: "image" })
  | (Base & { type: "boolean" })
  | (Base & { type: "select"; options: { value: string; label: string }[] })
  | (Base & { type: "strings"; itemLabel?: string })
  | (Base & { type: "group"; fields: Field[] })
  | (Base & {
      type: "list";
      fields: Field[];
      itemLabel?: string;
      /** Field used as the item's title in the collapsed list. */
      titleKey?: string;
      /** The layout has a fixed number of slots: items can be edited and reordered, not added or removed. */
      fixed?: boolean;
    });

/** One editable page: its sections are top-level groups. */
export type PageSchema = {
  id: string;
  title: string;
  path: string;
  sections: (Base & { type: "group"; fields: Field[] })[];
};

/** Rich text helper syntax shown in the admin. */
export const RICH_HELP = "Wrap words in *stars* for the accent style, **double stars** for bold.";

const MAX_TEXT = 5000;

function str(v: unknown, fallback: string): string {
  if (typeof v !== "string") return fallback;
  return v.slice(0, MAX_TEXT);
}

function isSafeSrc(src: string) {
  return (src.startsWith("/") && !src.startsWith("//")) || src.startsWith("https://");
}

function img(v: unknown, fallback: Img): Img {
  if (!v || typeof v !== "object") return fallback;
  const o = v as Record<string, unknown>;
  const src = typeof o.src === "string" && isSafeSrc(o.src) ? o.src : fallback.src;
  const usesFallbackSrc = src === fallback.src;
  const dim = (d: unknown, f: number) => {
    const n = typeof d === "number" ? d : Number(d);
    return Number.isFinite(n) && n > 0 && n < 100000 ? Math.round(n) : f;
  };
  const out: Img = {
    src,
    width: dim(o.width, usesFallbackSrc ? fallback.width : 1200),
    height: dim(o.height, usesFallbackSrc ? fallback.height : 1600),
    alt: str(o.alt, fallback.alt),
  };
  const position = str(o.position, fallback.position ?? "").trim();
  if (position && /^[\w\s.%-]{1,40}$/.test(position)) out.position = position;
  return out;
}

const EMPTY_IMG: Img = { src: "/images/acting/placeholder-portrait.jpg", width: 1200, height: 1600, alt: "" };

/** A blank value for a field, used when adding a new list item. */
export function blankValue(field: Field): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
    case "url":
      return "";
    case "image":
      return { ...EMPTY_IMG };
    case "boolean":
      return false;
    case "select":
      return field.options[0]?.value ?? "";
    case "strings":
      return [];
    case "group":
      return blankObject(field.fields);
    case "list":
      return [];
  }
}

export function blankObject(fields: Field[]): Record<string, unknown> {
  return Object.fromEntries(fields.map((f) => [f.key, blankValue(f)]));
}

/**
 * Coerce untrusted input into the shape the schema describes. Unknown keys are dropped;
 * missing or invalid values fall back to `fallback` (normally the built-in default content).
 */
export function sanitizeField(field: Field, v: unknown, fallback: unknown): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
      return str(v, typeof fallback === "string" ? fallback : "");
    case "url": {
      const s = str(v, typeof fallback === "string" ? fallback : "").trim();
      return s === "" || /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(s) ? s : "";
    }
    case "image":
      return img(v, (fallback as Img) ?? EMPTY_IMG);
    case "boolean":
      return typeof v === "boolean" ? v : Boolean(fallback);
    case "select": {
      const ok = field.options.some((o) => o.value === v);
      return ok ? v : (fallback ?? field.options[0]?.value ?? "");
    }
    case "strings": {
      if (!Array.isArray(v)) return Array.isArray(fallback) ? fallback : [];
      return v.filter((s): s is string => typeof s === "string").map((s) => s.slice(0, MAX_TEXT)).slice(0, 200);
    }
    case "group":
      return sanitizeObject(field.fields, v, fallback);
    case "list": {
      const fb = Array.isArray(fallback) ? fallback : [];
      if (!Array.isArray(v)) return fb;
      let items = v.slice(0, 200);
      if (field.fixed) items = fb.map((d, i) => (i < items.length ? items[i] : d));
      return items.map((item, i) => sanitizeObject(field.fields, item, fb[i] ?? blankObject(field.fields)));
    }
  }
}

export function sanitizeObject(fields: Field[], v: unknown, fallback: unknown): Record<string, unknown> {
  const o = v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  const fb = fallback && typeof fallback === "object" ? (fallback as Record<string, unknown>) : {};
  return Object.fromEntries(fields.map((f) => [f.key, sanitizeField(f, o[f.key], fb[f.key])]));
}

export function sanitizePage<T>(schema: PageSchema, v: unknown, fallback: T): T {
  return sanitizeObject(schema.sections, v, fallback) as T;
}

/** Every image src referenced anywhere in a content value. */
export function collectImageSrcs(v: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(v)) v.forEach((x) => collectImageSrcs(x, out));
  else if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.src === "string" && typeof o.width === "number") out.add(o.src);
    Object.values(o).forEach((x) => collectImageSrcs(x, out));
  }
  return out;
}

/** Return a copy of `v` with every image whose src is in `map` pointed at the new src. */
export function replaceImageSrcs<T>(v: T, map: Map<string, string>): T {
  if (Array.isArray(v)) return v.map((x) => replaceImageSrcs(x, map)) as T;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const next = Object.fromEntries(Object.entries(o).map(([k, x]) => [k, replaceImageSrcs(x, map)]));
    if (typeof o.src === "string" && typeof o.width === "number" && map.has(o.src)) next.src = map.get(o.src);
    return next as T;
  }
  return v;
}
