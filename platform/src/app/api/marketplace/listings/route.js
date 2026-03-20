import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const listings = await prisma.recyclerProfile.findMany({
            where: {
                prcBalance: { gt: 0 }
            },
            include: {
                user: {
                    select: { email: true }
                }
            },
            orderBy: { prcBalance: 'desc' }
        });

        return NextResponse.json({ success: true, listings });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
