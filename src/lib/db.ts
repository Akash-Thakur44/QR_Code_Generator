import type { APIContext, AstroGlobal } from "astro";
import { Pool, types, type PoolClient, type QueryResult } from "pg";

types.setTypeParser(20, (value) => Number(value));

class PostgresStatement {
  private values: unknown[] = [];

  constructor(private readonly sql: string) {}

  bind(...values: unknown[]) {
    this.values = values;
    return this;
  }

  async first<T>(): Promise<T | null> {
    const result = await this.execute();
    return (result.rows[0] as T | undefined) ?? null;
  }

  async all<T>(): Promise<{ results: T[] }> {
    const result = await this.execute();
    return { results: result.rows as T[] };
  }

  async run(): Promise<{ success: true; meta: { changes: number } }> {
    const result = await this.execute();
    return { success: true, meta: { changes: result.rowCount ?? 0 } };
  }

  async execute(client?: PoolClient): Promise<QueryResult> {
    let parameter = 0;
    const query = this.sql.replace(/\?/g, () => `$${++parameter}`);
    return client
      ? client.query(query, this.values)
      : getPool().query(query, this.values);
  }
}

class PostgresDatabase {
  prepare(sql: string) {
    return new PostgresStatement(sql);
  }

  async batch(statements: PostgresStatement[]) {
    const client = await getPool().connect();

    try {
      await client.query("BEGIN");
      const results = [];
      for (const statement of statements) {
        results.push(await statement.execute(client));
      }
      await client.query("COMMIT");
      return results;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Failed to roll back PostgreSQL batch:", rollbackError);
      }
      throw error;
    } finally {
      client.release();
    }
  }
}

let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not configured. Set it to your Supabase PostgreSQL connection string."
      );
    }

    pool = new Pool({
      connectionString,
      max: process.env.VERCEL ? 1 : 5,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    });
    pool.on("error", (error) => {
      console.error("Unexpected PostgreSQL pool error:", error);
    });
  }

  return pool;
}

const database = new PostgresDatabase();

export function getDB(_context: APIContext | AstroGlobal) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Set it to your Supabase PostgreSQL connection string."
    );
  }

  return database;
}
