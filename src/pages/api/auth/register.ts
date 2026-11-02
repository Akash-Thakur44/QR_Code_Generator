import type { APIRoute } from "astro";
import { getDB } from "../../../lib/db";
import { hashPassword, createSession } from "../../../lib/auth";
import { isRecord } from "../../../lib/utils";

export const POST: APIRoute = async (context) => {
  try {
    const body: unknown = await context.request.json();
    if (!isRecord(body)) {
      return new Response(JSON.stringify({ error: "Email and password are required fields." }), { status: 400 });
    }

    const { email, password } = body;

    // Validation
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return new Response(JSON.stringify({ error: "Email and password are required fields." }), { status: 400 });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters long." }), { status: 400 });
    }

    const db = getDB(context);

    // Check if user already exists
    const existingUser = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(email.toLowerCase().trim())
      .first();

    if (existingUser) {
      return new Response(JSON.stringify({ error: "An account with this email address already exists." }), { status: 400 });
    }

    // Hash password & generate ids
    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();
    const orgId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Batch transaction inserts
    await db.batch([
      // Create user
      db.prepare(
        "INSERT INTO users (id, email, password_hash, role, subscription_tier, created_at, updated_at) VALUES (?, ?, ?, 'user', 'free', ?, ?)"
      ).bind(userId, email.toLowerCase().trim(), hashedPassword, now, now),
      // Create default workspace organization
      db.prepare(
        "INSERT INTO organizations (id, name, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(orgId, `${email.split("@")[0]}'s Workspace`, userId, now, now),
    ]);

    // Initialize session
    await createSession(context, userId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Registration endpoint error:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred during registration." }), { status: 500 });
  }
};
