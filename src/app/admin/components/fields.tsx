"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Crosshair, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useId, useState, type MouseEvent, type ReactNode } from "react";
import { blankObject, RICH_HELP, type Field, type Img } from "@/lib/cms/fields";
import { rich } from "@/lib/cms/render";
import { thumb } from "../types";
import MediaPicker from "./MediaPicker";

type Obj = Record<string, unknown>;
type ListField = Extract<Field, { type: "list" }>;

/* ------------------------------------------------------------ tokens */

const inputBase =
  "block w-full rounded-[12px] border border-[#DDD3C6] bg-[#FFFDF9] px-4 text-[15px] text-[#1E1B18] outline-none transition placeholder:text-[#A79E92] hover:border-[#C9BEAF] focus:border-[#1E1B18] focus:shadow-[3px_3px_0_#E7C9D2]";
const inputCls = `${inputBase} h-12`;
const areaCls = `${inputBase} min-h-24 py-3 leading-relaxed [field-sizing:content] resize-y`;
const iconBtn =
  "grid h-9 w-9 place-items-center rounded-[10px] text-[#6B635A] transition hover:bg-[#1E1B18]/6 hover:text-[#1E1B18] disabled:pointer-events-none disabled:opacity-25";
const dangerBtn =
  "grid h-9 w-9 place-items-center rounded-[10px] text-[#6B635A] transition hover:bg-[#9C3F5C]/10 hover:text-[#9C3F5C]";
const addBtn =
  "flex h-12 w-full items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#C9BEAF] text-sm font-medium text-[#5A534B] transition hover:border-[#1E1B18] hover:bg-[#FFFDF9] hover:text-[#1E1B18]";

/** Fields that read well side by side; everything else spans the full row. */
const isNarrow = (f: Field) =>
  (f.type === "text" && f.help !== RICH_HELP) || f.type === "url" || f.type === "select" || f.type === "boolean";

/** Tape and other colour choices get a swatch in the segmented control. */
const SWATCH: Record<string, string> = { Cream: "#EFE3C8", Green: "#9DBFA6", Blue: "#A9C2DA" };

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = list.slice();
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

const plainTitle = (t: unknown) => (typeof t === "string" ? t.replace(/\*/g, "").trim() : "");

/* ------------------------------------------------------------- shell */

function FieldShell({
  field,
  htmlFor,
  aside,
  children,
}: {
  field: Field;
  htmlFor?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const showHelp = field.help && field.help !== RICH_HELP;
  return (
    <div className={isNarrow(field) ? "" : "md:col-span-2"}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-[13px] font-semibold tracking-[0.01em]">
            {field.label}
          </label>
        ) : (
          <span className="text-[13px] font-semibold tracking-[0.01em]">{field.label}</span>
        )}
        {aside}
      </div>
      {children}
      {showHelp && <p className="mt-2 text-[12.5px] leading-relaxed text-[#6B635A]">{field.help}</p>}
    </div>
  );
}

/** Live preview of *accent* / **bold** markup, in the site's italic rose. */
function RichPreview({ text }: { text: string }) {
  if (!/\*/.test(text)) {
    return (
      <p className="mt-2 text-[12.5px] text-[#6B635A]">
        Tip: wrap words in <span className="font-mono text-[#1E1B18]">*stars*</span> for the{" "}
        <i className="font-fraunces text-[#9C3F5C]">accent</i> style, or{" "}
        <span className="font-mono text-[#1E1B18]">**double**</span> for <b>bold</b>.
      </p>
    );
  }
  return (
    <p className="mt-2 flex items-baseline gap-2 text-[12.5px] text-[#6B635A]">
      <span className="shrink-0 font-semibold tracking-[0.12em] text-[#9C3F5C]">PREVIEW</span>
      <span className="truncate font-fraunces text-[17px] text-[#1E1B18]">
        {rich(text, (c, k) => (
          <i key={k} className="text-[#9C3F5C]">
            {c}
          </i>
        ))}
      </span>
    </p>
  );
}

/* -------------------------------------------------------- text-like */

