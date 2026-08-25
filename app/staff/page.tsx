import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import StaffOrdersTable from '@/components/StaffOrdersTable'

function StatCard({
  label,
  value,
  colorClass,
}: {
  label: string
  value: number
  colorClass: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
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

  // Stats
  const total = orders.length
  const pending = orders.filter((o) => o.status === 'PENDING').length
  const inProgress = orders.filter((o) => o.status === 'IN_PROGRESS').length

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const completedToday = orders.filter(
    (o) => o.status === 'COMPLETED' && new Date(o.updatedAt) >= todayStart
  ).length

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
  }))

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Staff Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and update all catering orders.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={total} colorClass="text-[#1a1a2e]" />
        <StatCard label="Pending" value={pending} colorClass="text-amber-600" />
        <StatCard label="In Progress" value={inProgress} colorClass="text-[#2ea3f2]" />
        <StatCard label="Completed Today" value={completedToday} colorClass="text-green-600" />
      </div>

      {/* Orders Table */}
      <StaffOrdersTable initialOrders={serializedOrders} />
    </div>
  )
}
