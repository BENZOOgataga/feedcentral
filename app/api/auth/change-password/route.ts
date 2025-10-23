import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth, verifyPassword, hashPassword } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validation";
import { errorToResponse, ValidationError, AuthenticationError } from "@/lib/errors";
import { passwordChangeLimiter } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    await passwordChangeLimiter.check(clientIp);

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid request", parsed.error.message);
    }

    const { currentPassword, newPassword } = parsed.data;

    const userResult = await sql`
      SELECT password_hash FROM users WHERE id = ${user.userId}
    `;

    const currentUser = userResult.rows[0];

    if (!currentUser) {
      throw new AuthenticationError("User not found");
    }

    const isValidPassword = await verifyPassword(currentPassword, currentUser.password_hash);

    if (!isValidPassword) {
      throw new AuthenticationError("Current password is incorrect");
    }

    const newPasswordHash = await hashPassword(newPassword);

    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash}, updated_at = NOW()
      WHERE id = ${user.userId}
    `;

    logger.info("Password changed", { username: user.username });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorToResponse(error);
  }
}
