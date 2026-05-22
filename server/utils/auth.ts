import crypto from "crypto";

/**
 * Hashes a plain-text password using Node's native pbkdf2Sync.
 * Output format is `salt:hash` (in hex).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a stored `salt:hash` string.
 */
export function verifyPassword(password: string, storedValue: string): boolean {
  if (!storedValue) return false;
  const parts = storedValue.split(":");
  if (parts.length !== 2) return false;
  const [salt, storedHash] = parts;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === storedHash;
}
