import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminToken } from '@/lib/adminAuth'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  const valid = token ? verifyAdminToken(token) : null
  if (!valid) redirect('/admin/login')
  return <AdminDashboard />
}
