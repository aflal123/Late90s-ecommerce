import MarqueeStrip from '@/components/MarqueeStrip'
import FeaturedProducts from '@/components/FeaturedProducts'
import CategorySection from '@/components/CategorySection'
import AboutSection from '@/components/AboutSection'
import ReviewsSection from '@/components/ReviewsSection'
import PromoWrapper from '@/components/PromoWrapper'

export default function Home() {
  return (
    <main style={{ backgroundColor: '#0a0a0a' }}>
      <PromoWrapper />
      <MarqueeStrip />
      <FeaturedProducts />
      <CategorySection />
      <AboutSection />
      <ReviewsSection />
    </main>
  )
}
