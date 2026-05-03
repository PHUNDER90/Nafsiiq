import { PrismaClient } from "@prisma/client" 
 
declare global { 
  // eslint-disable-next-line no-var 
  var __prisma: PrismaClient | undefined; 
} 
 
function createPrismaClient() { 
  return new PrismaClient(); 
} 
 
export const prisma = global.__prisma ?? createPrismaClient(); 
 
if (process.env.NODE_ENV !== "production") { 
  global.__prisma = prisma; 
} 
