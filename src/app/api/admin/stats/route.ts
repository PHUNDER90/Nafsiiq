import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { TestResult } from "@/lib/db/models/TestResult";
import { requireAuth } from "@/lib/auth/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, "admin");
    if (auth.error) return auth.error;

    await connectDB();

    const [totalUsers, totalTests, recentUsers, recentResults] = await Promise.all([
      User.countDocuments(),
      TestResult.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("-password").lean(),
      TestResult.find().sort({ completedAt: -1 }).limit(5).lean(),
    ]);

    const typeDist = await TestResult.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({ totalUsers, totalTests, recentUsers, recentResults, typeDist });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
