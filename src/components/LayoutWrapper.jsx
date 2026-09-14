'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    )
  }

  // On Maintenance branch: Public pages render without e-commerce Navbar/Footer
  return children
}
