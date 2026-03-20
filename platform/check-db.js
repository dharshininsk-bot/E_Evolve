const { PrismaClient } = require("@prisma/client");

async function main() {
    process.env.DATABASE_URL = "file:c:/Users/Admin/.gemini/antigravity/scratch/EVOLVE/platform/prisma/dev.db";
    
    // Simplest possible Prisma init for CLI
    const prisma = new PrismaClient();
    
    try {
        console.log("Querying database...");
        const logs = await prisma.wasteLog.findMany({
            orderBy: { id: 'desc' }
        });
        
        console.log("\nWaste Logs Summary:");
        console.table(logs.map(l => ({
            id: l.id,
            weight: l.weight,
            type: l.plasticType,
            status: l.status,
            hcsSeq: l.hcsSequenceNumber
        })));
        
    } catch (err) {
        console.error("Prisma CLI Error:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
