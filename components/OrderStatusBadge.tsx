type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-700',
  },
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-blue-100 text-[#2ea3f2]',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-orange-100 text-orange-700',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-500',
  },
}

export default function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as OrderStatus] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-500',
  }

  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
