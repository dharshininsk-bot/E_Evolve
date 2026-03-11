import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// In a real app, this would use NextAuth.js or similar
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  try {
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { creditsOwned: true }
      });
      return NextResponse.json(user || { error: "User not found" }, { status: user ? 200 : 404 });
    }

    // Return all users for demo purposes (to allow easy switching)
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        hederaAccountId: `0.0.${Math.floor(Math.random() * 10000) + 10000}`
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
