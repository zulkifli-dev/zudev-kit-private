const encoder = new TextEncoder();
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

function encode(value: Uint8Array) {
  return btoa(String.fromCharCode(...value))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function decode(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

export function createSessionToken() {
  return encode(crypto.getRandomValues(new Uint8Array(32)));
}

export async function hashSessionToken(token: string) {
  return encode(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", encoder.encode(token)),
    ),
  );
}

export function sessionCookie(token: string, secure = true) {
  const name = secure ? "__Host-session" : "session";
  return `${name}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure ? "; Secure" : ""}`;
}

export function clearSessionCookie(secure = true) {
  const name = secure ? "__Host-session" : "session";
  return `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`;
}

export async function verifyPassword(password: string, encodedHash: string) {
  // Hash format: pbkdf2-sha256$600000$<base64url salt>$<base64url digest>.
  const [algorithm, roundsText, saltText, digestText, extra] =
    encodedHash.split("$");
  const rounds = Number(roundsText);
  if (
    algorithm !== "pbkdf2-sha256" ||
    extra ||
    !Number.isSafeInteger(rounds) ||
    rounds < 600_000 ||
    rounds > 2_000_000 ||
    password.length > 1024
  )
    return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const digest = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: decode(saltText),
        iterations: rounds,
      },
      key,
      256,
    );
    const actual = new Uint8Array(digest);
    const salt = decode(saltText);
    const expected = decode(digestText);
    if (salt.length !== 16 || expected.length !== 32) return false;
    let difference = actual.length ^ expected.length;
    for (let index = 0; index < actual.length; index++)
      difference |= actual[index] ^ (expected[index] ?? 0);
    return difference === 0;
  } catch {
    return false;
  }
}

export async function hashPassword(password: string, rounds = 600_000) {
  if (
    password.length < 12 ||
    password.length > 1024 ||
    !Number.isSafeInteger(rounds) ||
    rounds < 600_000 ||
    rounds > 2_000_000
  )
    throw new Error("Password or work factor is invalid");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const digest = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations: rounds },
      key,
      256,
    ),
  );
  return `pbkdf2-sha256$${rounds}$${encode(salt)}$${encode(digest)}`;
}
