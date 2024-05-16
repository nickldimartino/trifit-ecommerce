"use server";

// -------------------------------- Import Modules ---------------------------------
// External
import { notFound } from "next/navigation";

// Interla
import db from "@/db/db";

// ----------------------------------- Functions -----------------------------------
export async function deleteOrder(id: string) {
  // delete the order in the database
  const order = await db.order.delete({
    where: { id },
  });

  // return not found if the order was not found in the database
  if (order == null) return notFound();

  return order;
}
