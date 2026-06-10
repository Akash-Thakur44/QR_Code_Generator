import type { APIRoute } from "astro";
import { getDB } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  try {
    const user = await getSessionUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized. Please log in first." }), { status: 401 });
    }

    const { type, category, originalUrl, qrConfig } = await context.request.json();

    if (!type || !category || !qrConfig) {
      return new Response(JSON.stringify({ error: "Missing required parameters (type, category, qrConfig)." }), { status: 400 });
    }

    const db = getDB(context);

    // Fetch user organization
    const org = await db
      .prepare("SELECT id FROM organizations WHERE owner_id = ?")
      .bind(user.id)
      .first<{ id: string }>();

    if (!org) {
      return new Response(JSON.stringify({ error: "User workspace organization not found." }), { status: 404 });
    }

    const qrId = crypto.randomUUID();
    const now = new Date().toISOString();
    let shortCode: string | null = null;

    if (type === "dynamic") {
      if (!originalUrl) {
        return new Response(JSON.stringify({ error: "Dynamic QR codes require an original URL destination." }), { status: 400 });
      }
      
      // Generate a unique 5-character alphanumeric short code
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        const potentialCode = Math.random().toString(36).substring(2, 7);
        const existing = await db.prepare("SELECT id FROM qr_codes WHERE short_code = ?").bind(potentialCode).first();
        if (!existing) {
          shortCode = potentialCode;
          isUnique = true;
        }
        attempts++;
      }
      if (!shortCode) {
        return new Response(JSON.stringify({ error: "Failed to generate a unique short code." }), { status: 500 });
      }
    }

    // Insert record
    await db
      .prepare(
        `INSERT INTO qr_codes (
          id, user_id, organization_id, type, category, 
          short_code, original_url, qr_config, status, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`
      )
      .bind(
        qrId, user.id, org.id, type, category, 
        shortCode, originalUrl || null, JSON.stringify(qrConfig), 
        now, now
      )
      .run();

    return new Response(JSON.stringify({ success: true, qrId, shortCode }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("QR create endpoint error:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred." }), { status: 500 });
  }
};
