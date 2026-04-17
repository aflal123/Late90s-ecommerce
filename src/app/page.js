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
  alternateName: ['Late90s Sri Lanka', 'Late 90s Clothing', 'late90s.online'],
  description: 'Sri Lanka\'s best online fashion & streetwear store. Premium oversized t-shirts, trending fits, aesthetic clothing. Locally made. Island-wide delivery. Order via WhatsApp.',
  url: 'https://www.late90s.online',
  logo: 'https://www.late90s.online/late90s-logo-white.png',
  image: 'https://www.late90s.online/og-image.png',
  telephone: '+94775494201',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Colombo',
    addressRegion: 'Western Province',
    addressCountry: 'LK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 6.9271,
    longitude: 79.8612,
  },
  hasMap: 'https://maps.google.com/?q=Colombo,Sri+Lanka',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens: '08:00',
    closes: '22:00',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+94775494201',
    contactType: 'customer service',
    availableLanguage: ['English', 'Sinhala'],
  },
  currenciesAccepted: 'LKR',
  paymentAccepted: 'Cash, Bank Transfer',
  priceRange: '$$',
  areaServed: [
    { '@type': 'Country', name: 'Sri Lanka' },
    { '@type': 'City', name: 'Colombo' },
    { '@type': 'City', name: 'Kandy' },
    { '@type': 'City', name: 'Galle' },
    { '@type': 'City', name: 'Negombo' },
  ],
  servesCuisine: undefined,
  sameAs: [
    'https://www.instagram.com/late90s_outlet/',
    'https://www.tiktok.com/@late90s_',
  ],
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
