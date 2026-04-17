import prisma from '@/lib/prisma'
import ProductDetail from './ProductDetail'

const BASE_URL = 'https://late90s.vercel.app'

export async function generateMetadata({ params }) {
  const { id } = await params
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return { title: 'Product Not Found' }

    const title = `${product.name} — LKR ${product.price.toLocaleString()}`
    const description = product.description
      || `Shop ${product.name} from Late90s. Premium Sri Lankan streetwear. Order via WhatsApp, ships island-wide.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/products/${id}`,
        siteName: 'Late90s',
        images: product.image
          ? [{ url: product.image, width: 800, height: 1000, alt: product.name }]
          : [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Late90s' }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.image ? [product.image] : [`${BASE_URL}/og-image.png`],
      },
    }
  } catch {
    return { title: 'Late90s' }
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params

  // Structured data (JSON-LD) for Google Shopping / rich results
  let jsonLd = null
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (product) {
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        sku: product.id,
        brand: { '@type': 'Brand', name: 'Late90s' },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'LKR',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'Late90s' },
          url: `${BASE_URL}/products/${id}`,
        },
      }
    }
  } catch {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetail />
    </>
  )
}
