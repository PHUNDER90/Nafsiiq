import { PrismaClient } from "@prisma/client"; 
 
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }; 
 
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'; 
 
const createClient = () => new PrismaClient(); 
 
export const prisma = isBuild ? ({} as PrismaClient) : (globalForPrisma.prisma ?? createClient()); 
 
if (!isBuild && process.env.NODE_ENV !== "production") { 
  globalForPrisma.prisma = prisma; 
} 
