import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/apiAuth";
import bcrypt from "bcryptjs";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    if (payload.userId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both fields required" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(id).select("+password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("[PUT /api/users/[id]/password]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
