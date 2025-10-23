import { sql } from "@vercel/postgres";
import { logger } from "./logger";
import { DatabaseError } from "./errors";

export { sql };

export async function query<T = any>(
  queryText: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  try {
    logger.debug("Executing query", { queryText, paramCount: params?.length || 0 });
    const result = await sql.query(queryText, params);
    return {
      rows: result.rows as T[],
      rowCount: result.rowCount || 0,
    };
  } catch (error) {
    logger.error("Database query failed", {
      queryText,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new DatabaseError(
      "Database query failed",
      error instanceof Error ? error.message : undefined
    );
  }
}

export async function queryOne<T = any>(queryText: string, params?: any[]): Promise<T | null> {
  const result = await query<T>(queryText, params);
  return result.rows[0] || null;
}

export async function transaction<T>(callback: () => Promise<T>): Promise<T> {
  try {
    await sql`BEGIN`;
    const result = await callback();
    await sql`COMMIT`;
    return result;
  } catch (error) {
    await sql`ROLLBACK`;
    logger.error("Transaction failed and rolled back", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    await sql`SELECT 1 as health`;
    return true;
  } catch (error) {
    logger.error("Database health check failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
