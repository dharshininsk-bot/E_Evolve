async function main() {
    const resp = await fetch("http://localhost:3000/api/hedera/hts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: "demo-verified-01" })
    });
    const result = await resp.json();
    console.log(JSON.stringify(result, null, 2));
}
main();
