import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        let profile;
        if (userId) {
            profile = await prisma.user.findUnique({
                where: { id: userId, role: 'PRODUCER' },
                select: { id: true, email: true, creditsPurchased: true }
            });
        }

        if (!profile) {
            // For demo purposes, fetch the first producer if no specific ID or ID not found
            profile = await prisma.user.findFirst({
                where: { role: 'PRODUCER' },
                select: { id: true, email: true, creditsPurchased: true }
            });
        }

        if (!profile) {
            // If still no producer exists, create a dummy one for the demo
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
