import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  AccountBalanceQuery,
  PrivateKey
} from "@hashgraph/sdk";
import path from "path";

// Helper to initialize the Hedera Client
export const getHederaClient = () => {
  try {
    console.log("SDK: Initializing client...");
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    let privateKeyStr = process.env.HEDERA_PRIVATE_KEY;

    if (!accountId || !privateKeyStr) {
      throw new Error("Hedera account ID and private key missing in env");
    }

    // Sanitize: Strip leading 0x if present
    const sanitizedKey = privateKeyStr.startsWith("0x") ? privateKeyStr.slice(2) : privateKeyStr;
    console.log("SDK: Parsing ECDSA private key (sanitized length: " + sanitizedKey.length + ")");
    const privateKey = PrivateKey.fromStringECDSA(sanitizedKey);

    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);
    console.log("SDK: Client initialized for operator " + accountId);
    return client;
  } catch (error) {
    console.error("SDK: Failed to initialize client", error);
    throw error;
  }
};

// Get Account Balance
export const getAccountBalance = async () => {
  try {
    console.log("SDK: Fetching account balance...");
    const client = getHederaClient();
    console.log("SDK: Client ready, creating AccountBalanceQuery...");
    const query = new AccountBalanceQuery().setAccountId(process.env.HEDERA_ACCOUNT_ID);

    console.log("SDK: Executing query...");
    const balance = await query.execute(client);
    console.log("SDK: Query successful. Balance: " + balance.hbars.toString());
    return balance.hbars.toString();
  } catch (error) {
    console.error("SDK: Failed to query balance", error);
    throw error;
  }
};

// Get or Initialize Topic ID
export const getOrInitializeTopic = async (forceCreate = false) => {
  try {
    let topicId = process.env.HEDERA_TOPIC_ID;

    if (topicId && topicId !== "undefined" && topicId !== "" && !forceCreate) {
      console.log(`SDK: Using existing Topic ID: ${topicId}`);
      return topicId;
    }

    console.log("SDK: Creating new HCS topic...");
    const client = getHederaClient();
    const transaction = new TopicCreateTransaction().setTopicMemo("EVOLVE Waste Log");

    console.log("SDK: Executing TopicCreateTransaction...");
    const txResponse = await transaction.execute(client);

    console.log("SDK: Getting Receipt for Topic creation...");
    const receipt = await txResponse.getReceipt(client);
    topicId = receipt.topicId.toString();

    console.log(`SDK: NEW TOPIC ID CREATED = ${topicId}`);
    console.log("ACTION REQUIRED: Please update your .env with HEDERA_TOPIC_ID=" + topicId);
    return topicId;
  } catch (error) {
    console.error("SDK: Topic Initialization Failed", error);
    throw error;
  }
};

import { execSync } from "child_process";

// Submit Message to HCS via Bridge
export const submitHcsMessage = async (message) => {
  try {
    console.log("SDK Bridge: Initiating HCS submission via external process...");
    const bridgePath = path.resolve(process.cwd(), "src/lib/hedera-bridge.js");
    const messageStr = JSON.stringify(message).replace(/"/g, '\\"');

    let output;
    try {
      output = execSync(`node "${bridgePath}" "${messageStr}"`, {
        env: { ...process.env },
        encoding: "utf8"
      });
    } catch (err) {
      const errMsg = err.stdout || err.stderr || err.message;
      console.error("Bridge Execution Error Output:", errMsg);

      if (errMsg.includes("INVALID_TOPIC_ID")) {
        console.log("SDK Bridge: Invalid Topic ID detected. Recreating topic...");
        const newTopicId = await getOrInitializeTopic(true);

        // Retry with new topic ID passed in environment
        output = execSync(`node "${bridgePath}" "${messageStr}"`, {
          env: { ...process.env, HEDERA_TOPIC_ID: newTopicId },
          encoding: "utf8"
        });
      } else {
        throw err;
      }
    }

    const result = JSON.parse(output);
    if (result.error) throw new Error(result.error);

    console.log(`SDK Bridge: Success. Sequence: ${result.sequenceNumber}`);
    return result;
  } catch (error) {
    console.error("SDK Bridge: HCS Submission Failed", error);
    throw error;
  }
};
