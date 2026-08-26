import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const

type OrderStatus = (typeof VALID_STATUSES)[number]

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const { status, orderPrice } = body

    // At least one updatable field must be present
    if (status === undefined && orderPrice === undefined) {
      return NextResponse.json(
        { error: 'No updatable fields provided.' },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (status !== undefined && !VALID_STATUSES.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // Build the data object
    const data: { status?: OrderStatus; orderPrice?: number } = {}

    if (status !== undefined) {
      data.status = status as OrderStatus
    }

    if (orderPrice !== undefined && typeof orderPrice === 'number' && isFinite(orderPrice)) {
      data.orderPrice = orderPrice
    }

    const order = await prisma.order.update({
      where: { id },
      data,
    })

    return NextResponse.json(order)
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
