import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import InflightCateringPage from '@/marketing/InflightCateringPage'

export default async function RootPage() {
  const session = await auth()

  if (!session) {
    return <InflightCateringPage />
  }

  if (session.user?.role === 'STAFF') {
    redirect('/staff')
  }

  redirect('/client')
}
