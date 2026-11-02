import type { APIRoute } from "astro";
import { getDB } from "../../../lib/db";
import { verifyPassword, createSession } from "../../../lib/auth";
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

    const db = getDB(context);

    // Get user from DB
    const user = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(email.toLowerCase().trim())
      .first<{ id: string; password_hash: string }>();

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid email address or password." }), { status: 400 });
    }

    // Verify Password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid email address or password." }), { status: 400 });
    }

    // Initialize session
    await createSession(context, user.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Login endpoint error:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred during login." }), { status: 500 });
  }
};
