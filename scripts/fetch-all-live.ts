import { prisma } from '../lib/prisma';

async function fetchAllLiveData() {
  console.log('Fetching live records from Neon PostgreSQL...\n');

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const orders = await prisma.order.findMany({
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(
    JSON.stringify(
      {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalReviews: reviews.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        products,
        categories,
        reviews,
        orders,
        users,
      },
      null,
      2
    )
  );
}

fetchAllLiveData()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Error fetching data:', e);
    process.exit(1);
  });
