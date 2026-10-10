/** Nihan's photos in public/images/nihan, with intrinsic sizes for next/image. */

export type NihanPhotoNo =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
  | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28;

const dims: Record<NihanPhotoNo, readonly [number, number]> = {
  1: [1600, 1200],
  2: [1200, 1600],
  3: [1600, 1200],
  4: [1600, 1200],
  5: [1070, 1600],
  6: [1063, 1600],
  7: [900, 1600],
  8: [900, 1600],
  9: [900, 1600],
  10: [900, 1600],
  11: [1063, 1600],
  12: [1200, 1600],
  13: [1600, 1200],
  14: [789, 1600],
  15: [1200, 1600],
  16: [1200, 1600],
  17: [1600, 1200],
  18: [1200, 1600],
  19: [1062, 1600],
  20: [853, 1280],
  21: [1200, 1600],
  22: [1200, 1600],
  23: [1200, 1600],
  24: [1200, 1600],
  25: [1600, 1200],
  26: [1200, 1600],
  27: [1600, 1200],
  28: [1200, 1600],
};

export type NihanPhoto = { src: string; width: number; height: number };

export function nihanPhoto(no: NihanPhotoNo): NihanPhoto {
  const [width, height] = dims[no];
  return { src: `/images/nihan/nihan-${String(no).padStart(2, "0")}.jpg`, width, height };
}
