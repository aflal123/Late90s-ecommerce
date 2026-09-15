import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppCheckoutModal from '@/components/WhatsAppCheckoutModal';

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
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-black text-zinc-100 min-h-screen flex flex-col font-sans selection:bg-[#dfff00] selection:text-black">
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppCheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
