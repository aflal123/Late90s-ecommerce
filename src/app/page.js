import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import MarqueeStrip from '@/components/MarqueeStrip'
import FeaturedProducts from '@/components/FeaturedProducts'
import CategorySection from '@/components/CategorySection'
import AboutSection from '@/components/AboutSection'
import ReviewsSection from '@/components/ReviewsSection'

const PromoLoop = dynamic(() => import('@/components/PromoLoop'), {
  ssr: false,
  loading: () => (
    <section style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'monospace', color: 'rgba(200,169,110,0.25)', letterSpacing: '0.5em', fontSize: '0.65rem' }}>
        ⏺ LOADING...
      </div>
    </section>
  ),
})

export default function Home() {
  return (
    <main style={{ backgroundColor: '#0a0a0a' }}>
      <HeroSection />
      <MarqueeStrip />
      <PromoLoop />
      <FeaturedProducts />
      <CategorySection />
      <AboutSection />
      <ReviewsSection />
    </main>
  )
}
