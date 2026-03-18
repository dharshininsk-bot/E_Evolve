const { 
  Client, 
  TokenInfoQuery, 
  TokenId,
  AccountBalanceQuery,
  AccountId,
  PrivateKey
} = require("@hashgraph/sdk");

async function main() {
    const accountId = "0.0.8215683";
    const privateKeyStr = "0xd87e0bdd9c5c8ced1660c3fe0234a73c9041f9446a884f86fe0e5140ba665c5f";
    const tokenIdStr = "0.0.8229487";

    const sanitizedKey = privateKeyStr.startsWith("0x") ? privateKeyStr.slice(2) : privateKeyStr;
    const privateKey = PrivateKey.fromStringECDSA(sanitizedKey);

    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    try {
        const tokenId = TokenId.fromString(tokenIdStr);
        
        console.log(`Auditing Token: ${tokenIdStr}...`);
        const info = await new TokenInfoQuery()
            .setTokenId(tokenId)
            .execute(client);
        
        console.log("Token Information:");
        console.log("- Name:", info.name);
        console.log("- Symbol:", info.symbol);
        console.log("- Total Supply:", info.totalSupply.toString());
        console.log("- Treasury:", info.treasuryAccountId.toString());

        console.log("\nAuditing Account Balance...");
        const balance = await new AccountBalanceQuery()
            .setAccountId(accountId)
            .execute(client);
        
        const tokenBalance = balance.tokens.get(tokenId)?.toNumber() || 0;
        console.log(`- Account ${accountId} Balance: ${tokenBalance} PLSTC`);

    } catch (err) {
        console.error("Audit failed:", err);
    }
}

main();
