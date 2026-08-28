import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import StaffOrdersTable from '@/components/StaffOrdersTable'
import CalendarView from '@/components/CalendarView'
import ContactInquiriesList from '@/components/ContactInquiriesList'

function StatCard({
  label,
  value,
  valueColor,
}: {
  label: string
  value: number | string
  valueColor?: string
}) {
  return (
    <div className="border border-[#C4A882] bg-[#FBF7F2] p-4">
      <p
        className="uppercase text-[#6B4226] mb-1"
        style={{ fontSize: '11px', letterSpacing: '0.08em' }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold stat-number"
        style={{ color: valueColor ?? '#7B1A1A' }}
      >
        {value}
      </p>
    </div>
  )
}

export default async function StaffPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { username: true, clientName: true },
      },
    },
  })

  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const serializedInquiries = inquiries.map((i) => ({
    id: i.id,
    firstName: i.firstName,
    lastName: i.lastName,
    company: i.company,
    email: i.email,
    message: i.message,
    createdAt: i.createdAt.toISOString(),
  }))

  // Stats
  const total = orders.length
  const pending = orders.filter((o) => o.status === 'PENDING').length
  const inProgress = orders.filter((o) => o.status === 'IN_PROGRESS').length

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const completedToday = orders.filter(
    (o) => o.status === 'COMPLETED' && new Date(o.updatedAt) >= todayStart
  ).length

  // Total revenue
  const ordersWithPrice = orders.filter(
    (o) => o.orderPrice !== null && o.orderPrice !== undefined
  )
  const totalRevenue = ordersWithPrice.reduce(
    (sum, o) => sum + (o.orderPrice ?? 0),
    0
  )
  const revenueDisplay =
    ordersWithPrice.length === 0
      ? '$--'
      : '$' +
        totalRevenue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })

  // Serialize for client component
  const serializedOrders = orders.map((o) => ({
    id: o.id,
    providerName: o.providerName,
    flightNumber: o.flightNumber,
    departureTime: o.departureTime.toISOString(),
    passengerCount: o.passengerCount,
    deliveryLocation: o.deliveryLocation,
    foodDetails: o.foodDetails,
    specialNotes: o.specialNotes ?? '',
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    clientName: o.user.clientName ?? o.user.username,
    attachmentUrl: (o as { attachmentUrl?: string }).attachmentUrl ?? undefined,
    attachmentName: (o as { attachmentName?: string }).attachmentName ?? undefined,
    orderPrice: o.orderPrice ?? undefined,
  }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1
          className="text-2xl font-bold text-[#2C1810] pb-2 mb-4"
          style={{ borderBottom: '1px solid #7B1A1A' }}
        >
          Staff Dashboard
        </h1>
        <p className="text-[#6B4226] text-sm mt-1">
          Manage and update all catering orders.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Orders" value={total} valueColor="#2C1810" />
        <StatCard label="Pending" value={pending} valueColor="#7B1A1A" />
        <StatCard label="In Progress" value={inProgress} valueColor="#6B4226" />
        <StatCard label="Completed Today" value={completedToday} valueColor="#2C4A1E" />
        <StatCard label="Total Revenue" value={revenueDisplay} valueColor="#3D2208" />
      </div>

      {/* Orders Table — primary focus */}
      <StaffOrdersTable initialOrders={serializedOrders} />

      {/* Calendar */}
      <CalendarView orders={serializedOrders} />

      {/* Website Inquiries */}
      <ContactInquiriesList inquiries={serializedInquiries} />
    </div>
  )
}
