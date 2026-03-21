import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const recyclerId = searchParams.get("recyclerId");

        if (!recyclerId) {
            return NextResponse.json({ error: "Recycler ID is required" }, { status: 400 });
        }

        // Fetch recent verified/minted logs for this recycler
        const logs = await prisma.wasteLog.findMany({
            where: {
                recyclerId: recyclerId,
                status: { in: ['VERIFIED', 'MINTED', 'ACCEPTED'] }
            },
            include: {
                collector: {
                    select: { email: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Aggregate by collector
        const collectorStats = {};
        logs.forEach(log => {
            const email = log.collector?.email || "Unknown";
            if (!collectorStats[email]) {
                collectorStats[email] = { weight: 0, count: 0 };
            }
            collectorStats[email].weight += log.weight;
            collectorStats[email].count += 1;
        });

        const overview = Object.entries(collectorStats).map(([email, stats]) => ({
            collectorEmail: email,
            totalWeight: stats.weight,
            logsCount: stats.count
        }));

        return NextResponse.json({ 
            success: true, 
            overview,
            totalLogs: logs.length
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
