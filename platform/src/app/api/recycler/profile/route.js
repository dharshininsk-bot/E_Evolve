import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // For demo purposes, we fetch the first recycler
    const profile = await prisma.recyclerProfile.findFirst({
      include: {
        user: {
          select: { id: true, email: true }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { location, rates } = await request.json();

    // For demo, find the first profile
    const profile = await prisma.recyclerProfile.findFirst();
    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const updatedProfile = await prisma.recyclerProfile.update({
      where: { id: profile.id },
      data: {
        location,
        rates: JSON.stringify(rates)
      }
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
