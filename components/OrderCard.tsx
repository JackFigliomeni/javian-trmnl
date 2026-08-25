import OrderStatusBadge from './OrderStatusBadge'

interface Order {
  id: string
  providerName: string
  flightNumber: string
  departureTime: Date
  passengerCount: number
  deliveryLocation: string
  status: string
  createdAt: Date
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-[#f8f9fb] hover:shadow-sm transition-shadow">
      {/* Flight number + status */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xl font-bold text-[#1a1a2e] tracking-tight">
            {order.flightNumber}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{order.providerName}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">🕐</span>
          <span>{formatDateTime(order.departureTime)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">👥</span>
          <span>
            {order.passengerCount}{' '}
            {order.passengerCount === 1 ? 'passenger' : 'passengers'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">📍</span>
          <span className="truncate">{order.deliveryLocation}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          Submitted {formatDateTime(order.createdAt)}
        </p>
      </div>
    </div>
  )
}
