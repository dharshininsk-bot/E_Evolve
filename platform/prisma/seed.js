import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo recyclers...')

  const recyclers = [
    {
      email: 'adyar.recycling@evolve.com',
      businessName: 'Adyar Green Recyclers',
      location: 'Adyar',
      rates: {
        PET: 12,
        HDPE: 15,
        LDPE: 10,
        PP: 8
      }
    },
    {
     email: 'guindy.plastic@evolve.com',
     businessName: 'Guindy Industrial Plastics',
     location: 'Guindy',
     rates: {
       PET: 14,
       HDPE: 16,
       LDPE: 11,
       PP: 9
     }
    },
    {
      email: 'velachery.scrap@evolve.com',
      businessName: 'Velachery Scrap & Recycle',
      location: 'Velachery',
      rates: {
        PET: 10,
        HDPE: 12,
        LDPE: 8,
        PP: 6
      }
    }
  ]

  for (const r of recyclers) {
    let user = await prisma.user.findUnique({
      where: { email: r.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: r.email,
          role: 'RECYCLER'
        }
      })
    }

    await prisma.recyclerProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: r.businessName,
        location: r.location,
        rates: JSON.stringify(r.rates)
      },
      create: {
        userId: user.id,
        businessName: r.businessName,
        location: r.location,
        rates: JSON.stringify(r.rates)
      }
    })
  }

  console.log('Demo seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
