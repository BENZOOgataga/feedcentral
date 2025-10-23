import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { errorToResponse } from "@/lib/errors";

export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorToResponse(error);
  }
}
