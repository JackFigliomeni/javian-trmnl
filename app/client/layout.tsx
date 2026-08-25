import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOut } from '@/auth'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user?.role !== 'CLIENT') {
    redirect('/login')
  }

  const clientName = session.user?.clientName ?? session.user?.username ?? 'Client'

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#2ea3f2] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                PJ
              </div>
              <div className="leading-tight">
                <p className="text-[#1a1a2e] font-bold text-sm tracking-tight">
                  PROFESSOR JAVA&apos;S
                </p>
                <p className="text-[#2ea3f2] text-[10px] tracking-widest font-semibold">
                  CATERING &amp; CONCIERGE
                </p>
              </div>
            </div>

            {/* Center: Welcome */}
            <p className="hidden sm:block text-gray-500 text-sm">
              Welcome,{' '}
              <span className="font-semibold text-[#1a1a2e]">{clientName}</span>
            </p>

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
