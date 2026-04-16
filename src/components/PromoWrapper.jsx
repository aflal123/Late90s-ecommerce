'use client'

import dynamic from 'next/dynamic'

const PromoLoop = dynamic(() => import('./PromoLoop'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100vh', background: '#000' }} />
  ),
})

export default function PromoWrapper() {
  return <PromoLoop />
}
