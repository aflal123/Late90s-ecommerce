import { ClerkProvider } from '@clerk/nextjs'
import { Bebas_Neue, Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const GA_ID = 'G-W7YY7DN10E'

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
  verification: {
    google: 'IsyHUaynLcxZyfl0kDdmpgDBX0yns0aUV17U1hYMajY',
  },
  title: {
    default: 'Late90s | Best Online Clothing Store in Sri Lanka — Old School. New Rules.',
    template: '%s | Late90s Sri Lanka',
  },
  description: 'Late90s — Sri Lanka\'s best streetwear & online clothing store. Shop oversized tees, trending fits & aesthetic streetwear. Affordable. Premium quality. Island-wide delivery. Order via WhatsApp instantly.',
  keywords: [
    // 📍 Near me / local searches
    'fashion store near me',
    'clothing store near me',
    'clothing shop near me',
    'clothes shop near me',
    'streetwear store near me',
    'online fashion store near me',
    'best fashion store near me',
    'tshirt shop near me',
    't shirt store near me',
    'fashion boutique near me',
    'trendy clothes near me',
    'buy clothes near me',
    'fashion shop near me Sri Lanka',
    'clothing store Colombo',
    'fashion store Colombo',
    'streetwear store Colombo',

    // 🔥 Viral / trending style searches
    'streetwear 2025',
    'trending clothes 2025',
    'aesthetic clothing',
    'y2k fashion',
    'vintage streetwear',
    'old school fashion',
    'retro clothing brand',
    'drip clothing',
    'hype clothing',
    'fits check',
    'outfit inspo',
    'cool t shirts',
    'swag outfits',
    'urban fashion',
    'street style',
    'minimal streetwear',
    'black and white aesthetic outfit',
    'clean fit',

    // 🛒 High-intent buyer searches
    'best online clothing store Sri Lanka',
    'buy t shirts online Sri Lanka',
    'best t shirt to buy',
    'best t shirt brand',
    'clothing shop near me',
    'clothing shop near me Sri Lanka',
    'online clothes shopping Sri Lanka',
    'best online store to buy clothes',
    'affordable fashion online',
    'cheap trendy clothes online',
    'best affordable clothing brand',
    'where to buy cool clothes',
    'best clothing websites',
    'shop clothes online',
    'buy outfit online',
    'new clothing drop',
    'new fashion drop',
    'latest fashion 2025',

    // 👕 Product-specific
    'oversized t shirt',
    'oversized tee',
    'oversized fit',
    'oversized t shirt Sri Lanka',
    'best oversized tshirt brand',
    'white oversized tee',
    'black oversized tee',
    'graphic tee',
    'plain tee',
    'premium tshirt',
    'quality tshirt brand',
    'heavyweight tshirt',
    'cotton tshirt Sri Lanka',
    'streetwear tshirt',
    'drop shoulder tee',

    // 🏝️ Sri Lanka local searches
    'Sri Lanka streetwear',
    'Sri Lanka fashion brand',
    'Sri Lankan clothing brand',
    'Sri Lanka online fashion',
    'Sri Lanka clothing shop',
    'Sri Lanka best fashion brand',
    'Colombo clothing store',
    'Colombo fashion brand',
    'Colombo streetwear',
    'buy clothes online Colombo',
    'local fashion brand Sri Lanka',
    'Lankan clothing brand',
    'made in Sri Lanka clothing',
    'Sri Lanka drip',
    'srilankan fashion',
    'LKR clothing',
    'island wide delivery Sri Lanka',
    'WhatsApp order clothing Sri Lanka',
    'cash on delivery Sri Lanka fashion',

    // 🌍 Global discovery
    'best online store',
    'best streetwear brand',
    'streetwear brand',
    'online shopping',
    'fashion nova alternative',
    'affordable streetwear brand',
    'independent clothing brand',
    'small fashion brand',
    'unique clothing brand',
    'exclusive clothing drop',
    'limited edition clothing',

    // 📱 Social / discovery
    'TikTok fashion',
    'Instagram outfit',
    'TikTok clothing haul',
    'fashion haul',
    'clothing haul',
    'outfit of the day',
    'OOTD Sri Lanka',
    'fashion Sri Lanka instagram',
    'streetwear haul',
    'new drop haul',

    // 🏷️ Brand
    'Late90s',
    'late90s online',
    'late 90s clothing',
    'late90s Sri Lanka',
    'late90s.online',
    'late90s fashion',
    'late90s brand',
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
          {/* Google Analytics 4 */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>

          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}