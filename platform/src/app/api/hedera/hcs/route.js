import { NextResponse } from "next/server";
import { 
  Client, 
  TopicMessageSubmitTransaction,
  TopicCreateTransaction,
  PrivateKey
} from "@hashgraph/sdk";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { weight, plasticType } = await request.json();

    let user = await prisma.user.findFirst({ where: { role: "COLLECTOR" } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: `demo-collector-${Date.now()}@evolve.com`, role: "COLLECTOR" }
      });
    }

    const log = await prisma.wasteLog.create({
      data: {
        weight: parseFloat(weight) || 0,
        plasticType: plasticType || "UNKNOWN",
        status: "PENDING_SYNC",
        collectorId: user.id
      }
    });
    const logId = log.id;

    // Hedera Logic
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
    let topicId = process.env.HEDERA_TOPIC_ID || "0.0.8229276";
    const sanitizedKey = privateKeyStr.startsWith("0x") ? privateKeyStr.slice(2) : privateKeyStr;
    const privateKey = PrivateKey.fromStringECDSA(sanitizedKey);
    const client = Client.forTestnet().setOperator(accountId, privateKey);

    let txResponse, receipt;
    try {
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify({ weight, plasticType, logId, timestamp: new Date().toISOString() }));
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
          .setMessage(JSON.stringify({ weight, plasticType, logId, timestamp: new Date().toISOString() }));
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
