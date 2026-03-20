const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Database with Dummy Data...");

    // 1. Create a demo consumer
    const consumer = await prisma.user.upsert({
        where: { email: "demo.consumer@evolve.com" },
        update: {},
        create: {
            email: "demo.consumer@evolve.com",
            role: "CONSUMER",
        }
    });
    console.log("Created Consumer ID:", consumer.id);

    // 2. Clear old collectors
    await prisma.collectorProfile.deleteMany();
    await prisma.user.deleteMany({
        where: { role: "COLLECTOR", email: { startsWith: "mock" } }
    });

    // 3. Create dummy collectors based on the new regions
    const regions = ["Guindy", "Adyar", "Velachery", "Tambaram"];
    const collectorsToCreate = regions.map((r, idx) => ({
        email: `mock.collector.${idx}@evolve.com`,
        role: "COLLECTOR",
        collectorProfile: {
            create: {
                region: r,
                collectionTime: "09:00 AM - 04:00 PM",
                wasteType: idx % 2 === 0 ? "PET, HDPE" : "All Plastics"
            }
        }
    }));

    for (const data of collectorsToCreate) {
        await prisma.user.create({ data });
    }
    console.log(`Created ${regions.length} Collectors with Profiles.`);

    // 4. Create dummy waste logs for the consumer so they have points
    // Let's create two VERIFIED logs -> 2.5kg and 5.0kg -> 75 points
    await prisma.wasteLog.createMany({
        data: [
            {
                consumerId: consumer.id,
                collectorId: (await prisma.user.findFirst({where: {role: "COLLECTOR"}})).id, // just pick first
                weight: 2.5,
                plasticType: "PET",
                status: "VERIFIED"
            },
            {
                consumerId: consumer.id,
                collectorId: (await prisma.user.findFirst({where: {role: "COLLECTOR"}})).id, 
                weight: 5.0,
                plasticType: "HDPE",
                status: "VERIFIED"
            }
        ]
    });
    console.log("Created 2 Verified Waste Logs for consumer (total 7.5kg -> 75 points).");

    console.log("\nSeed Successful!");
    console.log("-----------------------------------------");
    console.log("USE THIS ID IN COLLECTOR DASHBOARD:", consumer.id);
    console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
