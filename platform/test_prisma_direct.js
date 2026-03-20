const { PrismaClient } = require("@prisma/client");
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
main();
