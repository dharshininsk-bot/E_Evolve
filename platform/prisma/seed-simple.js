const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Starting seed process...');
  process.env.DATABASE_URL = "file:e:/Academics/EEvolve/E_Evolve/platform/prisma/dev.db";
  const prisma = new PrismaClient();
  
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    
    console.log('Cleaning up existing data...');
    // Delete in correct order
    await prisma.creditTransaction.deleteMany({});
    await prisma.milestone.deleteMany({});
    await prisma.wasteLog.deleteMany({});
    await prisma.recyclerProfile.deleteMany({});
    await prisma.user.deleteMany({});

    // 1. Consumers
    const consumers = [];
    for (let i = 1; i <= 3; i++) {
        const user = await prisma.user.create({ data: { email: `consumer${i}@evolve.com`, role: 'CONSUMER' } });
        consumers.push(user);
    }
    console.log('Consumers created');

    // 2. Collectors
    const collectors = [];
    for (let i = 1; i <= 3; i++) {
        const user = await prisma.user.create({ data: { email: `collector${i}@evolve.com`, role: 'COLLECTOR' } });
        collectors.push(user);
    }
    console.log('Collectors created');

    // 3. Recyclers
    const recyclerData = [
        { email: 'adyar.recycling@evolve.com', name: 'Adyar Green Recyclers', loc: 'Adyar' },
        { email: 'guindy.plastic@evolve.com', name: 'Guindy Industrial Plastics', loc: 'Guindy' },
        { email: 'velachery.scrap@evolve.com', name: 'Velachery Scrap & Recycle', loc: 'Velachery' }
    ];
    const recyclers = [];
    for (const r of recyclerData) {
        const user = await prisma.user.create({ data: { email: r.email, role: 'RECYCLER' } });
        await prisma.recyclerProfile.create({
            data: {
                userId: user.id,
                businessName: r.name,
                location: r.loc,
                rates: JSON.stringify({ PET: 12, HDPE: 15, LDPE: 10, PP: 8 }),
                prcBalance: 500
            }
        });
        recyclers.push(user);
    }
    console.log('Recyclers created');

    // 4. Producers
    const producers = [];
    for (let i = 1; i <= 3; i++) {
        const user = await prisma.user.create({ data: { email: `producer${i}@evolve.com`, role: 'PRODUCER', creditsPurchased: i * 100 } });
        producers.push(user);
    }
    console.log('Producers created');

    // Waste Logs
    await prisma.wasteLog.create({
        data: { weight: 10, plasticType: 'PET', status: 'VERIFIED', collectorId: collectors[0].id, consumerId: consumers[0].id, recyclerId: recyclers[0].id, district: 'Adyar' }
    });
    console.log('Waste logs created');

    // Credit Transactions
    await prisma.creditTransaction.create({
        data: { producerId: producers[0].id, recyclerId: recyclers[0].id, amount: 100, amountUsd: 50 }
    });
    console.log('Transactions created');

    console.log('Seed successful!');
  } catch (err) {
    console.error('SEED ERROR:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
