const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkMarketplaceState() {
    const listings = await prisma.recyclerProfile.findMany({
        where: { prcBalance: { gt: 0 } },
        include: { user: true }
    });

    console.log(`Found ${listings.length} listings`);
    for (const l of listings) {
        const logs = await prisma.wasteLog.findMany({
            where: { 
                recyclerId: l.userId,
                status: { in: ['VERIFIED', 'MINTED', 'ACCEPTED'] }
            }
        });
        console.log(`- Recycler: ${l.businessName} (${l.userId}), Balance: ${l.prcBalance}, Recent Logs: ${logs.length}`);
    }
}

checkMarketplaceState()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
