export type MediaItem = {
  id: string;
  url: string;
  name: string;
  width: number;
  height: number;
  size: number;
  createdAt: string;
};

/** A smaller ImageKit rendition for admin thumbnails; local /public paths are returned unchanged. */
export function thumb(src: string, width = 400): string {
  if (!/^https:\/\/[^/]*imagekit\.io\//.test(src)) return src;
  return `${src}${src.includes("?") ? "&" : "?"}tr=w-${width}`;
}
