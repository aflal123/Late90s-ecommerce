import prisma from '@/lib/prisma'

const BASE_URL = 'https://www.late90s.online'

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: BASE_URL,              lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/about`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/cart`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Dynamic product pages
  let productPages = []
  try {
    const products = await prisma.product.findMany({
      select: { id: true, createdAt: true },
    })
    productPages = products.map(p => ({
      url: `${BASE_URL}/products/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  return [...staticPages, ...productPages]
}
