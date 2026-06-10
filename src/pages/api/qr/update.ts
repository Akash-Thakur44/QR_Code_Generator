import type { APIRoute } from "astro";
import { getDB } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  try {
    const user = await getSessionUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized. Please log in first." }), { status: 401 });
    }

    const { qrId, originalUrl, qrConfig } = await context.request.json();

    if (!qrId) {
      return new Response(JSON.stringify({ error: "Missing required parameter: qrId." }), { status: 400 });
    }

    const db = getDB(context);

    // Verify ownership
    const existing = await db
      .prepare("SELECT id FROM qr_codes WHERE id = ? AND user_id = ?")
      .bind(qrId, user.id)
      .first();

    if (!existing) {
      return new Response(JSON.stringify({ error: "QR Code not found or access denied." }), { status: 404 });
    }

    const now = new Date().toISOString();

    // Prepare update parameters
    let query = "UPDATE qr_codes SET updated_at = ?";
    const bindings: any[] = [now];

    if (originalUrl !== undefined) {
      query += ", original_url = ?";
      bindings.push(originalUrl);
    }
    if (qrConfig !== undefined) {
      query += ", qr_config = ?";
      bindings.push(JSON.stringify(qrConfig));
    }

    query += " WHERE id = ? AND user_id = ?";
    bindings.push(qrId, user.id);

    await db.prepare(query).bind(...bindings).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("QR update endpoint error:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred." }), { status: 500 });
  }
};
