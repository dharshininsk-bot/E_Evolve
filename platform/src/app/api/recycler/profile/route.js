import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const profile = await prisma.recyclerProfile.findUnique({
      where: { userId: userId },
      include: {
        user: { select: { id: true, email: true } }
      }
    });

    if (!profile) {
      return NextResponse.json({ 
        success: true, 
        profile: {
          location: "Unknown",
          rates: JSON.stringify({ PET: 10, HDPE: 12, LDPE: 8, PP: 6 }),
          prcBalance: 0
        } 
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { userId, location, rates } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updatedProfile = await prisma.recyclerProfile.upsert({
      where: { userId: userId },
      update: {
        location,
        rates: JSON.stringify(rates)
      },
      create: {
        userId,
        location,
        rates: JSON.stringify(rates),
        businessName: "Recycler Business",
        prcBalance: 0
      }
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
