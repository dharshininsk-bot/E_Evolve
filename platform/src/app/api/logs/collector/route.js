import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const logs = await prisma.wasteLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        recycler: {
          select: {
            id: true,
            email: true,
            recyclerProfile: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, logs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
