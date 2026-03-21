import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { weight, plasticType, state, district, pincode, recyclerId, collectorId } = await request.json();

    if (!collectorId) {
      return NextResponse.json({ error: "Collector ID is required" }, { status: 400 });
    }

    const log = await prisma.wasteLog.create({
      data: {
        weight: parseFloat(weight) || 0,
        plasticType: plasticType || "UNKNOWN",
        status: "REQUESTED",
        state,
        district,
        pincode,
        collectorId: collectorId,
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
