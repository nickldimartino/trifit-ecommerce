// -------------------------------- Import Modules ---------------------------------
// External
import { PrismaClient } from "@prisma/client";

// Returns the Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Declars global prisma type with the new Prisma Client
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Saves the current Prisma database
const db = globalThis.prisma ?? prismaClientSingleton();

// Exports the database
export default db;

// Set the Prisma Client to the current database if the node envirnment
// variable is not in production
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
