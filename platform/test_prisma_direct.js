const { PrismaClient } = require("@prisma/client");
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  try {
    // Part 1: Upsert demo consumer
    const consumer = await prisma.user.upsert({
      where: { email: "demo.consumer@evolve.com" },
      update: {},
      create: {
        email: "demo.consumer@evolve.com",
        role: "CONSUMER",
      }
    });
    console.log("Upserted demo consumer:", consumer.email);
    fs.writeFileSync('diagnose_output.txt', JSON.stringify(consumer, null, 2));

    // Part 2: Fetch and log current state
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
    const profiles = await prisma.recyclerProfile.findMany();
    console.log("Profiles found:", profiles.length);
    if (profiles.length > 0) {
      console.log("First profile location:", profiles[0].location);
    }
  } catch (err) {
    console.error("Prisma Direct Test Failed:", err);
    fs.writeFileSync('diagnose_output.txt', err.message + '\n\n' + err.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();
