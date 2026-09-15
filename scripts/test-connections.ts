import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../lib/prisma';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function testConnections() {
  console.log('--- Testing Neon Database Connection ---');
  try {
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    const reviewCount = await prisma.review.count();
    const categoryCount = await prisma.category.count();
    console.log(`✅ Neon Database Connected!`);
    console.log(`   • Products: ${productCount}`);
    console.log(`   • Orders: ${orderCount}`);
    console.log(`   • Reviews: ${reviewCount}`);
    console.log(`   • Categories: ${categoryCount}`);
  } catch (err: any) {
    console.error('❌ Neon Database Error:', err.message);
  }

  console.log('\n--- Testing Cloudinary Connection ---');
  try {
    const res = await cloudinary.api.ping();
    console.log(`✅ Cloudinary Connected Successfully! Status:`, res.status);
    console.log(`   • Cloud Name: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
  } catch (err: any) {
    console.error('❌ Cloudinary Error:', err.message);
  }
}

testConnections()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
