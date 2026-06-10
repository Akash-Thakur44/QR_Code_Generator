import type { APIContext, AstroGlobal } from "astro";
import { getDB } from "./db";

// Hash password using PBKDF2 (SHA-256) (Web Crypto API - edge compatible)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveKey", "deriveBits"]
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    256
  );
  
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}.${hashHex}`;
}

// Verify password against stored hash
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split('.');
  if (!saltHex || !hashHex) return false;
  
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );
  
  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveKey", "deriveBits"]
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    256
  );
  
  const verifyHashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return verifyHashHex === hashHex;
}

// Get logged-in user from request cookies
export async function getSessionUser(context: APIContext | AstroGlobal) {
  const sessionToken = context.cookies.get("session")?.value;
  if (!sessionToken) return null;

  try {
    const db = getDB(context);
    
    // Get session from database
    const session = await db
      .prepare("SELECT * FROM sessions WHERE id = ?")
      .bind(sessionToken)
      .first<{ id: string; user_id: string; expires_at: number }>();
      
    if (!session) return null;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at < now) {
      // Delete expired session
      await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionToken).run();
      context.cookies.delete("session", { path: "/" });
      return null;
    }

    // Get user details
    const user = await db
      .prepare("SELECT id, email, role, subscription_tier, created_at FROM users WHERE id = ?")
      .bind(session.user_id)
      .first<{ id: string; email: string; role: string; subscription_tier: string; created_at: string }>();

    return user;
  } catch (err) {
    console.error("Session lookup error:", err);
    return null;
  }
}

// Create new session in D1
export async function createSession(context: APIContext | AstroGlobal, userId: string) {
  const sessionToken = crypto.randomUUID();
  const maxAge = 60 * 60 * 24 * 7; // 1 week
  const expiresAt = Math.floor(Date.now() / 1000) + maxAge;

  const db = getDB(context);
  
  // Insert session
  await db
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(sessionToken, userId, expiresAt)
    .run();

  // Set HTTP-Only Cookie
  context.cookies.set("session", sessionToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: maxAge,
  });

  return sessionToken;
}

// Clear session
export async function destroySession(context: APIContext | AstroGlobal) {
  const sessionToken = context.cookies.get("session")?.value;
  if (sessionToken) {
    try {
      const db = getDB(context);
      await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionToken).run();
    } catch (err) {
      console.error("Session delete error:", err);
    }
  }
  context.cookies.delete("session", { path: "/" });
}
