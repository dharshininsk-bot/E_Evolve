const { PrismaClient } = require('@prisma/client')

async function main() {
  process.env.DATABASE_URL = "file:e:/Academics/EEvolve/E_Evolve/platform/prisma/dev.db";
  const prisma = new PrismaClient()
  console.log('Cleaning up existing data...')
  // Order matters due to foreign keys
  await prisma.creditTransaction.deleteMany({})
  await prisma.milestone.deleteMany({})
  await prisma.wasteLog.deleteMany({})
  await prisma.recyclerProfile.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Seeding Users...')

  // 1. Consumers
  const consumers = []
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `consumer${i}@evolve.com`,
        role: 'CONSUMER'
      }
    })
    consumers.push(user)
    console.log(`Created Consumer: ${user.email}`)
  }

  // 2. Collectors
  const collectors = []
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `collector${i}@evolve.com`,
        role: 'COLLECTOR'
      }
    })
    collectors.push(user)
    console.log(`Created Collector: ${user.email}`)
  }

  // 3. Recyclers
  const recyclers = [
    { email: 'adyar.recycling@evolve.com', name: 'Adyar Green Recyclers', loc: 'Adyar' },
    { email: 'guindy.plastic@evolve.com', name: 'Guindy Industrial Plastics', loc: 'Guindy' },
    { email: 'velachery.scrap@evolve.com', name: 'Velachery Scrap & Recycle', loc: 'Velachery' }
  ]
  const recyclerUsers = []
  for (const r of recyclers) {
    const user = await prisma.user.create({
      data: {
        email: r.email,
        role: 'RECYCLER'
      }
    })
    await prisma.recyclerProfile.create({
      data: {
        userId: user.id,
        businessName: r.name,
        location: r.loc,
        rates: JSON.stringify({ PET: 12, HDPE: 15, LDPE: 10, PP: 8 }),
        prcBalance: 500 // Initial balance for demo
      }
    })
    recyclerUsers.push(user)
    console.log(`Created Recycler: ${user.email}`)
  }

  // 4. Producers
  const producers = []
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `producer${i}@evolve.com`,
        role: 'PRODUCER',
        creditsPurchased: 100 * i // Different progress for each
      }
    })
    producers.push(user)
    console.log(`Created Producer: ${user.email}`)
  }

  console.log('Seeding Waste Logs (Relationships)...')
  
  // Consumer 1 -> Collector 1 -> Recycler 1
  await prisma.wasteLog.create({
    data: {
      weight: 15.5,
      plasticType: 'PET',
      status: 'VERIFIED',
      consumerId: consumers[0].id,
      collectorId: collectors[0].id,
      recyclerId: recyclerUsers[0].id,
      state: 'Tamil Nadu',
      district: 'Adyar'
    }
  })

  // Consumer 2 -> Collector 1 -> Recycler 1
  await prisma.wasteLog.create({
    data: {
      weight: 8.2,
      plasticType: 'HDPE',
      status: 'MINTED',
      consumerId: consumers[1].id,
      collectorId: collectors[0].id,
      recyclerId: recyclerUsers[0].id,
      hcsSequenceNumber: '1001',
      state: 'Tamil Nadu',
      district: 'Adyar'
    }
  })

  // Consumer 1 -> Collector 2 -> Recycler 2
  await prisma.wasteLog.create({
    data: {
      weight: 12.0,
      plasticType: 'LDPE',
      status: 'ACCEPTED',
      consumerId: consumers[0].id,
      collectorId: collectors[1].id,
      recyclerId: recyclerUsers[1].id,
      state: 'Tamil Nadu',
      district: 'Guindy'
    }
  })

  // Consumer 3 -> Collector 3 -> Recycler 3 (New request)
  await prisma.wasteLog.create({
    data: {
      weight: 5.0,
      plasticType: 'PP',
      status: 'REQUESTED',
      consumerId: consumers[2].id,
      collectorId: collectors[2].id,
      recyclerId: recyclerUsers[2].id,
      state: 'Tamil Nadu',
      district: 'Velachery'
    }
  })

  console.log('Seeding Credit Transactions...')

  // Producer 1 buys from Recycler 1
  await prisma.creditTransaction.create({
    data: {
      producerId: producers[0].id,
      recyclerId: recyclerUsers[0].id,
      amount: 100,
      amountUsd: 50
    }
  })

  // Producer 1 buys from Recycler 2
  await prisma.creditTransaction.create({
    data: {
      producerId: producers[0].id,
      recyclerId: recyclerUsers[1].id,
      amount: 50,
      amountUsd: 25
    }
  })

  // Producer 2 buys from Recycler 1
  await prisma.creditTransaction.create({
    data: {
      producerId: producers[1].id,
      recyclerId: recyclerUsers[0].id,
      amount: 200,
      amountUsd: 100
    }
  })

  console.log('Full Seed Complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // We can't disconnect if we didn't initialize, but here we did
    // The previous error was probably because of this
  })
