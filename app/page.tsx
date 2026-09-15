import { prisma } from '@/lib/prisma';
import HomePageClient from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  try {
    const [rawProducts, rawCategories, rawReviews] = await Promise.all([
      prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.review.findMany({ where: { approved: true }, take: 3, orderBy: { createdAt: 'desc' } }),
    ]);

    const products = rawProducts.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    }));

    const categories = rawCategories.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }));

    const reviews = rawReviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));

    return (
      <HomePageClient
        initialProducts={products}
        initialCategories={categories}
        initialReviews={reviews}
      />
    );
  } catch (err) {
    console.error('Failed to load homepage data from database server-side', err);
    return <HomePageClient />;
  }
}
