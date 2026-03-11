const fs = require('fs');
const http = require('http');

console.log("==========================================");
console.log("   E-Evolve IoT Smart Bin Simulator       ");
console.log("==========================================");

const PLASTIC_TYPES = ["PET", "HDPE", "PVC", "LDPE", "PP", "PS", "OTHER"];
const LOCATIONS = ["Downtown Bin #44", "Northside Bin #12", "Eastgate Bin #8", "City Center Metro #1"];

function generateRandomDeposit() {
  return {
    consumerId: "consumer-mock-" + Math.floor(Math.random() * 1000),
    weight: parseFloat((Math.random() * 5 + 0.5).toFixed(2)), // 0.5kg to 5.5kg
    type: PLASTIC_TYPES[Math.floor(Math.random() * PLASTIC_TYPES.length)],
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    timestamp: new Date().toISOString()
  };
}

// Save a local JSON flow file for documentation purposes.
function saveFlowExample() {
    const exampleFlow = {
        step1_consumer_deposit: generateRandomDeposit(),
        step2_collection_batch: {
            collectorId: "collector-mock-200",
            plasticLogIds: ["req-101", "req-102"],
            totalWeight: 14.2
        },
        step3_cycler_verify: {
            recyclerId: "recycler-green-city",
            batchId: "B-2948",
            verifiedWeight: 14.1,
            quality: "HIGH"
        },
        step4_hts_minting: {
            tokenId: "0.0.98765",
            amount: 14,
            transactionId: "0.0.122@1678877600"
        },
        step5_producer_purchase: {
            producerId: "producer-ecopack",
            creditIds: ["CRD-9001", "CRD-9002"],
            transactionId: "0.0.999@1678881200"
        }
    };

    fs.writeFileSync('./example-flows.json', JSON.stringify(exampleFlow, null, 2));
    console.log("✓ Saved example JSON flows to ./example-flows.json");
}

saveFlowExample();

/* 
 * If running the Next.js server, this function can actually post to it.
 * Not active by default to prevent port conflicts if Next isn't running.
 */
function sendDepositToAPI(deposit) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/iot/ingest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, res => {
    console.log(`[POST /api/iot/ingest] Output Status: ${res.statusCode}`);
  });

  req.on('error', error => {
    console.error(`[Simulation API Error] Next.js server might not be running.`);
  });

  req.write(JSON.stringify(deposit));
  req.end();
}

console.log("\nSimulator initialized. To run active api tests, uncomment the interval in this script.");
// setInterval(() => {
//    const deposit = generateRandomDeposit();
//    console.log(`\n> Simulating IoT Drop at ${deposit.location}...`);
//    sendDepositToAPI(deposit);
// }, 10000);
