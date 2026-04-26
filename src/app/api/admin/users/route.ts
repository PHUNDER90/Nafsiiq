import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, "admin");
    if (auth.error) return auth.error;

    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
