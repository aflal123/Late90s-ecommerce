import prisma from '@/lib/prisma'
import ProductsClient from './ProductsClient'

// Revalidate every 60 seconds — fresh data without rebuilding
export const revalidate = 60

async function getProductsAndCategories() {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
    ])
    return {
      products: JSON.parse(JSON.stringify(products)), // serialize Date objects
      categories: categories.map(c => c.name),
    }
  } catch (e) {
    return { products: [], categories: [] }
  }
}

export default async function ProductsPage() {
  const { products, categories } = await getProductsAndCategories()

  // JSON-LD ItemList structured data for Google to understand the product collection
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Late90s — Shop All Streetwear',
    description: 'Browse the full Late90s collection — oversized t-shirts, graphic tees, premium streetwear from Sri Lanka.',
    url: 'https://www.late90s.online/products',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Late90s',
      url: 'https://www.late90s.online',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://www.late90s.online/products/${p.id}`,
        name: p.name,
      })),
    },
  }

  return (
    <>
      {/* SEO content visible to Google bots — hidden visually but readable in HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SSR-rendered product list for SEO — invisible to users, indexable by Google */}
      <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }} aria-hidden="true">
        <h1>Late90s Shop — All Products</h1>
        <p>Browse Late90s streetwear collection. {products.length} products available.</p>
        <ul>
          {products.map(p => (
            <li key={p.id}>
              <a href={`/products/${p.id}`}>
                {p.name} — LKR {p.price?.toLocaleString?.() ?? p.price}
              </a>
              {p.description && <span> — {p.description}</span>}
            </li>
          ))}
        </ul>
      </div>

      <ProductsClient initialProducts={products} initialCategories={categories} />
    </>
  )
}
