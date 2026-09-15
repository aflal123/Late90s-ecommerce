import { prisma } from '../lib/prisma';

async function main() {
  const info: any = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
  console.log('✅ DIRECT CONNECTION TO YOUR NEON DATABASE CONFIRMED:');
  console.log('• Database Name:', info[0].current_database);
  console.log('• Database User:', info[0].current_user);
  console.log('• Host Endpoint: ep-holy-dawn-a1san211-pooler.ap-southeast-1.aws.neon.tech');
  console.log('• Engine Version:', info[0].version.split(' on ')[0]);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
