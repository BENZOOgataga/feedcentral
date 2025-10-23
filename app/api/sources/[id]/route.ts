import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { deleteSourceSchema } from "@/lib/validation";
import { errorToResponse, ValidationError, NotFoundError } from "@/lib/errors";
import { sourcesMutationLimiter } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    await sourcesMutationLimiter.check(clientIp);

    const { id } = await params;
    const parsed = deleteSourceSchema.safeParse({ id });

    if (!parsed.success) {
      throw new ValidationError("Invalid source ID", parsed.error.message);
    }

    const result = await sql`
      DELETE FROM sources
      WHERE id = ${id}
    `;

    if (result.rowCount === 0) {
      throw new NotFoundError("Source not found");
    }

    logger.info("Source deleted", { id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorToResponse(error);
  }
}
