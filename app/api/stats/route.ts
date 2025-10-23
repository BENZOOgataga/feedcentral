import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { errorToResponse } from "@/lib/errors";
import type { Stats } from "@/types";

export async function GET() {
  try {
    await requireAuth();

    const articleCountResult = await sql`SELECT COUNT(*) as total FROM articles`;
    const sourceCountResult = await sql`SELECT COUNT(*) as total FROM sources WHERE active = true`;
    const lastRefreshResult =
      await sql`SELECT value FROM metadata WHERE key = 'last_refresh'`;

    const stats: Stats = {
      total_articles: parseInt(articleCountResult.rows[0]?.total || "0"),
      total_sources: parseInt(sourceCountResult.rows[0]?.total || "0"),
      last_refresh: lastRefreshResult.rows[0]?.value
        ? new Date(lastRefreshResult.rows[0].value)
        : undefined,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return errorToResponse(error);
  }
}
