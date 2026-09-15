import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Seeding late90s Streetwear Database...');

  // 1. Clear existing data safely
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Create Categories
  const categories = [
    {
      name: 'Oversized Tees',
      slug: 'tees',
      description: 'Heavyweight 240+ GSM vintage washed drop-shoulder boxy tees.',
      accent: '#dfff00',
      sortOrder: 1,
    },
    {
      name: 'Heavyweight Hoodies',
      slug: 'hoodies',
      description: '450 GSM custom French terry oversized distressed hoodies.',
      accent: '#ff3e3e',
      sortOrder: 2,
    },
    {
      name: 'Baggy Bottoms',
      slug: 'bottoms',
      description: 'Wide-leg 90s cargo pants, skate denims and cyber track pants.',
      accent: '#00f0ff',
      sortOrder: 3,
    },
    {
      name: 'Vintage Outerwear',
      slug: 'outerwear',
      description: 'Retro racing track jackets, nylon bombers and varsity coats.',
      accent: '#a855f7',
      sortOrder: 4,
    },
    {
      name: 'Accessories & Headwear',
      slug: 'accessories',
      description: 'Washed dad caps, corduroy bucket hats & tactical utility bags.',
      accent: '#ff007f',
      sortOrder: 5,
    },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  // 3. Create Streetwear Products with high quality imagery
  const products = [
    {
      name: 'LATE90S Acid Cyber Vintage Tee',
      description: 'Heavyweight 260 GSM combed cotton. Vintage stone-washed black finish, oversized drop-shoulder fit, signature late90s cyber chrome puff print on chest and back.',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
      category: 'tees',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
      featured: true,
    },
    {
      name: 'Archive 99 Washed Heavy Hoodie',
      description: '480 GSM French Terry heavyweight fleece. Double-layered hood without drawstrings, raw edge distressing at cuffs and hem, distressed vintage washed charcoal gray.',
      price: 2999,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      category: 'hoodies',
      sizes: ['M', 'L', 'XL', 'XXL'],
      inStock: true,
      featured: true,
    },
    {
      name: 'Subway Skate Baggy Denim Jeans',
      description: '14oz rigid raw-feel denim with authentic 90s vintage wash. Extreme wide-leg skater fit, reinforced knee panels, custom late90s embossed brass rivets.',
      price: 2699,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      category: 'bottoms',
      sizes: ['28', '30', '32', '34', '36'],
      inStock: true,
      featured: true,
    },
    {
      name: 'Tokyo Cyber Y2K Track Jacket',
      description: 'High-density micro-ripstop nylon with neon piping accents. Stand collar, retro color-block paneling, water-resistant finish, dual zip pullers.',
      price: 3499,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
      category: 'outerwear',
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true,
      featured: true,
    },
    {
      name: 'Matrix Matrix Glitch Boxy Tee',
      description: '240 GSM organic cotton in jet black with optic green digital screen print. Pre-shrunk, breathable, streetwear relaxed silhouette with ribbed collar.',
      price: 1399,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      category: 'tees',
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true,
      featured: false,
    },
    {
      name: 'Grunge Overdye Zip-Up Hoodie',
      description: 'Vintage mineral-washed burgundy hoodie. Chunky metal YKK 2-way zipper, kangaroo pockets, drop shoulders, heavy ribbed trims.',
      price: 3199,
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      category: 'hoodies',
      sizes: ['M', 'L', 'XL'],
      inStock: true,
      featured: false,
    },
    {
      name: 'Tactical Parachute Cargo Pants',
      description: 'Lightweight ultra-durable parachute nylon with ankle bungee cinches. 8 multi-depth 3D utility cargo pockets, relaxed silhouette.',
      price: 2499,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      category: 'bottoms',
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true,
      featured: false,
    },
    {
      name: 'Retro 1998 Washed Dad Cap',
      description: 'Unstructured 6-panel low-profile cotton twill cap. Vintage enzyme washed, brass buckle strapback, 3D contrast embroidery.',
      price: 899,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80',
      category: 'accessories',
      sizes: ['ONE SIZE'],
      inStock: true,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // 4. Create Approved Reviews
  const reviews = [
    {
      customerName: 'Aarav Mehta',
      rating: 5,
      comment: 'Quality on the 260 GSM tee is unbelievable! The WhatsApp ordering was super quick, confirmed in literally 2 minutes on chat.',
      approved: true,
    },
    {
      customerName: 'Rhea Sen',
      rating: 5,
      comment: 'The 480 GSM hoodie is the best heavyweight hoodie in India right now. Pure vintage 90s silhouette and super cozy.',
      approved: true,
    },
    {
      customerName: 'Devansh K.',
      rating: 5,
      comment: 'Baggy denim fits crazy good. WhatsApp checkout is 100x smoother than typical clunky checkout pages. Love the gen-z aesthetic.',
      approved: true,
    },
    {
      customerName: 'Sneha Roy',
      rating: 4,
      comment: 'Track jacket arrived in 3 days. Super dope styling and packaging with late90s stickers.',
      approved: true,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  console.log('✅ Database seeded successfully with late90s streetwear catalog!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
