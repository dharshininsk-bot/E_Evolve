const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function generateLegacyMilestones() {
    console.log('--- Generating Legacy Milestones ---');
    const consumers = await prisma.user.findMany({
        where: { role: 'CONSUMER' },
        include: {
            wasteLogs: true,
            milestones: true
        }
    });

    for (const consumer of consumers) {
        const totalWeight = consumer.wasteLogs.reduce((sum, l) => sum + l.weight, 0);
        const reachedMilestones = consumer.milestones.map(m => m.totalWeight);
        
        const maxMilestone = Math.floor(totalWeight / 10);
        
        for (let m = 1; m <= maxMilestone; m++) {
            const milestoneWeight = m * 10;
            if (!reachedMilestones.includes(milestoneWeight)) {
                console.log(`Generating milestone for ${consumer.email}: ${milestoneWeight}kg`);
                await prisma.milestone.create({
                    data: {
                        userId: consumer.id,
                        totalWeight: milestoneWeight,
                        couponCode: `EVOLVE-SAVE-${milestoneWeight}-${Math.random().toString(36).substring(7).toUpperCase()}`
                    }
                });
            }
        }
    }
    console.log('Done!');
}

generateLegacyMilestones()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
