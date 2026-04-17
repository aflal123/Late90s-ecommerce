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
  metadataBase: new URL('https://late90s.vercel.app'),
  title: {
    default: 'Late90s — Old School. New Rules.',
    template: '%s | Late90s',
  },
  description: 'Premium Sri Lankan streetwear inspired by the late 90s era. Locally made, globally styled. Shop oversized tees, hoodies and more. Order via WhatsApp — ships island-wide.',
  keywords: ['Sri Lanka streetwear', 'Sri Lankan fashion', 'late 90s clothing', 'oversized tees Sri Lanka', 'local fashion brand', 'Colombo streetwear', 'Lankan clothing brand', 'Late90s'],
  authors: [{ name: 'Late90s', url: 'https://late90s.vercel.app' }],
  creator: 'Late90s',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://late90s.vercel.app',
    siteName: 'Late90s',
    title: 'Late90s — Old School. New Rules.',
    description: 'Premium Sri Lankan streetwear inspired by the late 90s era. Locally made, globally styled.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Late90s — Sri Lankan Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Late90s — Old School. New Rules.',
    description: 'Premium Sri Lankan streetwear inspired by the late 90s era.',
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