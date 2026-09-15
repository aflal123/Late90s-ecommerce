import { prisma } from '../lib/prisma';

async function main() {
  const schemas: any = await prisma.$queryRaw`SELECT schema_name FROM information_schema.schemata;`;
  console.log('ALL SCHEMAS IN DATABASE:');
  schemas.forEach((s: any) => console.log('•', s.schema_name));

  const allTables: any = await prisma.$queryRaw`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY table_schema, table_name;
  `;
  console.log('\nALL TABLES IN ALL SCHEMAS:');
  allTables.forEach((t: any) => console.log(`• ${t.table_schema}.${t.table_name}`));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
