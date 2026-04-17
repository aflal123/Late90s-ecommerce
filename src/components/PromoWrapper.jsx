'use client'

import dynamic from 'next/dynamic'

const PhotoHero = dynamic(() => import('./PhotoHero'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100vh', background: '#000' }} />
  ),
})

export default function PromoWrapper() {
  return <PhotoHero />
}
