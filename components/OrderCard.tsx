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
    <div className="border border-[#C4A882] bg-[#FBF7F2] p-4 rounded-sm">
      {/* Flight number + status */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xl font-bold text-[#7B1A1A]">
            {order.flightNumber}
          </p>
          <p className="text-sm text-[#6B4226] mt-0.5">{order.providerName}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-[#2C1810]">
        <div>
          <span className="text-[#6B4226]">Departure: </span>
          <span>{formatDateTime(order.departureTime)}</span>
        </div>
        <div>
          <span className="text-[#6B4226]">Passengers: </span>
          <span>
            {order.passengerCount}{' '}
            {order.passengerCount === 1 ? 'passenger' : 'passengers'}
          </span>
        </div>
        <div>
          <span className="text-[#6B4226]">Location: </span>
          <span className="truncate">{order.deliveryLocation}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-[#C4A882]">
        <p className="text-xs text-[#6B4226]">
          Submitted {formatDateTime(order.createdAt)}
        </p>
      </div>
    </div>
  )
}
