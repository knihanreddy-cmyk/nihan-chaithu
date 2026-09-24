"use client";

import { useEffect } from "react";

export type DesignImageName =
  | "backstage"
  | "blue-gown"
  | "fairy"
  | "floral-lehenga"
  | "garden"
  | "green-gown"
  | "navy-ethnic"
  | "orange-flowers"
  | "park"
  | "red-peplum"
  | "runway-cutout"
  | "runway"
  | "saree"
  | "teal-lehenga"
  | "white-chair"
  | "yellow-jeep";

type DesignImage = { src: string; width: number; height: number };

const dims: Record<DesignImageName, [number, number]> = {
  backstage: [1201, 1599],
  "blue-gown": [1201, 1800],
  fairy: [1067, 1600],
  "floral-lehenga": [1201, 1800],
  garden: [1067, 1599],
  "green-gown": [1350, 1800],
  "navy-ethnic": [1200, 1600],
  "orange-flowers": [1067, 1600],
  park: [1200, 1600],
  "red-peplum": [1067, 1600],
  "runway-cutout": [915, 1600],
  runway: [1200, 1800],
  saree: [1200, 1600],
  "teal-lehenga": [1067, 1600],
  "white-chair": [1200, 1800],
  "yellow-jeep": [576, 799],
};

/** Web-sized photos in public/images/designs, with intrinsic sizes for next/image. */
export function designImage(name: DesignImageName): DesignImage {
  const [width, height] = dims[name];
  const ext = name === "runway-cutout" ? "png" : "jpg";
  return { src: `/images/designs/${name}.${ext}`, width, height };
}

/**
 * The root layout paints html/body near-black. Each design page paints its own
 * ground, so overscroll and short viewports match the design, and restores the
 * original colours on unmount.
 */
export function usePageBackground(color: string) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = [html.style.background, body.style.background];
    html.style.background = color;
    body.style.background = color;
    return () => {
      html.style.background = prev[0];
      body.style.background = prev[1];
    };
  }, [color]);
}
