import { prisma } from '../lib/prisma';

async function main() {
  const tables: any = await prisma.$queryRaw`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    ORDER BY table_name;
  `;
  console.log('=== ALL TABLES FOUND IN NEON POSTGRESQL ===');
  tables.forEach((t: any) => console.log(`• ${t.table_schema}.${t.table_name}`));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
