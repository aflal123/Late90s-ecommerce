import { prisma } from '../lib/prisma';

async function check() {
  const products = await prisma.product.findMany();
  const categories = await prisma.category.findMany();
  const reviews = await prisma.review.findMany();

  console.log(`=== NEON DATABASE CURRENT STATE ===`);
  console.log(`\nProducts (${products.length}):`);
  products.forEach((p) => {
    console.log(`- [${p.id}] "${p.name}" (Cat: ${p.category}, LKR ${p.price})`);
    console.log(`  Img: ${p.image}`);
  });

  console.log(`\nCategories (${categories.length}):`);
  categories.forEach((c) => console.log(`- ${c.name} (slug: ${c.slug})`));

  console.log(`\nReviews (${reviews.length}):`);
  reviews.forEach((r) => console.log(`- ${r.customerName} (${r.rating}★): "${r.comment}"`));
}

check()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
