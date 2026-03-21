import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const body = await request.json();
        let { producerId, recyclerId, amount } = body;

        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        if (!producerId) {
            // Find a demo producer if not provided
            const demoProducer = await prisma.user.findFirst({ where: { role: 'PRODUCER' } });
            if (!demoProducer) {
                return NextResponse.json({ error: "No PRODUCER found in db to assign purchase to" }, { status: 400 });
            }
            producerId = demoProducer.id;
        }

        // Validate recycler balance
        const recyclerProfile = await prisma.recyclerProfile.findUnique({
            where: { userId: recyclerId }
        });

        if (!recyclerProfile || recyclerProfile.prcBalance < amount) {
            return NextResponse.json({ error: "Insufficient available credits" }, { status: 400 });
        }

        const pricePerCredit = 0.50; // ₹0.50 per kg
        const amountUsd = amount * pricePerCredit;

        // Perform transaction
        const transactionResult = await prisma.$transaction(async (tx) => {
            // 1. Deduct from recycler
            const updatedRecycler = await tx.recyclerProfile.update({
                where: { userId: recyclerId },
                data: {
                    prcBalance: { decrement: amount }
                }
            });

            // 2. Add to producer
            const updatedProducer = await tx.user.update({
                where: { id: producerId },
                data: {
                    creditsPurchased: { increment: amount }
                }
            });

            // 3. Log transaction
            const record = await tx.creditTransaction.create({
                data: {
                    producerId,
                    recyclerId: updatedRecycler.userId, // use userId because recyclerId in JSON is actually the userId of RecyclerProfile
                    amount,
                    amountUsd
                }
            });

            return { updatedRecycler, updatedProducer, record };
        });

        return NextResponse.json({
            success: true,
            transaction: transactionResult.record
        });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
