import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is explicitly set for the environment
process.env.DATABASE_URL = "file:c:/Users/Admin/.gemini/antigravity/scratch/EVOLVE/platform/prisma/dev.db";

const globalForPrisma = globalThis;

// Instantiate without arguments, Prisma v7.5.0 relies on the env var natively
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
