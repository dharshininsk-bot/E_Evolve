import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { htsService } from "@/lib/hedera/hts";

const prisma = new PrismaClient();

// GET available credits in the market
export async function GET() {
  try {
    const credits = await prisma.credit.findMany({
      where: { status: "ACTIVE" },
      include: { owner: true }
    });
    return NextResponse.json(credits);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch marketplace credits" }, { status: 500 });
  }
}

// POST: Producer buys credits
export async function POST(request: Request) {
  try {
    const { producerId, creditIds } = await request.json();

    const producer = await prisma.user.findUnique({ where: { id: producerId } });
    
    // Simulate HTS transfer
    const transactionId = await htsService.transferTokens(
        "Recycler_Account", 
        producer?.hederaAccountId || "Producer_Account",
        creditIds.length
    );

    // Update database
    await prisma.credit.updateMany({
      where: { id: { in: creditIds } },
      data: { 
        ownerId: producerId,
        status: "RETIRED" // Burned to offset obligations
      }
    });

    return NextResponse.json({
        message: `Successfully purchased and retired ${creditIds.length} credits.`,
        transactionId
    }, { status: 200 });

  } catch (error) {
    console.error("Error purchasing credits:", error);
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
  }
}
