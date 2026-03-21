import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { consumerId, weight, plasticType, collectorId } = await request.json();

    if (!consumerId || !weight || !plasticType || !collectorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify consumer
    const consumer = await prisma.user.findUnique({
      where: { id: consumerId, role: 'CONSUMER' }
    });

    if (!consumer) {
      return NextResponse.json({ error: "Consumer not found" }, { status: 404 });
    }

    const log = await prisma.wasteLog.create({
      data: {
        weight: parseFloat(weight) || 0,
        plasticType: plasticType || "UNKNOWN",
        status: "VERIFIED",
        collectorId: collectorId,
        consumerId: consumer.id
      }
    });

    // Milestone logic: Check if a 10kg milestone was reached
    const allLogs = await prisma.wasteLog.findMany({
      where: { consumerId: consumer.id }
    });

    const totalWeight = allLogs.reduce((sum, l) => sum + l.weight, 0);
    const weightBeforeCurrent = totalWeight - log.weight;

    const milestonesBefore = Math.floor(weightBeforeCurrent / 10);
    const milestonesNow = Math.floor(totalWeight / 10);

    if (milestonesNow > milestonesBefore) {
        // Create milestone records for each new 10kg reached
        for (let m = milestonesBefore + 1; m <= milestonesNow; m++) {
            const milestoneWeight = m * 10;
            const couponCode = `EVOLVE-SAVE-${milestoneWeight}-${Math.random().toString(36).substring(7).toUpperCase()}`;
            
            await prisma.milestone.create({
                data: {
                    userId: consumer.id,
                    totalWeight: milestoneWeight,
                    couponCode: couponCode
                }
            });
        }
    }

    return NextResponse.json({
      success: true,
      log,
      milestonesReached: milestonesNow > milestonesBefore
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