function TextField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const multiline = field.type === "textarea";
  return (
    <FieldShell field={field} htmlFor={id}>
      {multiline ? (
        <textarea id={id} className={areaCls} rows={(field as { rows?: number }).rows ?? 3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={id}
          className={inputCls}
          type={field.type === "url" ? "url" : "text"}
          placeholder={field.type === "url" ? "https://" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.help === RICH_HELP && <RichPreview text={value} />}
    </FieldShell>
  );
}

function SelectField({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "select" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  if (field.options.length <= 4) {
    return (
      <FieldShell field={field}>
        <div role="radiogroup" aria-label={field.label} className="inline-flex flex-wrap gap-1 rounded-[14px] border border-[#DDD3C6] bg-[#FFFDF9] p-1">
          {field.options.map((o) => {
            const on = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onChange(o.value)}
                className={`inline-flex h-10 items-center gap-2 rounded-[10px] px-3.5 text-sm transition ${
                  on ? "bg-[#1E1B18] font-semibold text-[#F5F0E8]" : "text-[#5A534B] hover:bg-[#1E1B18]/5 hover:text-[#1E1B18]"
                }`}
              >
                {SWATCH[o.label] && (
                  <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: SWATCH[o.label] }} />
                )}
                {o.label}
              </button>
            );
          })}
        </div>
      </FieldShell>
    );
  }
  return (
    <FieldShell field={field} htmlFor={id}>
      <select id={id} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function Toggle({ field, value, onChange }: { field: Field; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center self-end">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className="group flex h-12 items-center gap-3 rounded-[12px] pr-2 text-left"
      >
        <span className={`relative h-7 w-12 rounded-full transition ${value ? "bg-[#1E1B18]" : "bg-[#DDD3C6]"}`}>
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-[#FFFDF9] shadow transition-all ${value ? "left-6" : "left-1"}`}
          />
        </span>
        <span className="text-[13px] font-semibold">{field.label}</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------- image */

function parsePos(p?: string): [number, number] {
  const m = /(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/.exec(p ?? "");
  return m ? [Number(m[1]), Number(m[2])] : [50, 50];
}

function ImageField({ field, value, onChange }: { field: Field; value: Img; onChange: (v: Img) => void }) {
  const [open, setOpen] = useState(false);
  const altId = useId();
  const [px, py] = parsePos(value.position);
  const hasFocus = Boolean(value.position);

  const setFocus = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
    onChange({ ...value, position: `${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%` });
  };

  return (
    <FieldShell field={field}>
      <div className="flex flex-wrap gap-5 rounded-[16px] border border-[#DDD3C6] bg-[#FFFDF9] p-4">
        <div className="w-40 shrink-0">
          <button
            type="button"
            onClick={setFocus}
            className="group relative block aspect-[4/5] w-full cursor-crosshair overflow-hidden rounded-[12px] bg-[#EDE5D8]"
            aria-label="Click the photo to set its focus point"
            title="Click to set the focus point"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb(value.src, 360)}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: value.position || "50% 50%" }}
            />
            <span
              aria-hidden="true"
              className={`absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.35)] transition ${
                hasFocus ? "opacity-100" : "opacity-0 group-hover:opacity-70"
              }`}
              style={{ left: `${px}%`, top: `${py}%` }}
            />
          </button>
          <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-[#6B635A]">
            <Crosshair className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
            Click photo to set focus
          </p>
        </div>

        <div className="flex min-w-[220px] flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-[11px] bg-[#1E1B18] px-4 text-sm font-semibold text-[#F5F0E8] transition hover:bg-[#3A3530]"
            >
              <ImagePlus className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              Replace photo
            </button>
            <span className="rounded-full border border-[#DDD3C6] px-2.5 py-1 text-[11.5px] font-medium text-[#5A534B]">
              {value.src.startsWith("/") ? "Built-in" : "ImageKit"} · {value.width}×{value.height}
            </span>
          </div>

          <div>
            <label htmlFor={altId} className="mb-1.5 block text-[12.5px] font-semibold text-[#5A534B]">
              Description <span className="font-normal text-[#6B635A]">— read aloud by screen readers and used by Google</span>
            </label>
            <textarea
              id={altId}
              className={`${inputBase} min-h-12 py-2.5 text-sm [field-sizing:content]`}
              rows={1}
              value={value.alt}
              placeholder="Describe the photo in a sentence"
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[#6B635A]">
            <span className="font-semibold text-[#5A534B]">Focus point</span>
            <span className="rounded-md bg-[#F5F0E8] px-2 py-0.5 font-mono text-[12px] text-[#1E1B18]">
              {value.position || "centre"}
            </span>
            {hasFocus && (
              <button
                type="button"
                onClick={() => onChange({ ...value, position: "" })}
                className="font-medium text-[#9C3F5C] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onPick={(m) => onChange({ ...value, src: m.url, width: m.width, height: m.height })}
      />
    </FieldShell>
  );
}

/* ----------------------------------------------------------- strings */

function StringsField({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "strings" }>;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const label = field.itemLabel ?? "Item";
  const long = value.some((s) => s.length > 60) || label === "Paragraph";
  return (
    <FieldShell field={field} aside={<span className="text-xs text-[#6B635A]">{value.length}</span>}>
      <ol className="flex flex-col gap-2">
        {value.map((s, i) => (
          <li key={i} className="group flex items-start gap-3">
            <span className="mt-3 w-6 shrink-0 text-right font-fraunces text-[15px] text-[#9C3F5C]">{String(i + 1).padStart(2, "0")}</span>
            {long ? (
              <textarea
                className={`${areaCls} min-h-20`}
                rows={2}
                value={s}
                aria-label={`${label} ${i + 1}`}
                onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
              />
            ) : (
              <input
                className={inputCls}
                value={s}
                aria-label={`${label} ${i + 1}`}
                onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
              />
            )}
            <div className="mt-1.5 flex shrink-0 opacity-60 transition group-focus-within:opacity-100 group-hover:opacity-100">
              <button type="button" className={iconBtn} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label={`Move ${label.toLowerCase()} ${i + 1} up`}>
                <ArrowUp className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                className={iconBtn}
                disabled={i === value.length - 1}
                onClick={() => onChange(move(value, i, i + 1))}
                aria-label={`Move ${label.toLowerCase()} ${i + 1} down`}
              >
                <ArrowDown className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <button type="button" className={dangerBtn} onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}>
                <Trash2 className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className={`${addBtn} mt-2.5`} onClick={() => onChange([...value, ""])}>
        <Plus className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        Add {label.toLowerCase()}
      </button>
    </FieldShell>
  );
}

/* -------------------------------------------------------------- lists */

const imageKeyOf = (fields: Field[]) => fields.find((f) => f.type === "image")?.key;
const isSimpleList = (f: ListField) => f.fields.length <= 3 && f.fields.every(isNarrow);

/** Short text-only lists (e.g. disciplines): edited inline as rows. */
function InlineList({ field, value, onChange }: { field: ListField; value: Obj[]; onChange: (v: Obj[]) => void }) {
  const label = field.itemLabel ?? "Item";
  return (
    <FieldShell field={field} aside={<span className="text-xs text-[#6B635A]">{value.length}</span>}>
      <div className="overflow-hidden rounded-[14px] border border-[#DDD3C6] bg-[#FFFDF9]">
        <div
          className="hidden gap-3 border-b border-[#DDD3C6] bg-[#F5F0E8]/60 px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-[#6B635A] sm:grid"
          style={{ gridTemplateColumns: `28px repeat(${field.fields.length}, minmax(0,1fr)) 108px` }}
        >
          <span />
          {field.fields.map((f) => (
            <span key={f.key}>{f.label.toUpperCase()}</span>
          ))}
          <span />
        </div>
        {value.map((item, i) => (
          <div key={i} className="group border-b border-[#EFE8DD] px-4 py-2.5 last:border-b-0">
            <div
              className="flex flex-col gap-2 sm:grid sm:items-center sm:gap-3"
              style={{ gridTemplateColumns: `28px repeat(${field.fields.length}, minmax(0,1fr)) 108px` }}
            >
              <span className="font-fraunces text-[15px] text-[#9C3F5C]">{String(i + 1).padStart(2, "0")}</span>
              {field.fields.map((f) => (
                <input
                  key={f.key}
                  className={`${inputBase} h-11 text-sm`}
                  aria-label={`${label} ${i + 1} ${f.label}`}
                  placeholder={f.label}
                  value={String(item[f.key] ?? "")}
                  onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))}
                />
              ))}
              <div className="flex justify-end opacity-60 transition group-focus-within:opacity-100 group-hover:opacity-100">
                <button type="button" className={iconBtn} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label={`Move ${label.toLowerCase()} ${i + 1} up`}>
                  <ArrowUp className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  disabled={i === value.length - 1}
                  onClick={() => onChange(move(value, i, i + 1))}
                  aria-label={`Move ${label.toLowerCase()} ${i + 1} down`}
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={1.8} />
                </button>
                {!field.fixed && (
                  <button type="button" className={dangerBtn} onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}>
                    <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!field.fixed && (
        <button type="button" className={`${addBtn} mt-2.5`} onClick={() => onChange([...value, blankObject(field.fields)])}>
          <Plus className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          Add {label.toLowerCase()}
        </button>
      )}
    </FieldShell>
  );
}

/** Lists with photos (gallery, looks, timeline): a grid of photo cards, the chosen one edited below. */
function CardList({ field, value, onChange }: { field: ListField; value: Obj[]; onChange: (v: Obj[]) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const label = field.itemLabel ?? "Item";
  const imgKey = imageKeyOf(field.fields);
  const titleOf = (item: Obj, i: number) =>
    plainTitle(field.titleKey ? item[field.titleKey] : "") || `${label} ${i + 1}`;
  const current = sel !== null && sel < value.length ? sel : null;

  const moveTo = (to: number) => {
    if (current === null) return;
    onChange(move(value, current, to));
    setSel(Math.max(0, Math.min(value.length - 1, to)));
  };

  return (
    <FieldShell
      field={field}
      aside={
        <span className="text-xs text-[#6B635A]">
          {value.length} {value.length === 1 ? label.toLowerCase() : `${label.toLowerCase()}s`}
        </span>
      }
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {value.map((item, i) => {
          const img = imgKey ? (item[imgKey] as Img | undefined) : undefined;
          const on = current === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setSel(on ? null : i)}
                aria-expanded={on}
                className={`group block w-full overflow-hidden rounded-[14px] border bg-[#FFFDF9] text-left transition ${
                  on
                    ? "border-[#1E1B18] shadow-[4px_4px_0_#E7C9D2]"
                    : "border-[#DDD3C6] hover:-translate-y-0.5 hover:border-[#C9BEAF] hover:shadow-[0_14px_30px_-20px_rgba(30,27,24,.5)]"
                }`}
              >
                <span className="relative block aspect-[4/5] overflow-hidden bg-[#EDE5D8]">
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb(img.src, 320)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      style={{ objectPosition: img.position || "50% 25%" }}
                    />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-[#FFFDF9]/90 px-2 py-0.5 font-fraunces text-[12px] text-[#9C3F5C] backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="block truncate px-3 py-2.5 text-[13px] font-semibold">{titleOf(item, i)}</span>
              </button>
            </li>
          );
        })}
        {!field.fixed && (
          <li>
            <button
              type="button"
              onClick={() => {
                onChange([...value, blankObject(field.fields)]);
                setSel(value.length);
              }}
              className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#C9BEAF] text-sm font-medium text-[#5A534B] transition hover:border-[#1E1B18] hover:bg-[#FFFDF9] hover:text-[#1E1B18]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1E1B18]/5">
                <Plus className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              Add {label.toLowerCase()}
            </button>
          </li>
        )}
      </ul>

      {current !== null && (
        <div className="mt-4 rounded-[16px] border border-[#1E1B18] bg-[#F5F0E8]/50 p-5">
          <div className="mb-5 flex items-center gap-2 border-b border-[#DDD3C6] pb-4">
            <span className="font-fraunces text-[15px] text-[#9C3F5C]">{String(current + 1).padStart(2, "0")}</span>
            <h4 className="mr-auto min-w-0 truncate font-fraunces text-[22px] leading-tight">{titleOf(value[current], current)}</h4>
            <div className="flex shrink-0">
            <button type="button" className={iconBtn} disabled={current === 0} onClick={() => moveTo(current - 1)} aria-label="Move earlier">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button type="button" className={iconBtn} disabled={current === value.length - 1} onClick={() => moveTo(current + 1)} aria-label="Move later">
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </button>
            {!field.fixed && (
              <button
                type="button"
                className={dangerBtn}
                onClick={() => {
                  if (!confirm(`Remove "${titleOf(value[current], current)}"?`)) return;
                  onChange(value.filter((_, j) => j !== current));
                  setSel(null);
                }}
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.8} />
              </button>
            )}
            <button type="button" className={iconBtn} onClick={() => setSel(null)} aria-label="Close">
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
            </div>
          </div>
          <FieldGrid fields={field.fields} value={value[current]} onChange={(v) => onChange(value.map((x, j) => (j === current ? v : x)))} />
        </div>
      )}
    </FieldShell>
  );
}

/* ------------------------------------------------------------ render */

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "text":
    case "url":
    case "textarea":
      return <TextField field={field} value={String(value ?? "")} onChange={onChange} />;
    case "boolean":
      return <Toggle field={field} value={Boolean(value)} onChange={onChange} />;
    case "select":
      return <SelectField field={field} value={String(value ?? "")} onChange={onChange} />;
    case "image":
      return <ImageField field={field} value={value as Img} onChange={onChange} />;
    case "strings":
      return <StringsField field={field} value={(value as string[]) ?? []} onChange={onChange} />;
    case "list": {
      const items = (value as Obj[]) ?? [];
      return isSimpleList(field) ? (
        <InlineList field={field} value={items} onChange={onChange} />
      ) : (
        <CardList field={field} value={items} onChange={onChange} />
      );
    }
    case "group":
      return (
        <section className="md:col-span-2 rounded-[16px] border border-[#DDD3C6] bg-[#F5F0E8]/40 p-5">
          <h4 className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-[#9C3F5C]">{field.label.toUpperCase()}</h4>
          <FieldGrid fields={field.fields} value={(value as Obj) ?? {}} onChange={onChange} />
        </section>
      );
  }
}

/** A two-column grid on wide screens: short fields pair up, long ones take the row. */
export function FieldGrid({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </div>
  );
}
