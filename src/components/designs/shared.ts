"use client";

import { useEffect } from "react";

export { designImage, type DesignImageName } from "./images";

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
