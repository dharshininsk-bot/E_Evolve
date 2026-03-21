import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        let user;
        if (userId) {
            user = await prisma.user.findUnique({
                where: { id: userId, role: 'CONSUMER' },
                include: {
                    wasteLogs: true,
                    milestones: {
                        orderBy: { totalWeight: 'asc' }
                    }
                }
            });
        } else {
            user = await prisma.user.findFirst({
                where: { role: 'CONSUMER' },
                include: {
                    wasteLogs: true,
                    milestones: {
                        orderBy: { totalWeight: 'asc' }
                    }
                }
            });
        }

        if (!user) {
            return NextResponse.json({ error: "Consumer not found" }, { status: 404 });
        }

        // Calculate stats
        const totalWeight = user.wasteLogs.reduce((sum, log) => sum + log.weight, 0);
        const creditsEarned = user.wasteLogs.filter(l => l.status === 'MINTED' || l.status === 'VERIFIED').reduce((sum, log) => sum + (log.weight * 10), 0);
        
        const profile = {
            id: user.id,
            email: user.email,
            stats: {
                plasticDiverted: totalWeight,
                creditsEarned: creditsEarned,
                impact: "+12.5%"
            },
            milestones: user.milestones
        };

        return NextResponse.json({ success: true, profile });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
