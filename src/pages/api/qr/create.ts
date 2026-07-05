import type { APIRoute } from "astro";
import { getDB } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

interface CreateQRRequest {
  type: string;
  category: string;
  originalUrl?: string;
  qrConfig: Record<string, unknown>;
}

export const POST: APIRoute = async (context) => {
  try {
    const user = await getSessionUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized. Please log in first." }), { status: 401 });
    }

    const body = await context.request.json<CreateQRRequest>();
    const { type, category, originalUrl, qrConfig } = body;

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

    // Enforce 20 dynamic QR limit
    if (type === "dynamic") {
      const countResult = await db
        .prepare("SELECT COUNT(*) as count FROM qr_codes WHERE user_id = ? AND type = 'dynamic'")
        .bind(user.id)
        .first<{ count: number }>();
      
      const dynamicCount = countResult?.count || 0;
      if (dynamicCount >= 20) {
        return new Response(
          JSON.stringify({ error: "Limit reached. You can generate up to 20 dynamic QR codes under the VIP Free Pass." }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      
      if (!originalUrl) {
        return new Response(JSON.stringify({ error: "Dynamic QR codes require an original URL destination." }), { status: 400 });
      }
    }

    const qrId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert record - no short_code needed, QR directly contains the target URL
    await db
      .prepare(
        `INSERT INTO qr_codes (
          id, user_id, organization_id, type, category, 
          original_url, qr_config, status, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`
      )
      .bind(
        qrId, user.id, org.id, type, category, 
        originalUrl || null, JSON.stringify(qrConfig), 
        now, now
      )
      .run();

    return new Response(JSON.stringify({ success: true, qrId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("QR create endpoint error:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred." }), { status: 500 });
  }
};
