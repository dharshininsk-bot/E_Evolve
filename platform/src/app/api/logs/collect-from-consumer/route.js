import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { consumerId, weight, plasticType, collectorId } = await request.json();

    if (!consumerId || !weight || !plasticType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify consumer
    const consumer = await prisma.user.findUnique({
      where: { id: consumerId, role: 'CONSUMER' }
    });

    if (!consumer) {
      return NextResponse.json({ error: "Consumer not found" }, { status: 404 });
    }

    // Get collector
    let user = null;
    if (collectorId) {
        user = await prisma.user.findUnique({ where: { id: collectorId }});
    } else {
        user = await prisma.user.findFirst({ where: { role: "COLLECTOR" } });
    }
    
    if (!user) {
      return NextResponse.json({ error: "No collector found" }, { status: 400 });
    }

    const log = await prisma.wasteLog.create({
      data: {
        weight: parseFloat(weight) || 0,
        plasticType: plasticType || "UNKNOWN",
        status: "VERIFIED",
        collectorId: user.id,
        consumerId: consumer.id
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
