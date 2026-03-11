/**
 * Mock Hedera Token Service
 * Simulates the minting and transfer of Plastic Recycling Credits (PRC).
 */

export class MockHtsService {
  private prcTokenId: string;

  constructor() {
    // A mock token ID representing the main PRC token for the platform
    this.prcTokenId = "0.0.98765";
  }

  /**
   * Mints tokens based on weight (e.g., 10kg = 10 tokens)
   */
  async mintTokens(weight: number): Promise<{ serialNumbers: number[], transactionId: string }> {
    const amount = Math.floor(weight); // 1 token per full KG
    const serialNumbers = Array.from({ length: amount }, (_, i) => Date.now() + i);
    const transactionId = `0.0.54321@${Date.now()}`;

    console.log(`[HTS MOCK] Minted ${amount} PRC tokens (Token ID: ${this.prcTokenId})`);
    
    return { serialNumbers, transactionId };
  }

  /**
   * Transfers tokens from one mock account to another
   */
  async transferTokens(fromSetup: string, toSetup: string, amount: number): Promise<string> {
    const transactionId = `0.0.54321@${Date.now()}`;
    
    console.log(`[HTS MOCK] Transferred ${amount} PRC from ${fromSetup} to ${toSetup}`);
    
    return transactionId;
  }
}

export const htsService = new MockHtsService();
