import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOut } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user?.role !== 'STAFF') {
    redirect('/login')
  }

  const pendingCount = await prisma.order.count({
    where: { status: 'PENDING' },
  })

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0e1628] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                PJ
              </div>
              <div className="leading-tight">
                <p className="text-[#1a1a2e] font-bold text-sm tracking-tight">
                  PROFESSOR JAVA&apos;S
                </p>
                <p className="text-[#2ea3f2] text-[10px] tracking-widest font-semibold">
                  STAFF DASHBOARD
                </p>
              </div>
            </div>

            {/* Center: Pending badge */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-500 text-sm">Pending Orders:</span>
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  pendingCount > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {pendingCount}
              </span>
            </div>

            {/* Right: Sign Out */}
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-[#2ea3f2] font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
