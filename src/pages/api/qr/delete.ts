import type { APIRoute } from "astro";
import { getDB } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";
import { isRecord } from "../../../lib/utils";

export const POST: APIRoute = async (context) => {
  try {
    const user = await getSessionUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized. Please log in first." }), { status: 401 });
    }

    const body: unknown = await context.request.json();
    if (!isRecord(body) || typeof body.qrId !== "string" || !body.qrId) {
      return new Response(JSON.stringify({ error: "Missing required parameter: qrId." }), { status: 400 });
    }
    const { qrId } = body;

    const db = getDB(context);

    // Verify ownership
    const existing = await db
      .prepare("SELECT id FROM qr_codes WHERE id = ? AND user_id = ?")
      .bind(qrId, user.id)
      .first();

    if (!existing) {
      return new Response(JSON.stringify({ error: "QR Code not found or access denied." }), { status: 404 });
    }

    // Delete - Cascade will automatically remove scan_analytics rows
    await db.prepare("DELETE FROM qr_codes WHERE id = ? AND user_id = ?").bind(qrId, user.id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("QR delete endpoint error:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred." }), { status: 500 });
  }
};
export const DELETE = POST; // Support both standard POST and DELETE method
