import { ClerkProvider } from '@clerk/nextjs'
import { Bebas_Neue, Inter, Playfair_Display } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata = {
  metadataBase: new URL('https://www.late90s.online'),
  title: {
    default: 'Late90s | Best Online Clothing Store in Sri Lanka — Old School. New Rules.',
    template: '%s | Late90s Sri Lanka',
  },
  description: 'Late90s is Sri Lanka\'s best online clothing store. Shop premium oversized t-shirts, streetwear & trending fashion. Best t-shirts to buy online. Fast delivery island-wide. Order via WhatsApp.',
  keywords: [
    // High-intent buyer searches
    'best online clothing store Sri Lanka',
    'buy t shirts online Sri Lanka',
    'best t shirt to buy',
    'clothing shop near me Sri Lanka',
    'online clothes shopping Sri Lanka',
    'best streetwear Sri Lanka',
    'affordable clothing Sri Lanka',
    'trendy clothes Sri Lanka',
    // Product-specific
    'oversized t shirt Sri Lanka',
    'oversized tee Sri Lanka',
    'best oversized tshirt',
    'streetwear Sri Lanka',
    'Sri Lanka fashion brand',
    'men clothing online Sri Lanka',
    // Local
    'Colombo clothing store',
    'Sri Lankan fashion online',
    'Lankan streetwear brand',
    'local clothing brand Sri Lanka',
    'buy clothes online Colombo',
    'Colombo fashion shop',
    // Brand
    'Late90s',
    'late90s online',
    'late 90s clothing',
    'late90s Sri Lanka',
    // Generic high-traffic
    'best online store',
    'online shopping Sri Lanka',
    'fashion online Sri Lanka',
    'WhatsApp clothing order Sri Lanka',
  ],
  authors: [{ name: 'Late90s', url: 'https://www.late90s.online' }],
  creator: 'Late90s',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.late90s.online',
    siteName: 'Late90s',
    title: 'Late90s | Best Online Clothing Store in Sri Lanka',
    description: 'Shop premium oversized t-shirts & streetwear. Sri Lanka\'s best online fashion store. Order via WhatsApp — ships island-wide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Late90s — Best Online Clothing Store Sri Lanka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Late90s | Best Online Clothing Store in Sri Lanka',
    description: 'Premium oversized tees & streetwear. Locally made, globally styled. Order via WhatsApp.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://www.late90s.online',
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en">
        <body className={`${bebas.variable} ${inter.variable} ${playfair.variable}`}>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}