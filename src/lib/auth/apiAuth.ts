import { NextRequest, NextResponse } from "next/server";
import { getTokenFromHeader } from "@/lib/auth/jwt";
import type { JWTPayload } from "@/lib/auth/jwt";

/**
 * Extract and validate JWT payload from request.
 * Returns `{ payload }` on success or `{ error }` on failure.
 */
export function requireAuth(
  req: NextRequest,
  requiredRole?: string
): { payload: JWTPayload; error?: never } | { payload?: never; error: NextResponse } {
  const payload = getTokenFromHeader(req.headers.get("authorization"));
  if (!payload) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (requiredRole && payload.role !== requiredRole && payload.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { payload };
}
