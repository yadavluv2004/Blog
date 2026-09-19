/**
 * Minimal admin gate — a single shared password, not a user-account system.
 * A correct password gets an HMAC-signed, time-limited cookie; nothing is
 * stored server-side. Built entirely on Web Crypto (`crypto.subtle`) so the
 * same code runs unchanged in middleware (Edge runtime) and in Server
 * Actions/Route Handlers (Node runtime). Deliberately has no dependency on
 * next/headers — middleware.ts imports this file directly, and pulling in
 * a Node/Next-request-scoped API here would break that Edge bundle. The
 * cookies()-reading counterpart lives in lib/admin-session.ts instead.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padLength = (4 - (value.length % 4)) % 4;
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
  const binary = atob(padded);
  return new Uint8Array(Array.from(binary, (c) => c.charCodeAt(0)));
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

/** Creates a signed session token, or null if ADMIN_SESSION_SECRET isn't configured. */
export async function createSessionToken(): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;

  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(expiresAt)));

  return `${expiresAt}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Verifies a session token's signature and expiry. Never throws. */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret || !token) return false;

  const [expiresAtRaw, signatureRaw] = token.split(".");
  if (!expiresAtRaw || !signatureRaw) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  try {
    const key = await getHmacKey(secret);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signatureRaw) as BufferSource,
      new TextEncoder().encode(expiresAtRaw),
    );
  } catch {
    return false;
  }
}

/** Constant-time-ish password check: compares SHA-256 digests rather than raw strings. */
export async function verifyPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const [a, b] = await Promise.all([sha256(candidate), sha256(expected)]);
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function sha256(input: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return new Uint8Array(digest);
}
