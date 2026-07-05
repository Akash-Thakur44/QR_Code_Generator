import type { APIRoute } from "astro";
import { getDB } from "../../lib/db";
import { getSessionUser } from "../../lib/auth";

export const GET: APIRoute = async (context) => {
  try {
    const user = await getSessionUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized. Please log in first." }), { status: 401 });
    }

    const url = new URL(context.request.url);
    const qrId = url.searchParams.get("qrId");

    if (!qrId) {
      return new Response(JSON.stringify({ error: "Missing required parameter: qrId." }), { status: 400 });
    }

    const db = getDB(context);

    // Verify ownership
    const qr = await db
      .prepare("SELECT id, type, category, original_url FROM qr_codes WHERE id = ? AND user_id = ?")
      .bind(qrId, user.id)
      .first();

    if (!qr) {
      return new Response(JSON.stringify({ error: "QR Code not found or access denied." }), { status: 404 });
    }

    // 1. Fetch aggregates
    const totalScansResult = await db
      .prepare("SELECT COUNT(*) as count FROM scan_analytics WHERE qr_code_id = ?")
      .bind(qrId)
      .first<{ count: number }>();

    const uniqueScansResult = await db
      .prepare("SELECT COUNT(DISTINCT ip_hash) as count FROM scan_analytics WHERE qr_code_id = ?")
      .bind(qrId)
      .first<{ count: number }>();

    // 2. Fetch Daily Scans (last 14 days)
    // Note: SQLite substr(scanned_at, 1, 10) extracts 'YYYY-MM-DD' from 'YYYY-MM-DDTHH:MM:SS.SSSZ'
    const dailyScans = await db
      .prepare(
        `SELECT substr(scanned_at, 1, 10) as date, COUNT(*) as count 
         FROM scan_analytics 
         WHERE qr_code_id = ? 
         GROUP BY date 
         ORDER BY date ASC 
         LIMIT 14`
      )
      .bind(qrId)
      .all<{ date: string; count: number }>();

    // 3. Fetch Device Breakdown
    const deviceBreakdown = await db
      .prepare(
        `SELECT device, COUNT(*) as count 
         FROM scan_analytics 
         WHERE qr_code_id = ? 
         GROUP BY device`
      )
      .bind(qrId)
      .all<{ device: string; count: number }>();

    // 4. Fetch Country & City Breakdown
    const countryBreakdown = await db
      .prepare(
        `SELECT country, city, COUNT(*) as count 
         FROM scan_analytics 
         WHERE qr_code_id = ? 
         GROUP BY country, city 
         ORDER BY count DESC 
         LIMIT 10`
      )
      .bind(qrId)
      .all<{ country: string; city: string; count: number }>();

    // 5. Fetch Browser Breakdown
    const browserBreakdown = await db
      .prepare(
        `SELECT browser, COUNT(*) as count 
         FROM scan_analytics 
         WHERE qr_code_id = ? 
         GROUP BY browser 
         ORDER BY count DESC`
      )
      .bind(qrId)
      .all<{ browser: string; count: number }>();

    return new Response(
      JSON.stringify({
        success: true,
        qrDetails: qr,
        summary: {
          totalScans: totalScansResult?.count || 0,
          uniqueScans: uniqueScansResult?.count || 0,
        },
        daily: dailyScans.results || [],
        devices: deviceBreakdown.results || [],
        countries: countryBreakdown.results || [],
        browsers: browserBreakdown.results || [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Analytics endpoint error:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred." }), { status: 500 });
  }
};
