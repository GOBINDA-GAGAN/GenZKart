import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent TypeScript errors about redeclaring global variables
  var prismaDb: PrismaClient | undefined;
}

const prisma = globalThis.prismaDb || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaDb = prisma;
}

export default prisma;