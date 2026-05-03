import { PrismaClient } from "@prisma/client"; 
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }; 
 
const prismaClientSingleton = () => { 
  if (!process.env.DATABASE_URL) { 
    throw new Error("DATABASE_URL is not defined"); 
  } 
  return new PrismaClient(); 
}; 
 
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton(); 
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 
