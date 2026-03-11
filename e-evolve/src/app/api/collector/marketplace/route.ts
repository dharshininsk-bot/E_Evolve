import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hcsService } from "@/lib/hedera/hcs";

const prisma = new PrismaClient();

// GET all available plastics (not collected) for the marketplace
export async function GET() {
  try {
    const plastics = await prisma.plasticLog.findMany({
      where: { isCollected: false },
      include: { consumer: true }
    });
    return NextResponse.json(plastics);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch marketplace" }, { status: 500 });
  }
}

// POST: Collector claims/collects plastics
export async function POST(request: Request) {
  try {
    const { collectorId, plasticLogIds } = await request.json();

    // Calculate total weight
    const logs = await prisma.plasticLog.findMany({
      where: { id: { in: plasticLogIds } }
    });
    
    const totalWeight = logs.reduce((sum, log) => sum + log.weight, 0);

    // Create a Collection Batch
    const batch = await prisma.collectionBatch.create({
      data: {
        collectorId,
        totalWeight,
        plastics: {
          connect: plasticLogIds.map((id: string) => ({ id }))
        }
      }
    });

    // Mark plastics as collected and log to HCS
    for (const log of logs) {
      await prisma.plasticLog.update({
        where: { id: log.id },
        data: { isCollected: true }
      });

      if (log.hcsTopicId) {
        await hcsService.submitMessage(log.hcsTopicId, JSON.stringify({
          event: "COLLECTED_BY_COLLECTOR",
          timestamp: new Date().toISOString(),
          collectorId,
          batchId: batch.id
        }));
      }
    }

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating collection batch:", error);
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 });
  }
}
