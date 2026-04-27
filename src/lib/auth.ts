import crypto from "crypto";

const iterations = 120000;
const keylen = 32;
const digest = "sha256";

export function hashPassword(password: string, salt?: string): string {
  const useSalt = salt ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, useSalt, iterations, keylen, digest).toString("hex");
  return `${useSalt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, original] = stored.split(":");
  if (!salt || !original) return false;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(original));
}
