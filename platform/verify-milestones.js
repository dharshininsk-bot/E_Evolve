const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyMilestones() {
    const testEmail = 'milestone-test@example.com';
    const collectorEmail = 'collector-milestone@example.com';

    console.log('--- Phase 0: Setup ---');
    const consumer = await prisma.user.upsert({
        where: { email: testEmail },
        update: {},
        create: { email: testEmail, role: 'CONSUMER' }
    });
    const collector = await prisma.user.upsert({
        where: { email: collectorEmail },
        update: {},
        create: { email: collectorEmail, role: 'COLLECTOR' }
    });
    
    // Clean start
    await prisma.milestone.deleteMany({ where: { userId: consumer.id } });
    await prisma.wasteLog.deleteMany({ where: { consumerId: consumer.id } });

    console.log('\n--- Phase 1: Log 8kg (No milestone) ---');
    // Simulate what the API does
    const log1 = await prisma.wasteLog.create({
        data: { weight: 8, plasticType: 'PET', status: 'VERIFIED', consumerId: consumer.id, collectorId: collector.id }
    });
    await checkMilestones(consumer.id, 8);
    let milestones = await prisma.milestone.findMany({ where: { userId: consumer.id } });
    console.log('Milestones found:', milestones.length);

    console.log('\n--- Phase 2: Log 5kg (Total 13kg -> Milestone 10 reached) ---');
    const log2 = await prisma.wasteLog.create({
        data: { weight: 5, plasticType: 'HDPE', status: 'VERIFIED', consumerId: consumer.id, collectorId: collector.id }
    });
    await checkMilestones(consumer.id, 5);
    milestones = await prisma.milestone.findMany({ where: { userId: consumer.id } });
    console.log('Milestones found:', milestones.length);
    milestones.forEach(m => console.log(`- Milestone: ${m.totalWeight}kg, Coupon: ${m.couponCode}`));

    console.log('\n--- Phase 3: Log 20kg (Total 33kg -> Milestones 20 and 30 reached) ---');
    const log3 = await prisma.wasteLog.create({
        data: { weight: 20, plasticType: 'LDPE', status: 'VERIFIED', consumerId: consumer.id, collectorId: collector.id }
    });
    await checkMilestones(consumer.id, 20);
    milestones = await prisma.milestone.findMany({ where: { userId: consumer.id }, orderBy: { totalWeight: 'asc' } });
    console.log('Milestones found:', milestones.length);
    milestones.forEach(m => console.log(`- Milestone: ${m.totalWeight}kg, Coupon: ${m.couponCode}`));

    console.log('\n--- Phase 4: Cleanup ---');
    await prisma.milestone.deleteMany({ where: { userId: consumer.id } });
    await prisma.wasteLog.deleteMany({ where: { consumerId: consumer.id } });
    await prisma.user.deleteMany({ where: { id: { in: [consumer.id, collector.id] } } });
    console.log('Cleanup complete.');
}

// Helper duplicating the API logic
async function checkMilestones(userId, addedWeight) {
    const allLogs = await prisma.wasteLog.findMany({ where: { consumerId: userId } });
    const totalWeight = allLogs.reduce((sum, l) => sum + l.weight, 0);
    const weightBefore = totalWeight - addedWeight;
    const mBefore = Math.floor(weightBefore / 10);
    const mNow = Math.floor(totalWeight / 10);
    
    if (mNow > mBefore) {
        for (let m = mBefore + 1; m <= mNow; m++) {
            await prisma.milestone.create({
                data: {
                    userId: userId,
                    totalWeight: m * 10,
                    couponCode: `TEST-COUPON-${m*10}`
                }
            });
        }
    }
}

verifyMilestones()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
