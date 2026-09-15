import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppCheckoutModal from '@/components/WhatsAppCheckoutModal';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'late90s | Underground Streetwear Archive & WhatsApp Ordering',
  description:
    'Heavyweight 260+ GSM boxy tees, 480 GSM French Terry hoodies, and baggy skater pants. Place orders directly on WhatsApp.',
  keywords: [
    'late90s',
    'streetwear',
    'vintage clothing',
    'heavyweight tees',
    'oversized hoodies',
    'baggy jeans',
    'whatsapp order',
    'gen z fashion',
  ],
  openGraph: {
    title: 'late90s | Underground Streetwear Archive',
    description: 'Instant WhatsApp Click-to-Order streetwear apparel drops.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('late90s_theme');
                  if (saved === 'light' || saved === 'dark') {
                    document.documentElement.classList.add(saved);
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-black text-zinc-100 min-h-screen flex flex-col font-sans selection:bg-[#dfff00] selection:text-black">
        <ThemeProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <WhatsAppCheckoutModal />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
