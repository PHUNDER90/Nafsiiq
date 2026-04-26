import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/apiAuth";

interface Params { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    if (payload.userId !== id && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const user = await User.findById(id).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ _id: user._id.toString(), name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (err) {
    console.error("[GET /api/users/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    if (payload.userId !== id && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const allowed: Record<string, unknown> = {};
    if (body.name) allowed.name = body.name.trim();
    if (body.avatar) allowed.avatar = body.avatar;

    await connectDB();
    const user = await User.findByIdAndUpdate(id, allowed, { new: true }).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ _id: user._id.toString(), name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (err) {
    console.error("[PUT /api/users/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req, "admin");
    if (auth.error) return auth.error;

    await connectDB();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("[DELETE /api/users/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
