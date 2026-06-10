import type { APIRoute } from "astro";
import { destroySession } from "../../../lib/auth";

export const POST: APIRoute = async (context) => {
  await destroySession(context);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// Also support GET for simple redirect links
export const GET: APIRoute = async (context) => {
  await destroySession(context);
  return context.redirect("/login");
};
