const { 
  Client, 
  TokenAssociateTransaction, 
  PrivateKey 
} = require("@hashgraph/sdk");

async function main() {
    const accountId = "0.0.8215683";
    const privateKeyStr = "0xd87e0bdd9c5c8ced1660c3fe0234a73c9041f9446a884f86fe0e5140ba665c5f";
    const tokenId = "0.0.8229487";

    const sanitizedKey = privateKeyStr.startsWith("0x") ? privateKeyStr.slice(2) : privateKeyStr;
    const privateKey = PrivateKey.fromStringECDSA(sanitizedKey);

    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    console.log(`Associating account ${accountId} with token ${tokenId}...`);
    try {
        const transaction = new TokenAssociateTransaction()
            .setAccountId(accountId)
            .setTokenIds([tokenId]);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);
        
        console.log("SUCCESS! Association Transaction ID:", txResponse.transactionId.toString());
        console.log("Link to HashScan:");
        console.log(`https://hashscan.io/testnet/transaction/${txResponse.transactionId.toString().replace(/@/, "-").replace(/\./, "-")}`);
        
    } catch (err) {
        if (err.message.includes("TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT")) {
            console.log("Account is already associated with this token.");
        } else {
            console.error("Failed to associate token:", err);
        }
    }
}

main();
