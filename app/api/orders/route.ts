import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (session.user.role === 'STAFF') {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { username: true, clientName: true },
          },
        },
      })
      return NextResponse.json(orders)
    }

    // CLIENT: only their own orders
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()

    const {
      providerName,
      flightNumber,
      departureTime,
      passengerCount,
      deliveryLocation,
      foodDetails,
      specialNotes,
    } = body

    if (
      !providerName ||
      !flightNumber ||
      !departureTime ||
      !passengerCount ||
      !deliveryLocation ||
      !foodDetails
    ) {
      return NextResponse.json(
        { error: 'All required fields must be filled.' },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        providerName: String(providerName),
        flightNumber: String(flightNumber),
        departureTime: new Date(departureTime),
        passengerCount: Number(passengerCount),
        deliveryLocation: String(deliveryLocation),
        foodDetails: String(foodDetails),
        specialNotes: specialNotes ? String(specialNotes) : null,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
