import { Fragment, type ReactNode } from "react";
import type { Img } from "./fields";

/**
 * Render CMS text with light markup: *accent* and **bold**.
 * `accent` decides how the accent style looks on each design (an <em>, a styled <span>, …).
 */
export function rich(text: string, accent: (children: ReactNode, key: number) => ReactNode = (c, k) => <em key={k}>{c}</em>): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <b key={i}>{part.slice(2, -2)}</b>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return accent(part.slice(1, -1), i);
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Plain text with the markup stripped, for aria labels and the like. */
export const plain = (text: string) => text.replace(/\*\*([^*]+)\*\*|\*([^*]+)\*/g, "$1$2");

/** Props for next/image from a CMS image. Pass alt={img.alt} alongside, so linting can see it. */
export function imgProps(img: Img) {
  return {
    src: img.src,
    width: img.width,
    height: img.height,
    ...(img.position ? { style: { objectPosition: img.position } } : {}),
  };
}
