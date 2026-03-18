const { PrismaClient } = require("@prisma/client");
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

main();
