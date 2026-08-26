'use client'

import { useState } from 'react'
import OrderStatusBadge from './OrderStatusBadge'

interface Order {
  id: string
  departureTime: string
  flightNumber: string
  clientName: string
  status: string
  passengerCount: number
}

interface Props {
  orders: Order[]
}

const DAY_HEADERS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toDateString(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatSelectedDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function CalendarView({ orders }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Build a map: dateString -> Order[]
  const ordersByDate = new Map<string, Order[]>()
  for (const order of orders) {
    const ds = toDateString(order.departureTime)
    if (!ordersByDate.has(ds)) {
      ordersByDate.set(ds, [])
    }
    ordersByDate.get(ds)!.push(order)
  }

  // Calendar grid
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length < totalCells) cells.push(null)

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
  }

  function handleDayClick(day: number) {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate((prev) => (prev === ds ? null : ds))
  }

  function todayDateString(): string {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  }

  const todayStr = todayDateString()

  const selectedOrders = selectedDate ? (ordersByDate.get(selectedDate) ?? []) : []

  return (
    <div className="bg-[#FBF7F2] border border-[#C4A882]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#C4A882] flex items-center justify-between">
        <h2
          className="text-base font-bold text-[#2C1810] pb-2"
          style={{ borderBottom: '1px solid #7B1A1A' }}
        >
          Upcoming Orders Calendar
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="px-2 py-1 text-sm font-bold text-[#7B1A1A] hover:text-[#5C1212]"
            aria-label="Previous month"
          >
            &lsaquo;
          </button>
          <span className="text-base font-bold text-[#2C1810] min-w-[140px] text-center">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="px-2 py-1 text-sm font-bold text-[#7B1A1A] hover:text-[#5C1212]"
            aria-label="Next month"
          >
            &rsaquo;
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_HEADERS.map((h) => (
            <div
              key={h}
              className="text-center py-1"
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#6B4226',
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="border border-[#C4A882]/40 h-10"
                  style={{ backgroundColor: '#F5EEE6' }}
                />
              )
            }

            const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const hasOrders = ordersByDate.has(ds)
            const isSelected = selectedDate === ds
            const isToday = ds === todayStr

            let cellBg = '#FBF7F2'
            let cellBorder = '#C4A882'
            if (hasOrders && !isSelected) {
              cellBg = 'rgba(123,26,26,0.06)'
              cellBorder = '#7B1A1A'
            }
            if (isSelected) {
              cellBg = '#7B1A1A'
              cellBorder = '#7B1A1A'
            }

            let numColor = '#2C1810'
            if (isSelected) numColor = '#FBF7F2'
            else if (isToday) numColor = '#7B1A1A'

            return (
              <div
                key={ds}
                onClick={() => handleDayClick(day)}
                className="h-10 flex flex-col items-center justify-start pt-1 cursor-pointer"
                style={{
                  border: `1px solid ${cellBorder}`,
                  backgroundColor: cellBg,
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: isToday || isSelected ? 700 : 400,
                    color: numColor,
                    lineHeight: 1,
                  }}
                >
                  {day}
                </span>
                {hasOrders && !isSelected && (
                  <span
                    style={{
                      display: 'block',
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#7B1A1A',
                      marginTop: '2px',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day panel */}
      {selectedDate && (
        <div className="border-t border-[#C4A882] px-5 py-4">
          <p
            className="text-sm font-bold text-[#2C1810] mb-3"
            style={{ letterSpacing: '0.02em' }}
          >
            Orders for {formatSelectedDate(selectedDate)}
          </p>

          {selectedOrders.length === 0 ? (
            <p className="text-sm text-[#6B4226]">
              No orders scheduled for this date.
            </p>
          ) : (
            <div>
              {selectedOrders.map((order) => (
                <div
                  key={order.id}
                  className="py-2 flex justify-between items-center"
                  style={{ borderBottom: '1px solid #C4A882' }}
                >
                  <div>
                    <span className="text-sm font-bold text-[#7B1A1A] mr-2">
                      {order.flightNumber}
                    </span>
                    <span className="text-sm text-[#6B4226]">
                      {order.clientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span
                      className="text-xs text-[#6B4226]"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {order.passengerCount} pax
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
