import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let recyclerId = userId;

    if (!recyclerId) {
      // For demo purposes, find the first recycler
      const recycler = await prisma.user.findFirst({
        where: { role: "RECYCLER" }
      });
      if (recycler) recyclerId = recycler.id;
    }

    if (!recyclerId) {
      return NextResponse.json({ success: true, logs: [] });
    }

    const logs = await prisma.wasteLog.findMany({
      where: {
        status: "REQUESTED",
        recyclerId: recyclerId
      },
      orderBy: { createdAt: 'desc' },
      include: {
        collector: {
          select: { id: true, email: true }
        }
      }
    });

    return NextResponse.json({ success: true, logs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

