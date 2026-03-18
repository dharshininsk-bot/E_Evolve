import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { weight, plasticType, state, district, pincode, recyclerId } = await request.json();

    // Upsert a demo collector for the flow
    let user = await prisma.user.findFirst({ where: { role: "COLLECTOR" } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: `demo-collector-${Date.now()}@evolve.com`, role: "COLLECTOR" }
      });
    }

    const log = await prisma.wasteLog.create({
      data: {
        weight: parseFloat(weight) || 0,
        plasticType: plasticType || "UNKNOWN",
        status: "REQUESTED",
        state,
        district,
        pincode,
        collectorId: user.id,
        recyclerId: recyclerId || null
      }
    });

    return NextResponse.json({
      success: true,
      log
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
