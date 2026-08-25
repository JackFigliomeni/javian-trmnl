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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-2xl font-bold text-[#1a1a2e]">
              {order.flightNumber}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-gray-500 text-sm">{order.providerName}</p>
        </div>

        <div className="divide-y divide-gray-100 text-sm">
          <div className="py-2.5 grid grid-cols-2 gap-2">
            <span className="text-gray-500 font-medium">Client</span>
            <span className="text-[#1a1a2e]">{order.clientName}</span>
          </div>
          <div className="py-2.5 grid grid-cols-2 gap-2">
            <span className="text-gray-500 font-medium">Departure</span>
            <span className="text-[#1a1a2e]">
              {formatDateTime(order.departureTime)}
            </span>
          </div>
          <div className="py-2.5 grid grid-cols-2 gap-2">
            <span className="text-gray-500 font-medium">Passengers</span>
            <span className="text-[#1a1a2e]">{order.passengerCount}</span>
          </div>
          <div className="py-2.5 grid grid-cols-2 gap-2">
            <span className="text-gray-500 font-medium">Location</span>
            <span className="text-[#1a1a2e]">{order.deliveryLocation}</span>
          </div>
          <div className="py-2.5">
            <p className="text-gray-500 font-medium mb-1.5">Food Order Details</p>
            <p className="text-[#1a1a2e] whitespace-pre-wrap leading-relaxed">
              {order.foodDetails}
            </p>
          </div>
          {order.specialNotes && (
            <div className="py-2.5">
              <p className="text-gray-500 font-medium mb-1.5">Special Notes</p>
              <p className="text-[#1a1a2e] whitespace-pre-wrap leading-relaxed">
                {order.specialNotes}
              </p>
            </div>
          )}
          <div className="py-2.5 grid grid-cols-2 gap-2">
            <span className="text-gray-500 font-medium">Submitted</span>
            <span className="text-[#1a1a2e]">
              {formatDateTime(order.createdAt)}
            </span>
          </div>
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
    // Optimistic update
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
        // Revert on failure
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: orders.find((x) => x.id === orderId)?.status ?? o.status }
              : o
          )
        )
        console.error('Failed to update status')
      }
    } catch {
      console.error('Network error updating status')
    } finally {
      setUpdatingId(null)
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Filter Tabs */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-3">
          All Orders
        </h2>
        <div className="flex flex-wrap gap-2">
          {(['ALL', ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === s
                  ? 'bg-[#2ea3f2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterLabels[s]}
              {s !== 'ALL' && (
                <span className="ml-1.5 opacity-70">
                  ({orders.filter((o) => o.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Flight</th>
              <th className="px-4 py-3 font-medium">Departure</th>
              <th className="px-4 py-3 font-medium">Pax</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Update</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-10 text-center text-gray-400 text-sm"
                >
                  No orders found.
                </td>
              </tr>
            )}
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-[#f8f9fb] transition-colors"
              >
                <td className="px-6 py-4 font-medium text-[#1a1a2e]">
                  {order.clientName}
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {order.providerName}
                </td>
                <td className="px-4 py-4 font-semibold text-[#1a1a2e]">
                  {order.flightNumber}
                </td>
                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                  {formatDateTime(order.departureTime)}
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {order.passengerCount}
                </td>
                <td className="px-4 py-4 text-gray-600 max-w-[160px] truncate">
                  {order.deliveryLocation}
                </td>
                <td className="px-4 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-4">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:border-[#2ea3f2] disabled:opacity-50 cursor-pointer"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {filterLabels[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-xs text-[#2ea3f2] hover:underline font-medium whitespace-nowrap"
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
          <p className="text-center text-gray-400 py-8 text-sm">
            No orders found.
          </p>
        )}
        {filtered.map((order) => (
          <div
            key={order.id}
            className="border border-gray-100 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-[#1a1a2e] text-lg">
                  {order.flightNumber}
                </p>
                <p className="text-gray-500 text-sm">{order.clientName}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Provider:</span>{' '}
                {order.providerName}
              </p>
              <p>
                <span className="font-medium">Departure:</span>{' '}
                {formatDateTime(order.departureTime)}
              </p>
              <p>
                <span className="font-medium">Passengers:</span>{' '}
                {order.passengerCount}
              </p>
              <p>
                <span className="font-medium">Location:</span>{' '}
                {order.deliveryLocation}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#2ea3f2] disabled:opacity-50"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {filterLabels[s]}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-sm text-[#2ea3f2] hover:underline font-medium whitespace-nowrap"
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
