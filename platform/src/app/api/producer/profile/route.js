import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        // For demo purposes, fetch the first producer
        let profile = await prisma.user.findFirst({
            where: { role: 'PRODUCER' },
            select: { id: true, email: true, creditsPurchased: true }
        });

        if (!profile) {
            // If no producer exists, create a dummy one for the demo
            profile = await prisma.user.create({
                data: {
                    email: "demo-producer@example.com",
                    role: "PRODUCER",
                    creditsPurchased: 3240
                },
                select: { id: true, email: true, creditsPurchased: true }
            });
        }

        return NextResponse.json({ success: true, profile });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
