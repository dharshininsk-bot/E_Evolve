const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUserState() {
    const userId = 'cmn066o950006dy75veib6h58';
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            wasteLogs: true,
            milestones: true
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    const totalWeight = user.wasteLogs.reduce((sum, l) => sum + l.weight, 0);
    console.log(`User: ${user.email}`);
    console.log(`Total Weight: ${totalWeight}kg`);
    console.log(`Logs count: ${user.wasteLogs.length}`);
    console.log(`Milestones count: ${user.milestones.length}`);
    user.milestones.forEach(m => console.log(`- Milestone: ${m.totalWeight}kg, Coupon: ${m.couponCode}`));
}

checkUserState()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
