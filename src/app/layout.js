import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
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
  title: 'Late90s — Old School. New Rules.',
  description: 'Sri Lankan streetwear and vintage fashion store',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en" suppressHydrationWarning>
        <body className={`${bebas.variable} ${inter.variable} ${playfair.variable}`}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}