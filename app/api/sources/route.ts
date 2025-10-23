import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { addSourceSchema } from "@/lib/validation";
import { errorToResponse, ValidationError } from "@/lib/errors";
import { sourcesMutationLimiter } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import type { Source } from "@/types";

export async function GET() {
  try {
    const sourcesResult = await sql<Source>`
      SELECT id, name, url, category, active, created_at
      FROM sources
      WHERE active = true
      ORDER BY category, name
    `;

    // Group by category
    const grouped = sourcesResult.rows.reduce(
      (acc, source) => {
        if (!acc[source.category]) {
          acc[source.category] = [];
        }
        acc[source.category].push(source);
        return acc;
      },
      {} as Record<string, Source[]>
    );

    return NextResponse.json(grouped);
  } catch (error) {
    return errorToResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    await sourcesMutationLimiter.check(clientIp);

    const body = await request.json();
    const parsed = addSourceSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid request", parsed.error.message);
    }

    const { name, url, category } = parsed.data;

    const result = await sql<Source>`
      INSERT INTO sources (name, url, category, active)
      VALUES (${name}, ${url}, ${category}, true)
      RETURNING id, name, url, category, active, created_at
    `;

    const source = result.rows[0];

    logger.info("Source added", { name, url, category });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    return errorToResponse(error);
  }
}
