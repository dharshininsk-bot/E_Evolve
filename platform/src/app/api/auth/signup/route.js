import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password and role are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password,
        role: role.toUpperCase(),
      },
    });

    // Create profile based on role
    if (role.toUpperCase() === 'RECYCLER') {
        await prisma.recyclerProfile.create({
            data: {
                userId: user.id,
                businessName: `${role.charAt(0) + role.slice(1).toLowerCase()} Business`,
                location: "Unknown",
                rates: JSON.stringify({ PET: 10, HDPE: 12, LDPE: 8, PP: 6 })
            }
        });
    } else if (role.toUpperCase() === 'COLLECTOR') {
        await prisma.collectorProfile.create({
            data: {
                userId: user.id,
                region: "Unknown",
                collectionTime: "09:00 AM - 05:00 PM",
                wasteType: "All Plastics"
            }
        });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
