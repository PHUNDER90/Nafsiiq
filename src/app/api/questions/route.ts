import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { orderNum: "asc" },
      include: {
        axis: { select: { nameAr: true } },
        options: { orderBy: { orderNum: "asc" }, select: { id: true, orderNum: true, textAr: true } },
      },
    });

    const formatted = questions.map((q) => ({
      id: q.id,
      orderNum: q.orderNum,
      textAr: q.textAr,
      axisNameAr: q.axis.nameAr,
      options: q.options,
    }));

    return NextResponse.json({ questions: formatted });
  } catch (err) {
    console.error("[GET /api/questions]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
