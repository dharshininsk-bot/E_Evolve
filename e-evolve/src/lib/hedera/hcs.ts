/**
 * Mock Hedera Consensus Service
 * Provides a fallback for local testing without an active testnet account.
 * Logs messages simulate HCS topic submission.
 */

export class MockHcsService {
  private mockTopicId: string;

  constructor() {
    this.mockTopicId = `0.0.${Math.floor(Math.random() * 10000) + 10000}`;
  }

  async createTopic(memo: string): Promise<string> {
    console.log(`[HCS MOCK] Created Topic: ${this.mockTopicId} with memo: ${memo}`);
    return this.mockTopicId;
  }

  async submitMessage(topicId: string, message: string): Promise<{ sequenceNumber: number, transactionId: string }> {
    const sequenceNumber = Math.floor(Math.random() * 1000);
    const transactionId = `0.0.12345@${Date.now()}`;
    
    console.log(`[HCS MOCK] Submitted to Topic ${topicId}`);
    console.log(`[HCS MOCK] Message:`, JSON.parse(message));
    console.log(`[HCS MOCK] Seq: ${sequenceNumber}, TxId: ${transactionId}`);
    
    return { sequenceNumber, transactionId };
  }
}

export const hcsService = new MockHcsService();
