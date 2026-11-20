"use client";

import { useState, type ReactNode } from "react";
import { blankObject, type Field, type Img } from "@/lib/cms/fields";
import { thumb } from "../types";
import MediaPicker from "./MediaPicker";

type Obj = Record<string, unknown>;

const inputCls =
  "mt-1 block w-full rounded-lg border border-[#1E1B18]/15 bg-[#FFFDF9] px-3 py-2 text-sm outline-none focus:border-[#9C3F5C] focus:ring-2 focus:ring-[#9C3F5C]/15";
const smallBtn = "rounded-md px-2 py-1 text-xs font-medium text-[#1E1B18]/65 hover:bg-[#1E1B18]/5 hover:text-[#1E1B18] disabled:opacity-30";

function Label({ field, children }: { field: Field; children?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm font-medium">{field.label}</span>
      {children}
    </div>
  );
}

function Help({ text }: { text?: string }) {
  return text ? <p className="mt-1 text-xs text-[#1E1B18]/55">{text}</p> : null;
}

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = list.slice();
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

/* ------------------------------------------------------------- image */

function ImageField({ field, value, onChange }: { field: Field; value: Img; onChange: (v: Img) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Label field={field} />
      <div className="mt-1 flex gap-4 rounded-lg border border-[#1E1B18]/10 bg-[#F5F0E8]/60 p-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-28 w-24 shrink-0 overflow-hidden rounded-md bg-[#EDE5D8] ring-1 ring-[#1E1B18]/10 hover:ring-2 hover:ring-[#9C3F5C]"
          aria-label={`Change ${field.label}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb(value.src, 240)}
            alt=""
            className="h-full w-full object-cover"
            style={value.position ? { objectPosition: value.position } : undefined}
          />
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-[12px] bg-[#FFFDF9] px-3.5 py-1.5 text-sm font-medium ring-1 ring-[#1E1B18]/15 hover:ring-[#9C3F5C]"
            >
              Change photo
            </button>
            <span className="truncate text-xs text-[#1E1B18]/55" title={value.src}>
              {value.src.startsWith("/") ? "Built-in photo" : "ImageKit"} · {value.width}×{value.height}
            </span>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-[#1E1B18]/65">Description (alt text, for screen readers and Google)</span>
            <input className={inputCls} value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-[#1E1B18]/65">Focus point (optional, e.g. &quot;50% 20%&quot; keeps the top in view)</span>
            <input
              className={inputCls}
              value={value.position ?? ""}
              placeholder="center"
              onChange={(e) => onChange({ ...value, position: e.target.value })}
            />
          </label>
        </div>
      </div>
      <Help text={field.help} />
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onPick={(m) => onChange({ ...value, src: m.url, width: m.width, height: m.height })}
      />
    </div>
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
  const long = value.some((s) => s.length > 60);
  return (
    <div>
      <Label field={field} />
      <Help text={field.help} />
      <ol className="mt-2 space-y-2">
        {value.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-2.5 w-5 shrink-0 text-right text-xs text-[#1E1B18]/40">{i + 1}</span>
            {long ? (
              <textarea
                className={`${inputCls} mt-0`}
                rows={3}
                value={s}
                aria-label={`${field.itemLabel ?? "Item"} ${i + 1}`}
                onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
              />
            ) : (
              <input
                className={`${inputCls} mt-0`}
                value={s}
                aria-label={`${field.itemLabel ?? "Item"} ${i + 1}`}
                onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
              />
            )}
            <div className="mt-1 flex shrink-0">
              <button type="button" className={smallBtn} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                className={smallBtn}
                disabled={i === value.length - 1}
                onClick={() => onChange(move(value, i, i + 1))}
                aria-label="Move down"
              >
                ↓
              </button>
              <button type="button" className={`${smallBtn} text-red-700`} onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove">
                ✕
              </button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="mt-2 text-sm font-medium text-[#1E1B18]/80 hover:text-[#1E1B18]" onClick={() => onChange([...value, ""])}>
        + Add {(field.itemLabel ?? "item").toLowerCase()}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------- list */

function ListField({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Obj[];
  onChange: (v: Obj[]) => void;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const titleOf = (item: Obj, i: number) => {
    const t = field.titleKey ? item[field.titleKey] : "";
    return typeof t === "string" && t.trim() ? t.replace(/\*/g, "") : `${field.itemLabel ?? "Item"} ${i + 1}`;
  };
  const imgOf = (item: Obj) => {
    const img = Object.values(item).find((v): v is Img => !!v && typeof v === "object" && "src" in (v as Obj));
    return img?.src;
  };

  return (
    <div>
      <Label field={field}>
        <span className="text-xs text-[#1E1B18]/55">{value.length} items</span>
      </Label>
      <Help text={field.help} />
      <ol className="mt-2 divide-y divide-[#1E1B18]/10 overflow-hidden rounded-[14px] border border-[#DDD3C6] bg-[#FFFDF9]">
        {value.map((item, i) => {
          const isOpen = openIdx === i;
          const src = imgOf(item);
          return (
            <li key={i}>
              <div className="flex items-center gap-3 px-3 py-2">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                >
                  <span className="w-5 shrink-0 text-right text-xs text-[#1E1B18]/40">{i + 1}</span>
                  {src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb(src, 120)} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                  )}
                  <span className="truncate text-sm font-medium">{titleOf(item, i)}</span>
                  <span className="ml-auto text-xs text-[#1E1B18]/40">{isOpen ? "Close" : "Edit"}</span>
                </button>
                <div className="flex shrink-0">
                  <button
                    type="button"
                    className={smallBtn}
                    disabled={i === 0}
                    onClick={() => {
                      onChange(move(value, i, i - 1));
                      setOpenIdx(null);
                    }}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={smallBtn}
                    disabled={i === value.length - 1}
                    onClick={() => {
                      onChange(move(value, i, i + 1));
                      setOpenIdx(null);
                    }}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  {!field.fixed && (
                    <button
                      type="button"
                      className={`${smallBtn} text-red-700`}
                      onClick={() => {
                        if (!confirm(`Remove "${titleOf(item, i)}"?`)) return;
                        onChange(value.filter((_, j) => j !== i));
                        setOpenIdx(null);
                      }}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {isOpen && (
                <div className="space-y-4 border-t border-[#1E1B18]/5 bg-[#F5F0E8]/50 p-4">
                  <Fields fields={field.fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {!field.fixed && (
        <button
          type="button"
          className="mt-2 text-sm font-medium text-[#1E1B18]/80 hover:text-[#1E1B18]"
          onClick={() => {
            onChange([...value, blankObject(field.fields)]);
            setOpenIdx(value.length);
          }}
        >
          + Add {(field.itemLabel ?? "item").toLowerCase()}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ render */

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "text":
    case "url":
      return (
        <label className="block">
          <Label field={field} />
          <input
            className={inputCls}
            type={field.type === "url" ? "url" : "text"}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
          <Help text={field.help} />
        </label>
      );
    case "textarea":
      return (
        <label className="block">
          <Label field={field} />
          <textarea className={inputCls} rows={field.rows ?? 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          <Help text={field.help} />
        </label>
      );
    case "boolean":
      return (
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 accent-[#9C3F5C]" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span className="text-sm font-medium">{field.label}</span>
        </label>
      );
    case "select":
      return (
        <label className="block">
          <Label field={field} />
          <select className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help text={field.help} />
        </label>
      );
    case "image":
      return <ImageField field={field} value={value as Img} onChange={onChange} />;
    case "strings":
      return <StringsField field={field} value={(value as string[]) ?? []} onChange={onChange} />;
    case "list":
      return <ListField field={field} value={(value as Obj[]) ?? []} onChange={onChange} />;
    case "group":
      return (
        <fieldset className="rounded-lg border border-[#1E1B18]/10 p-4">
          <legend className="px-1 text-sm font-semibold">{field.label}</legend>
          <div className="space-y-4">
            <Fields fields={field.fields} value={(value as Obj) ?? {}} onChange={onChange} />
          </div>
        </fieldset>
      );
  }
}

export function Fields({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <>
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </>
  );
}
