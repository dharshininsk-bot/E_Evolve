import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const runtime = 'nodejs';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");

        const whereClause = {};
        if (role) whereClause.role = role;

        const users = await prisma.user.findMany({
            where: whereClause,
            include: {
                recyclerProfile: true
            },
            orderBy: { email: 'asc' }
        });

        // Map users to a format useful for the switcher
        const formattedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.role === 'RECYCLER' && user.recyclerProfile ? user.recyclerProfile.businessName : user.email
        }));

        return NextResponse.json({ success: true, users: formattedUsers });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
