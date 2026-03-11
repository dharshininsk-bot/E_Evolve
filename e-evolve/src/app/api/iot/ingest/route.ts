import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hcsService } from "@/lib/hedera/hcs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { consumerId, weight, type, location } = body;

    // 1. Log to Hedera Consensus Service
    const hcsMemo = `IoT Bin Drop - Type: ${type}, Weight: ${weight}kg`;
    const topicId = await hcsService.createTopic(hcsMemo);
    
    await hcsService.submitMessage(topicId, JSON.stringify({
      event: "PLASTIC_DEPOSITED",
      timestamp: new Date().toISOString(),
      consumerId,
      weight,
      type,
      location
    }));

    // 2. Save to Database
    const log = await prisma.plasticLog.create({
      data: {
        consumerId,
        weight,
        type,
        location,
        hcsTopicId: topicId,
      }
    });

    // 3. Update Consumer Points (1 point per kg)
    await prisma.user.update({
      where: { id: consumerId },
      data: { points: { increment: Math.floor(weight) } }
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Error in IoT ingestion:", error);
    return NextResponse.json({ error: "Failed to ingest IoT data" }, { status: 500 });
  }
}
