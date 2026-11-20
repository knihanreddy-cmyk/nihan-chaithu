/**
 * Admin sessions: a signed, expiring cookie. Uses Web Crypto only, so it runs in Proxy and on the server.
 * Set ADMIN_PASSWORD (what you type to log in) and ADMIN_SECRET (a long random string) in the environment.
 */

export const SESSION_COOKIE = "cms_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const enc = new TextEncoder();

function secret(): string {
  const s = process.env.ADMIN_SECRET;
  if (s && s.length >= 16) return s;
  // Fallback keeps local setups working, but production should set ADMIN_SECRET.
  const pw = process.env.ADMIN_PASSWORD;
  return pw ? `pw:${pw}` : "";
}

async function hmacHex(data: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const isAuthConfigured = () => Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);

/** Check the admin email (case-insensitive) and password against ADMIN_EMAIL / ADMIN_PASSWORD. */
export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const wantEmail = process.env.ADMIN_EMAIL;
  const wantPassword = process.env.ADMIN_PASSWORD;
  if (!wantEmail || !wantPassword) return false;
  // Compare fixed-length digests so the check takes the same time whatever was typed.
  const key = "credential-check";
  const [a, b, c, d] = await Promise.all([
    hmacHex(email.trim().toLowerCase(), key),
    hmacHex(wantEmail.trim().toLowerCase(), key),
    hmacHex(password, key),
    hmacHex(wantPassword, key),
  ]);
  const emailOk = safeEqual(a, b);
  const passwordOk = safeEqual(c, d);
  return emailOk && passwordOk;
}

export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `v1.${exp}`;
  return `${payload}.${await hmacHex(payload, secret())}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false;
  return safeEqual(parts[2], await hmacHex(`${parts[0]}.${parts[1]}`, secret()));
}
