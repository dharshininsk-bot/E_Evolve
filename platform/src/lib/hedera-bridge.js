const { 
  Client, 
  TopicMessageSubmitTransaction,
  PrivateKey
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    const messageStr = process.argv[2];
    if (!messageStr) {
        console.error(JSON.stringify({ error: "No message provided" }));
        process.exit(1);
    }

    try {
        const accountId = process.env.HEDERA_ACCOUNT_ID;
        let privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
        const topicId = process.env.HEDERA_TOPIC_ID;

        if (!accountId || !privateKeyStr || !topicId) {
            console.error(JSON.stringify({ error: "Missing env credentials or topic ID" }));
            process.exit(1);
        }

        // Sanitize: Strip leading 0x if present
        const sanitizedKey = privateKeyStr.startsWith("0x") ? privateKeyStr.slice(2) : privateKeyStr;
        const privateKey = PrivateKey.fromStringECDSA(sanitizedKey);

        const client = Client.forTestnet();
        client.setOperator(accountId, privateKey);

        const transaction = new TopicMessageSubmitTransaction()
            .setTopicId(topicId)
            .setMessage(messageStr);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);
        
        console.log(JSON.stringify({
            success: true,
            sequenceNumber: receipt.topicSequenceNumber.toString(),
            transactionId: txResponse.transactionId.toString(),
            topicId: topicId
        }));
        process.exit(0);
    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        process.exit(1);
    }
}

main();
