import dynamic from 'next/dynamic'
import MarqueeStrip from '@/components/MarqueeStrip'
import FeaturedProducts from '@/components/FeaturedProducts'
import CategorySection from '@/components/CategorySection'
import AboutSection from '@/components/AboutSection'
import ReviewsSection from '@/components/ReviewsSection'

const PromoLoop = dynamic(() => import('@/components/PromoLoop'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100vh', background: '#000' }} />
  ),
})

export default function Home() {
  return (
    <main style={{ backgroundColor: '#0a0a0a' }}>
      <PromoLoop />
      <MarqueeStrip />
      <FeaturedProducts />
      <CategorySection />
      <AboutSection />
      <ReviewsSection />
    </main>
  )
}
