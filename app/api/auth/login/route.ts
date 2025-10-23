import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { errorToResponse, AuthenticationError, ValidationError } from "@/lib/errors";
import { loginLimiter } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import type { User } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    await loginLimiter.check(clientIp);

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid request", parsed.error.message);
    }

    const { username, password } = parsed.data;

    const userResult = await sql<User>`
      SELECT id, username, password_hash
      FROM users
      WHERE username = ${username}
    `;

    const user = userResult.rows[0];

    if (!user) {
      throw new AuthenticationError("Invalid username or password");
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      throw new AuthenticationError("Invalid username or password");
    }

    await setAuthCookie({
      userId: user.id,
      username: user.username,
    });

    logger.info("User logged in", { username: user.username });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorToResponse(error);
  }
}
