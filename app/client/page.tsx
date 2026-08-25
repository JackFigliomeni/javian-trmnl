import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ClientOrderForm from '@/components/ClientOrderForm'
import OrderCard from '@/components/OrderCard'

export default async function ClientPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Order Portal</h1>
        <p className="text-gray-500 text-sm mt-1">
          Submit a new catering order below or view your order history.
        </p>
      </div>

      {/* New Order Form */}
      <ClientOrderForm />

      {/* Order History */}
      <div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-[#1a1a2e] mb-1">
            My Orders
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            {orders.length === 0
              ? 'No orders yet. Submit your first order above.'
              : `${orders.length} order${orders.length !== 1 ? 's' : ''} found.`}
          </p>

          {orders.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
