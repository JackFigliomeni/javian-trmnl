'use client'

import { useState } from 'react'
import OrderStatusBadge from './OrderStatusBadge'

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

const ALL_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]

interface Order {
  id: string
  clientName: string
  providerName: string
  flightNumber: string
  departureTime: string
  passengerCount: number
  deliveryLocation: string
  foodDetails: string
  specialNotes: string
  status: string
  createdAt: string
  updatedAt: string
  attachmentUrl?: string
  attachmentName?: string
  orderPrice?: number
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso))
}

function DetailModal({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF7F2] border border-[#C4A882] max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-2xl font-bold text-[#7B1A1A]">
              {order.flightNumber}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-[#6B4226] text-sm">{order.providerName}</p>
        </div>

        <div className="text-sm" style={{ borderTop: '1px solid #C4A882' }}>
          <div className="py-2.5 grid grid-cols-2 gap-2" style={{ borderBottom: '1px solid #C4A882' }}>
            <span className="text-[#6B4226]">Client</span>
            <span className="text-[#2C1810]">{order.clientName}</span>
          </div>
          <div className="py-2.5 grid grid-cols-2 gap-2" style={{ borderBottom: '1px solid #C4A882' }}>
            <span className="text-[#6B4226]">Departure</span>
            <span className="text-[#2C1810]">
              {formatDateTime(order.departureTime)}
            </span>
          </div>
          <div className="py-2.5 grid grid-cols-2 gap-2" style={{ borderBottom: '1px solid #C4A882' }}>
            <span className="text-[#6B4226]">Passengers</span>
            <span className="text-[#2C1810]">{order.passengerCount}</span>
          </div>
          <div className="py-2.5 grid grid-cols-2 gap-2" style={{ borderBottom: '1px solid #C4A882' }}>
            <span className="text-[#6B4226]">Location</span>
            <span className="text-[#2C1810]">{order.deliveryLocation}</span>
          </div>
          <div className="py-2.5 grid grid-cols-2 gap-2" style={{ borderBottom: '1px solid #C4A882' }}>
            <span className="text-[#6B4226]">Price</span>
            <span className="text-[#2C1810]">
              {order.orderPrice !== undefined
                ? `$${order.orderPrice.toFixed(2)}`
                : 'Not set'}
            </span>
          </div>
          <div className="py-2.5" style={{ borderBottom: '1px solid #C4A882' }}>
            <p className="text-[#6B4226] mb-1.5">Food Order Details</p>
            <p className="text-[#2C1810] whitespace-pre-wrap leading-relaxed">
              {order.foodDetails}
            </p>
          </div>
          {order.specialNotes && (
            <div className="py-2.5" style={{ borderBottom: '1px solid #C4A882' }}>
              <p className="text-[#6B4226] mb-1.5">Special Notes</p>
              <p className="text-[#2C1810] whitespace-pre-wrap leading-relaxed">
                {order.specialNotes}
              </p>
            </div>
          )}
          {order.attachmentName && (
            <div className="py-2.5" style={{ borderBottom: '1px solid #C4A882' }}>
              <p className="text-[#6B4226] mb-1.5">Attached File</p>
              <a
                href={order.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7B1A1A] underline"
              >
                {order.attachmentName}
              </a>
            </div>
          )}
          <div className="py-2.5 grid grid-cols-2 gap-2">
            <span className="text-[#6B4226]">Submitted</span>
            <span className="text-[#2C1810]">
              {formatDateTime(order.createdAt)}
            </span>
          </div>
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="text-[#7B1A1A] text-sm underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StaffOrdersTable({
  initialOrders,
}: {
  initialOrders: Order[]
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [activeFilter, setActiveFilter] = useState<'ALL' | OrderStatus>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered =
    activeFilter === 'ALL'
      ? orders
      : orders.filter((o) => o.status === activeFilter)

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId)
    const previousOrders = orders
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        setOrders(previousOrders)
        console.error('Failed to update status')
      }
    } catch {
      setOrders(previousOrders)
      console.error('Network error updating status')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handlePriceChange(orderId: string, value: string) {
    const parsed = parseFloat(value)
    if (isNaN(parsed) || !isFinite(parsed)) return

    const previousOrders = orders
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderPrice: parsed } : o))
    )

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderPrice: parsed }),
      })

      if (!res.ok) {
        setOrders(previousOrders)
        console.error('Failed to update price')
      }
    } catch {
      setOrders(previousOrders)
      console.error('Network error updating price')
    }
  }

  const filterLabels: Record<'ALL' | OrderStatus, string> = {
    ALL: 'All',
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  }

  return (
    <div className="bg-[#FBF7F2] border border-[#C4A882]">
      {/* Filter Tabs */}
      <div className="px-8 pt-7 pb-5 border-b border-[#C4A882]">
        <h2
          className="text-2xl font-bold text-[#2C1810] pb-3 mb-5"
          style={{ borderBottom: '1px solid #7B1A1A' }}
        >
          All Orders
        </h2>
        <div className="flex flex-wrap gap-5">
          {(['ALL', ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`text-base pb-1 ${
                activeFilter === s
                  ? 'border-b-2 border-[#7B1A1A] text-[#7B1A1A]'
                  : 'text-[#6B4226]'
              }`}
            >
              {filterLabels[s]}
              {s !== 'ALL' && (
                <span className="ml-1 opacity-70">
                  ({orders.filter((o) => o.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-base" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="bg-[#3D2208] text-[#F5EEE6] text-sm uppercase tracking-wider text-left">
              <th className="px-5 py-4 font-medium">Client</th>
              <th className="px-5 py-4 font-medium">Provider</th>
              <th className="px-5 py-4 font-medium">Flight</th>
              <th className="px-5 py-4 font-medium">Departure</th>
              <th className="px-5 py-4 font-medium">Pax</th>
              <th className="px-5 py-4 font-medium">Location</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Update</th>
              <th className="px-5 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-12 text-center text-[#6B4226] text-base border-b border-[#C4A882]"
                >
                  No orders found.
                </td>
              </tr>
            )}
            {filtered.map((order, idx) => (
              <tr
                key={order.id}
                className={idx % 2 === 0 ? 'bg-[#FBF7F2]' : 'bg-[#F5EEE6]'}
              >
                <td className="px-5 py-4 text-[#2C1810] border-b border-[#C4A882]">
                  {order.clientName}
                </td>
                <td className="px-5 py-4 text-[#6B4226] border-b border-[#C4A882]">
                  {order.providerName}
                </td>
                <td className="px-5 py-4 font-bold text-[#7B1A1A] border-b border-[#C4A882]">
                  {order.flightNumber}
                </td>
                <td className="px-5 py-4 text-[#6B4226] whitespace-nowrap border-b border-[#C4A882]">
                  {formatDateTime(order.departureTime)}
                </td>
                <td className="px-5 py-4 text-[#6B4226] border-b border-[#C4A882]">
                  {order.passengerCount}
                </td>
                <td className="px-5 py-4 text-[#6B4226] max-w-[160px] truncate border-b border-[#C4A882]">
                  {order.deliveryLocation}
                </td>
                <td className="px-5 py-4 border-b border-[#C4A882]">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4 border-b border-[#C4A882]">
                  <input
                    type="number"
                    placeholder="--"
                    step="0.01"
                    min="0"
                    defaultValue={order.orderPrice ?? ''}
                    key={order.id + '-price'}
                    className="w-24 px-2 py-1.5 text-base focus:outline-none"
                    style={{ border: '1px solid #C4A882', backgroundColor: 'transparent', color: '#2C1810' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#7B1A1A' }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#C4A882'
                      if (e.currentTarget.value) handlePriceChange(order.id, e.currentTarget.value)
                    }}
                  />
                </td>
                <td className="px-5 py-4 border-b border-[#C4A882]">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border border-[#C4A882] text-sm px-2 py-1.5 bg-[#FBF7F2] text-[#2C1810] focus:outline-none focus:border-[#7B1A1A] disabled:opacity-50 cursor-pointer"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {filterLabels[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4 border-b border-[#C4A882]">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-sm text-[#7B1A1A] underline whitespace-nowrap"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {filtered.length === 0 && (
          <p className="text-center text-[#6B4226] py-8 text-sm">
            No orders found.
          </p>
        )}
        {filtered.map((order) => (
          <div
            key={order.id}
            className="border border-[#C4A882] bg-[#FBF7F2] p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-[#7B1A1A] text-xl">
                  {order.flightNumber}
                </p>
                <p className="text-[#6B4226] text-base">{order.clientName}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="text-base text-[#2C1810] space-y-1">
              <p>
                <span className="text-[#6B4226]">Provider: </span>
                {order.providerName}
              </p>
              <p>
                <span className="text-[#6B4226]">Departure: </span>
                {formatDateTime(order.departureTime)}
              </p>
              <p>
                <span className="text-[#6B4226]">Passengers: </span>
                {order.passengerCount}
              </p>
              <p>
                <span className="text-[#6B4226]">Location: </span>
                {order.deliveryLocation}
              </p>
              <p>
                <span className="text-[#6B4226]">Price: </span>
                {order.orderPrice !== undefined
                  ? `$${order.orderPrice.toFixed(2)}`
                  : 'Not set'}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="flex-1 border border-[#C4A882] px-3 py-2 text-sm text-[#2C1810] bg-[#FBF7F2] focus:outline-none focus:border-[#7B1A1A] disabled:opacity-50"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {filterLabels[s]}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-sm text-[#7B1A1A] underline whitespace-nowrap"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <DetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}
