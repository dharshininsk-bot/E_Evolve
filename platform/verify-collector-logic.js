const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyCollectorLogic() {
    const testEmail1 = 'collector-test-1@example.com';
    const testEmail2 = 'collector-test-2@example.com';
    const testRecyclerEmail = 'recycler-test@example.com';

    console.log('--- Phase 0: Setup Users ---');
    const collector1 = await prisma.user.upsert({
        where: { email: testEmail1 },
        update: {},
        create: { email: testEmail1, role: 'COLLECTOR' }
    });
    const collector2 = await prisma.user.upsert({
        where: { email: testEmail2 },
        update: {},
        create: { email: testEmail2, role: 'COLLECTOR' }
    });
    const recycler = await prisma.user.upsert({
        where: { email: testRecyclerEmail },
        update: {},
        create: { email: testRecyclerEmail, role: 'RECYCLER' }
    });
    console.log('Users setup complete.');

    console.log('\n--- Phase 1: Create Request from Collector 1 ---');
    const log1 = await prisma.wasteLog.create({
        data: {
            weight: 10,
            plasticType: 'PET',
            status: 'REQUESTED',
            collectorId: collector1.id,
            recyclerId: recycler.id
        }
    });
    console.log('Log 1 created with collector:', log1.collectorId);

    console.log('\n--- Phase 2: Create Request from Collector 2 ---');
    const log2 = await prisma.wasteLog.create({
        data: {
            weight: 20,
            plasticType: 'HDPE',
            status: 'REQUESTED',
            collectorId: collector2.id,
            recyclerId: recycler.id
        }
    });
    console.log('Log 2 created with collector:', log2.collectorId);

    console.log('\n--- Phase 3: Verify Recycler sees both correctly ---');
    const logs = await prisma.wasteLog.findMany({
        where: { recyclerId: recycler.id, status: 'REQUESTED' },
        include: { collector: { select: { email: true } } }
    });
    
    console.log('Logs found for recycler:', logs.length);
    logs.forEach(l => {
        console.log(`- Log ID: ${l.id}, Collector Email: ${l.collector.email}, Type: ${l.plasticType}`);
    });

    const emails = logs.map(l => l.collector.email);
    if (emails.includes(testEmail1) && emails.includes(testEmail2)) {
        console.log('\nSUCCESS: Both collectors are correctly represented!');
    } else {
        console.log('\nFAILURE: One or both collectors are missing or incorrect.');
    }

    console.log('\n--- Phase 4: Cleaning up ---');
    await prisma.wasteLog.deleteMany({ where: { id: { in: [log1.id, log2.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [collector1.id, collector2.id, recycler.id] } } });
    console.log('Cleanup complete.');
}

verifyCollectorLogic()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
