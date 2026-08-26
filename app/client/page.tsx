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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C1810] pb-2 mb-4" style={{ borderBottom: '1px solid #7B1A1A' }}>Order Portal</h1>
        <p className="text-[#6B4226] text-sm mt-1">
          Submit a new catering order below or view your order history.
        </p>
      </div>

      {/* Section A: Service Pricing */}
      <div className="bg-[#FBF7F2] border border-[#C4A882] rounded-sm p-6">
        <h2 className="text-base font-bold text-[#2C1810] pb-2 mb-4" style={{ borderBottom: '1px solid #7B1A1A' }}>Service Pricing</h2>
        <p className="text-xs text-[#6B4226] mb-4">
          All pricing is per person unless noted. Contact us to confirm rates for your order.
        </p>
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr className="bg-[#3D2208] text-[#F5EEE6]">
                <th className="border border-[#C4A882] px-4 py-2 text-sm text-left font-medium">Service</th>
                <th className="border border-[#C4A882] px-4 py-2 text-sm text-left font-medium">Rate</th>
                <th className="border border-[#C4A882] px-4 py-2 text-sm text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">Standard Catering Package</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">$-- per person</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#6B4226]">Minimum 4 guests</td>
              </tr>
              <tr className="bg-[#F5EEE6]">
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">Premium Catering Package</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">$-- per person</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#6B4226]">Minimum 4 guests</td>
              </tr>
              <tr>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">Inflight / FBO Delivery</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">$-- per order</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#6B4226]">Delivery fee applies</td>
              </tr>
              <tr className="bg-[#F5EEE6]">
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">Beverage Service</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">$-- per person</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#6B4226]">Coffee, juice, water</td>
              </tr>
              <tr>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">Custom / Specialty Order</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#2C1810]">Contact Us</td>
                <td className="border border-[#C4A882] px-4 py-2 text-sm text-[#6B4226]">Pricing varies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section B: Privacy Notice */}
      <div className="bg-[#FBF7F2] border border-[#C4A882] p-4 rounded-sm">
        <p className="text-xs text-[#6B4226] italic">
          By submitting an order through this portal, you acknowledge that Professor Java&apos;s Catering &amp; Concierge will collect and retain the information provided, including company name, flight details, and order specifications, solely for the purpose of fulfilling your catering request. This information is not shared with third parties. For questions regarding your data, contact us at [contact@professorjavas.com].
        </p>
      </div>

      {/* New Order Form */}
      <ClientOrderForm />

      {/* Order History */}
      <div className="bg-[#FBF7F2] border border-[#C4A882] rounded-sm p-6">
        <h2 className="text-base font-bold text-[#2C1810] pb-2 mb-4" style={{ borderBottom: '1px solid #7B1A1A' }}>
          My Orders
        </h2>
        <p className="text-[#6B4226] text-sm mb-5">
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
  )
}
