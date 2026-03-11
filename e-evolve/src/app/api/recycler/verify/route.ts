import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hcsService } from "@/lib/hedera/hcs";
import { htsService } from "@/lib/hedera/hts";

const prisma = new PrismaClient();

// GET batches awaiting verification by recyclers
export async function GET() {
  try {
    const batches = await prisma.collectionBatch.findMany({
      where: { status: "IN_TRANSIT" },
      include: { collector: true, plastics: true }
    });
    return NextResponse.json(batches);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch batches" }, { status: 500 });
  }
}

// POST: Recycler verifies a batch and mints credits
export async function POST(request: Request) {
  try {
    const { recyclerId, batchId, verifiedWeight, quality } = await request.json();

    const recycler = await prisma.user.findUnique({ where: { id: recyclerId } });
    if (!recycler || !recycler.hederaAccountId) {
        return NextResponse.json({ error: "Recycler needs Hedera setup" }, { status: 400 });
    }

    // 1. Update Batch Status
    const batch = await prisma.collectionBatch.update({
      where: { id: batchId },
      data: { status: "VERIFIED", recyclerId }
    });

    // 2. Create Verification Record
    const verification = await prisma.verification.create({
      data: {
        batchId,
        verifiedWeight,
        quality
      }
    });

    // 3. Mint Tokens on Hedera
    const { serialNumbers, transactionId } = await htsService.mintTokens(verifiedWeight);

    // 4. Create internal Credit records
    const credits = await Promise.all(serialNumbers.map(serial => 
      prisma.credit.create({
        data: {
          tokenId: "0.0.98765", // Mock PRC token
          serialNumber: serial,
          amount: 1, // 1 token = 1kg
          ownerId: recyclerId
        }
      })
    ));

    // 5. Update Verification with Minted Status
    await prisma.verification.update({
      where: { id: verification.id },
      data: { creditMinted: true, hcsMessageId: transactionId }
    });

    return NextResponse.json({
        message: "Verified and Minted successfully",
        credits: credits.length,
        transactionId
    }, { status: 201 });

  } catch (error) {
    console.error("Error verifying batch:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
