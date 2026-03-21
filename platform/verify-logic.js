const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyLogic() {
    const testEmail = 'test-recycler-logic-123@example.com';

    console.log('--- Phase 0: Create Temporary User ---');
    const user = await prisma.user.upsert({
        where: { email: testEmail },
        update: {},
        create: {
            email: testEmail,
            role: 'RECYCLER'
        }
    });
    console.log('User created/found:', user.id);

    const testUserId = user.id;

    console.log('\n--- Phase 1: Verify Initial State (Should be null if it was newly created) ---');
    // Ensure no profile exists for this user initially for a clean test
    await prisma.recyclerProfile.deleteMany({ where: { userId: testUserId } });

    const initialProfile = await prisma.recyclerProfile.findUnique({
        where: { userId: testUserId }
    });
    console.log('Initial Profile:', initialProfile);

    console.log('\n--- Phase 2: Simulate PUT (Upsert) ---');
    const location = 'Adyar';
    const rates = { PET: 15, HDPE: 18, LDPE: 12, PP: 10 };
    
    const upsertedProfile = await prisma.recyclerProfile.upsert({
        where: { userId: testUserId },
        update: {
            location,
            rates: JSON.stringify(rates)
        },
        create: {
            userId: testUserId,
            location,
            rates: JSON.stringify(rates),
            businessName: "Test Recycler Business",
            prcBalance: 0
        }
    });
    console.log('Upserted Profile:', JSON.stringify(upsertedProfile, null, 2));

    console.log('\n--- Phase 3: Verify Fetch after Upsert ---');
    const fetchedProfile = await prisma.recyclerProfile.findUnique({
        where: { userId: testUserId }
    });
    console.log('Fetched Profile Location:', fetchedProfile.location);
    console.log('Fetched Profile Rates:', fetchedProfile.rates);

    console.log('\n--- Phase 4: Cleaning up ---');
    await prisma.recyclerProfile.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    console.log('Cleanup complete.');
}

verifyLogic()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
