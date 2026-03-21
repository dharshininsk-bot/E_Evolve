import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district");
    const state = searchParams.get("state");

    const whereClause = {};
    if (district) whereClause.location = { contains: district };

    const recyclers = await prisma.recyclerProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, email: true }
        }
      }
    });

    return NextResponse.json({ success: true, recyclers });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
