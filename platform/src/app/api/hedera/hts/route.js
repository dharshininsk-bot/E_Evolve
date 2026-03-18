import { NextResponse } from "next/server";
import {
    Client,
    TokenMintTransaction,
    PrivateKey,
} from "@hashgraph/sdk";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getMirrorBalance(accountId, tokenId) {
    try {
        const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/tokens?token.id=${tokenId}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.tokens && data.tokens.length > 0) {
            return data.tokens[0].balance;
        }
    } catch (e) {
        console.warn("RESCUE HTS: Mirror Node fetch failed", e.message);
    }
    return 0;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const logId = body.logId;

        const accountId = process.env.HEDERA_ACCOUNT_ID;
        const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
        if (!accountId || !privateKeyStr) return NextResponse.json({ error: "Hedera credentials missing" }, { status: 500 });

        const sanitizedKey = privateKeyStr.startsWith("0x") ? privateKeyStr.slice(2) : privateKeyStr;
        const privateKey = PrivateKey.fromStringECDSA(sanitizedKey);
        const client = Client.forTestnet().setOperator(accountId, privateKey);

        const wasteLog = await prisma.wasteLog.findUnique({ where: { id: logId } });
        if (wasteLog && wasteLog.status === "MINTED") {
            return NextResponse.json({ error: "Credits already minted" }, { status: 400 });
        }

        const effectiveWeight = wasteLog ? wasteLog.weight : 25;
        const tokenId = process.env.HTS_TOKEN_ID || "0.0.8229487";
        const amountToMint = Math.floor(effectiveWeight);

        if (amountToMint <= 0) throw new Error("Weight too low");

        const mintTx = new TokenMintTransaction().setTokenId(tokenId).setAmount(amountToMint);
        const mintResp = await mintTx.execute(client);

        if (wasteLog) {
            await prisma.$transaction([
                prisma.wasteLog.update({
                    where: { id: logId },
                    data: {
                        status: "MINTED",
                        htsTransactionId: mintResp.transactionId.toString()
                    }
                }),
                ...(wasteLog.recyclerId ? [
                    prisma.recyclerProfile.update({
                        where: { userId: wasteLog.recyclerId },
                        data: {
                            prcBalance: { increment: amountToMint }
                        }
                    })
                ] : [])
            ]);
        }

        return NextResponse.json({
            success: true,
            tokenId,
            mintedAmount: amountToMint,
            transactionId: mintResp.transactionId.toString(),
            dbStatus: wasteLog ? "MINTED" : "DEMO_MINT_SUCCESS",
            status: "MINTED"
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const accountId = process.env.HEDERA_ACCOUNT_ID || "0.0.8215683";
        const tokenId = process.env.HTS_TOKEN_ID || "0.0.8229487";

        const whereClause = { status: "VERIFIED" };
        if (userId) whereClause.recyclerId = userId;

        const logs = await prisma.wasteLog.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        // Calculate user-specific minted total from database
        let userMintedTotal = 0;
        if (userId) {
            const mintedLogs = await prisma.wasteLog.findMany({
                where: {
                    recyclerId: userId,
                    status: "MINTED"
                },
                select: { weight: true }
            });
            userMintedTotal = mintedLogs.reduce((sum, log) => sum + log.weight, 0);
        }

        const tokenBalance = await getMirrorBalance(accountId, tokenId);

        return NextResponse.json({
            success: true,
            logs: logs.length > 0 ? logs : [],
            tokenBalance,
            userMintedTotal,
            tokenId
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
