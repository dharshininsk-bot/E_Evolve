const { 
  Client, 
  TokenCreateTransaction, 
  TokenType, 
  TokenSupplyType, 
  PrivateKey 
} = require("@hashgraph/sdk");
const fs = require("fs");
const path = require("path");

async function main() {
    const accountId = "0.0.8215683";
    const privateKeyStr = "0xd87e0bdd9c5c8ced1660c3fe0234a73c9041f9446a884f86fe0e5140ba665c5f";
    const sanitizedKey = privateKeyStr.startsWith("0x") ? privateKeyStr.slice(2) : privateKeyStr;
    const privateKey = PrivateKey.fromStringECDSA(sanitizedKey);

    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    console.log("Creating Recycling Credit Token...");
    try {
        const transaction = new TokenCreateTransaction()
            .setTokenName("Recycling Credit")
            .setTokenSymbol("PLSTC")
            .setTokenType(TokenType.FungibleCommon)
            .setSupplyType(TokenSupplyType.Infinite)
            .setInitialSupply(0)
            .setTreasuryAccountId(accountId)
            .setAdminKey(privateKey)
            .setSupplyKey(privateKey)
            .setDecimals(0)
            .setTokenMemo("EVOLVE Recycling Credit Token");

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);
        const tokenId = receipt.tokenId.toString();
        
        console.log("SUCCESS! TOKEN ID:", tokenId);
        
        // Append to .env
        const envPath = path.join(process.cwd(), ".env");
        let envContent = fs.readFileSync(envPath, "utf8");
        if (!envContent.includes("HEDERA_TOKEN_ID")) {
            envContent += `\nHEDERA_TOKEN_ID=${tokenId}\n`;
            fs.writeFileSync(envPath, envContent);
            console.log("Updated .env with HEDERA_TOKEN_ID");
        }
    } catch (err) {
        console.error("Failed to create token:", err);
    }
}

main();
