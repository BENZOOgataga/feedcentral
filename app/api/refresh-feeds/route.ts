import { NextRequest, NextResponse } from "next/server";
import { optionalAuth } from "@/lib/auth";
import { refreshFeeds } from "@/lib/refresh-engine";
import { seedDatabase } from "@/lib/seed";
import { errorToResponse, AuthorizationError } from "@/lib/errors";
import { refreshLimiter } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const maxDuration = 300; // 5 minutes for Vercel serverless

export async function POST(request: NextRequest) {
  try {
    // Check auth: either admin JWT or cron API key
    const cronKey = request.headers.get("x-cron-key");
    const expectedCronKey = process.env.CRON_API_KEY;

    const user = await optionalAuth();

    const isAuthorized =
      (cronKey && expectedCronKey && cronKey === expectedCronKey) || user !== null;

    if (!isAuthorized) {
      throw new AuthorizationError("Unauthorized");
    }

    // Rate limit
    const identifier = user ? user.userId : "cron";
    await refreshLimiter.check(identifier);

    logger.info("Refresh feeds triggered", { by: user ? user.username : "cron" });

    // Seed database if needed (idempotent)
    await seedDatabase();

    // Refresh feeds
    const summary = await refreshFeeds();

    return NextResponse.json(summary);
  } catch (error) {
    return errorToResponse(error);
  }
}
