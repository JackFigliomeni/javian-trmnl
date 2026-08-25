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
    className: 'bg-[#7B1A1A]/10 text-[#7B1A1A] border border-[#7B1A1A]/30',
  },
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-[#3D2208]/10 text-[#3D2208] border border-[#3D2208]/30',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-[#6B4226]/10 text-[#6B4226] border border-[#6B4226]/30',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-[#2C4A1E]/10 text-[#2C4A1E] border border-[#2C4A1E]/30',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-200 text-gray-600 border border-gray-400',
  },
}

export default function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as OrderStatus] ?? {
    label: status,
    className: 'bg-gray-200 text-gray-600 border border-gray-400',
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs uppercase tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  )
}
