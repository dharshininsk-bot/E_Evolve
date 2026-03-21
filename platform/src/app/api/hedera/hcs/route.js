import { NextResponse } from "next/server";
import { 
  Client, 
  TopicMessageSubmitTransaction,
  TopicCreateTransaction,
  PrivateKey
} from "@hashgraph/sdk";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { logId } = await request.json();

    if (!logId) {
      return NextResponse.json({ error: "Log ID is required" }, { status: 400 });
    }

    const log = await prisma.wasteLog.findUnique({
      where: { id: logId }
    });

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    // Hedera Logic
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
    let topicId = process.env.HEDERA_TOPIC_ID || "0.0.8229276";
    const sanitizedKey = privateKeyStr.startsWith("0x") ? privateKeyStr.slice(2) : privateKeyStr;
    const privateKey = PrivateKey.fromStringECDSA(sanitizedKey);
    const client = Client.forTestnet().setOperator(accountId, privateKey);

    let txResponse, receipt;
    const messagePayload = {
      weight: log.weight,
      plasticType: log.plasticType,
      logId: log.id,
      recyclerId: log.recyclerId || "UNKNOWN",
      timestamp: new Date().toISOString()
    };

    try {
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(messagePayload));
      txResponse = await transaction.execute(client);
      receipt = await txResponse.getReceipt(client);
    } catch (hcsError) {
      if (hcsError.message.includes("INVALID_TOPIC_ID")) {
        const createTx = new TopicCreateTransaction().setTopicMemo("EVOLVE Topic");
        const createResp = await createTx.execute(client);
        const createReceipt = await createResp.getReceipt(client);
        topicId = createReceipt.topicId.toString();

        const retryTx = new TopicMessageSubmitTransaction()
          .setTopicId(topicId)
          .setMessage(JSON.stringify(messagePayload));
        txResponse = await retryTx.execute(client);
        receipt = await retryTx.getReceipt(client);
      } else {
        throw hcsError;
      }
    }

    const sequenceNumber = receipt.topicSequenceNumber.toString();
    const transactionId = txResponse.transactionId.toString();

    await prisma.wasteLog.update({
      where: { id: logId },
      data: { status: "VERIFIED", hcsSequenceNumber: sequenceNumber }
    });

    return NextResponse.json({
      success: true,
      sequenceNumber,
      transactionId,
      logId,
      dbStatus: "VERIFIED",
      topicId
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
