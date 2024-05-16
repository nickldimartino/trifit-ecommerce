"use server";

// -------------------------------- Import Modules ---------------------------------
// External
import { notFound } from "next/navigation";

// Internal
import db from "@/db/db";

// ----------------------------------- Functions -----------------------------------
// detele a user from the database
export async function deleteUser(id: string) {
  const user = await db.user.delete({
    where: { id },
  });

  if (user == null) return notFound();

  return user;
}
