const { PrismaClient } = require("@prisma/client");
<<<<<<< HEAD
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    try {
        const consumer = await prisma.user.upsert({
            where: { email: "demo.consumer@evolve.com" },
            update: {},
            create: {
                email: "demo.consumer@evolve.com",
                role: "CONSUMER",
            }
        });
        fs.writeFileSync('diagnose_output.txt', JSON.stringify(consumer, null, 2));
    } catch(err) {
        fs.writeFileSync('diagnose_output.txt', err.message + '\n\n' + err.stack);
    }
}
=======
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
    const profiles = await prisma.recyclerProfile.findMany();
    console.log("Profiles found:", profiles.length);
    if (profiles.length > 0) {
      console.log("First profile location:", profiles[0].location);
    }
  } catch (err) {
    console.error("Prisma Direct Test Failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

>>>>>>> 96c684204a85d8db483cbbbe193125389cbff8ed
main();
