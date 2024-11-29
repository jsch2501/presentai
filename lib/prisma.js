import { PrismaClient } from '@prisma/client';

// Debug: Ausgabe der Umgebungsvariablen
console.log('Current DATABASE_URL:', process.env.DATABASE_URL);

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      log: ['query', 'info', 'warn', 'error']
    });
  }
  prisma = global.prisma;
}

// Test connection
prisma.$connect()
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.error('Database connection error:', {
      error: error.message,
      code: error.code,
      clientVersion: error.clientVersion,
      meta: error.meta
    });
  });

export default prisma;

