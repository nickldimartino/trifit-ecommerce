"use server";

// -------------------------------- Import Modules ---------------------------------
// Internal
import db from "@/db/db";

// ---------------------------------- Functions ------------------------------------
// Function to check if the User Order exists for the received product
export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  );
}
