import { createHmac, randomUUID } from "node:crypto";

/**
 * ImageKit over its REST API: signed browser uploads, file details, deletes and server-side uploads.
 * Env: IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT, optional IMAGEKIT_FOLDER.
 */

const UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const API = "https://api.imagekit.io/v1/files";

export type IkFile = {
  fileId: string;
  name: string;
  url: string;
  width?: number;
  height?: number;
  size?: number;
  fileType?: string;
};

export const isImageKitConfigured = () =>
  Boolean(process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT);

export const imagekitFolder = () => process.env.IMAGEKIT_FOLDER || "/portfolio";

function privateKey() {
  const k = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!k) throw new Error("ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT.");
  return k;
}

const authHeader = () => `Basic ${Buffer.from(`${privateKey()}:`).toString("base64")}`;

/** One-time parameters that let the browser upload a single file straight to ImageKit. */
export function uploadAuthParams() {
  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60; // must be under an hour
  const signature = createHmac("sha1", privateKey()).update(token + expire).digest("hex");
  return { token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY ?? "", folder: imagekitFolder() };
}

async function ikJson<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { message?: string }).message || `ImageKit error ${res.status}`);
  return body as T;
}

export async function getFileDetails(fileId: string): Promise<IkFile> {
  if (!/^[\w-]{6,64}$/.test(fileId)) throw new Error("Invalid file id");
  const res = await fetch(`${API}/${fileId}/details`, { headers: { Authorization: authHeader() }, cache: "no-store" });
  return ikJson<IkFile>(res);
}

export async function deleteFile(fileId: string): Promise<void> {
  if (!/^[\w-]{6,64}$/.test(fileId)) throw new Error("Invalid file id");
  const res = await fetch(`${API}/${fileId}`, { method: "DELETE", headers: { Authorization: authHeader() } });
  // 404: already gone from ImageKit, which is what we wanted.
  if (!res.ok && res.status !== 404) await ikJson(res);
}

/** Upload bytes from the server (used to move the built-in /public photos into ImageKit). */
export async function uploadBuffer(bytes: Uint8Array, fileName: string, folder = imagekitFolder()): Promise<IkFile> {
  const fd = new FormData();
  fd.append("file", new Blob([new Uint8Array(bytes)]), fileName);
  fd.append("fileName", fileName);
  fd.append("folder", folder);
  fd.append("useUniqueFileName", "true");
  const res = await fetch(UPLOAD_URL, { method: "POST", headers: { Authorization: authHeader() }, body: fd });
  return ikJson<IkFile>(res);
}
