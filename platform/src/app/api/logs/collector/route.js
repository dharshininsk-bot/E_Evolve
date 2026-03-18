import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const whereClause = {};
    if (userId) whereClause.collectorId = userId;

    const logs = await prisma.wasteLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        recycler: {
          select: { id: true, email: true, recyclerProfile: true }
        }
      }
    });

    return NextResponse.json({ success: true, logs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
