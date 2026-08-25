import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOut } from '@/auth'
import Image from 'next/image'

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
    <div className="min-h-screen bg-[#F5EEE6]">
      {/* Top Nav */}
      <nav className="bg-[#3D2208] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 h-14">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <Image
                src="https://professorjavas.com/wp-content/uploads/2024/09/Coffee_Shop_22@2x.png"
                alt="Professor Java's Logo"
                width={28}
                height={22}
                className="object-contain"
                unoptimized
              />
              <div className="leading-tight">
                <p className="text-[#F5EEE6] font-bold text-sm tracking-wide">
                  PROFESSOR JAVA&apos;S
                </p>
                <p className="text-[#C4A882] uppercase tracking-wider" style={{ fontSize: '10px' }}>
                  CATERING &amp; CONCIERGE
                </p>
              </div>
            </div>

            {/* Center: Welcome */}
            <p className="hidden sm:block text-[#C4A882] text-sm">
              Welcome, {clientName}
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
                className="text-sm text-[#C4A882] hover:text-[#F5EEE6]"
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
