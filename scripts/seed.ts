import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const staffPassword = await bcrypt.hash('javas2024!', 12)
  const clientPassword = await bcrypt.hash('client123', 12)

  // Upsert staff user
  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      password: staffPassword,
      role: 'STAFF',
      clientName: null,
    },
  })
  console.log(`✓ Staff user: ${staff.username}`)

  // Upsert demo client
  const client = await prisma.user.upsert({
    where: { username: 'delta_private' },
    update: {},
    create: {
      username: 'delta_private',
      password: clientPassword,
      role: 'CLIENT',
      clientName: 'Delta Private Charter',
    },
  })
  console.log(`✓ Client user: ${client.username} (${client.clientName})`)

  // Sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: client.id,
      providerName: 'Delta Private Charter',
      flightNumber: 'DL4821',
      departureTime: new Date('2025-09-15T14:30:00'),
      passengerCount: 8,
      deliveryLocation: "Albany Int'l Airport — FBO Terminal B",
      foodDetails:
        '8x Artisan Charcuterie Boards\n8x Seasonal Fruit Platters\n16x Sparkling Water (500ml)\n8x House Blend Coffee (hot, to-go)\n4x Assorted Pastry Boxes\nDietary: 2 gluten-free, 1 vegan',
      specialNotes:
        'Please wrap all items individually. Delivery 90 minutes before departure.',
      status: 'CONFIRMED',
    },
  })
  console.log(`✓ Order 1: ${order1.flightNumber} (${order1.status})`)

  const order2 = await prisma.order.create({
    data: {
      userId: client.id,
      providerName: 'Delta Private Charter',
      flightNumber: 'DL9203',
      departureTime: new Date('2025-09-20T08:00:00'),
      passengerCount: 4,
      deliveryLocation: "Albany Int'l Airport — Executive Lounge",
      foodDetails:
        '4x Full Breakfast Boxes (eggs, toast, fruit, yogurt)\n4x Freshly Brewed Coffee\n4x Orange Juice (fresh squeezed)\n1x Mixed Berry Smoothie',
      specialNotes: '',
      status: 'PENDING',
    },
  })
  console.log(`✓ Order 2: ${order2.flightNumber} (${order2.status})`)

  console.log('\n✅ Seed complete!')
  console.log('\nLogin credentials:')
  console.log('  Staff  → username: staff       | password: javas2024!')
  console.log('  Client → username: delta_private | password: client123')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
