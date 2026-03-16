async function main() {
    const resp = await fetch("http://localhost:3000/api/hedera/hcs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: "25.0", plasticType: "PET" })
    });
    const result = await resp.json();
    console.log(JSON.stringify(result, null, 2));
}
main();
