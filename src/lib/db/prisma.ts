import { PrismaClient } from "@prisma/client"; 
 
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }; 
 
if (!process.env.DATABASE_URL) { 
  throw new Error("DATABASE_URL environment variable is not set"); 
} 
 
let prisma: PrismaClient; 
prisma = globalForPrisma.prisma ?? new PrismaClient(); 
 
if (process.env.NODE_ENV !== "production") { 
  globalForPrisma.prisma = prisma; 
} 
 
export { prisma }; 
