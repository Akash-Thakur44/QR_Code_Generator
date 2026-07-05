import type { APIContext, AstroGlobal } from "astro";
import { env } from "cloudflare:workers";

export interface Env {
  DB: D1Database;
}

export function getDB(context: APIContext | AstroGlobal) {
  // Try retrieving DB from cloudflare:workers env module first (Astro v6)
  if (env && (env as any).DB) {
    return (env as any).DB as D1Database;
  }

  // Fallback for Astro v5 / local development contexts that might bind to locals
  const runtime = (context as any).locals?.runtime;
  
  if (runtime && runtime.env && runtime.env.DB) {
    return runtime.env.DB as D1Database;
  }

  // Fallback if not configured properly
  throw new Error(
    "Cloudflare D1 database binding 'DB' not found. Ensure wrangler.toml is configured and you are running under a Cloudflare SSR adapter context."
  );
}

