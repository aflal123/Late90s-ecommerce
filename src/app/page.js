import MarqueeStrip from '@/components/MarqueeStrip'
import FeaturedProducts from '@/components/FeaturedProducts'
import CategorySection from '@/components/CategorySection'
import AboutSection from '@/components/AboutSection'
import ReviewsSection from '@/components/ReviewsSection'
import PromoWrapper from '@/components/PromoWrapper'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Late90s',
  description: 'Premium Sri Lankan streetwear inspired by the late 90s era. Locally made, globally styled.',
  url: 'https://late90s.vercel.app',
  logo: 'https://late90s.vercel.app/late90s-logo-white.png',
  image: 'https://late90s.vercel.app/og-image.png',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'LK',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+94775494201',
    contactType: 'customer service',
    availableLanguage: ['English', 'Sinhala'],
    contactOption: 'https://wa.me/94775494201',
  },
  sameAs: [],
  currenciesAccepted: 'LKR',
  paymentAccepted: 'Cash, Bank Transfer',
  priceRange: '$$',
  areaServed: {
    '@type': 'Country',
    name: 'Sri Lanka',
  },
}

export default function Home() {
  return (
    <main style={{ backgroundColor: '#0a0a0a' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PromoWrapper />
      <MarqueeStrip />
      <FeaturedProducts />
      <CategorySection />
      <AboutSection />
      <ReviewsSection />
    </main>
  )
}
