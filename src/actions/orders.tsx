"use server";
// -------------------------------- Import Modules ---------------------------------
// External
import { Resend } from "resend";
import { z } from "zod";

// Internal
import db from "@/db/db";
import OrderHistoryEmail from "@/email/OrderHistory";

// ----------------------------------- Constants -----------------------------------
const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY as string);

// ----------------------------------- Functions -----------------------------------
// History of email orders
export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  // get the email from the email schema
  const result = emailSchema.safeParse(formData.get("email"));

  // if the received email is false, the entered email does not exist
  if (result.success === false) {
    return { error: "Invalid email address" };
  }

  // get the user from the reeived email and populate the user's data
  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  // if the user does not exist, the entered email is invalid
  if (user == null) {
    return {
      message:
        "Check your email to view your order history and download your products.",
    };
  }

  // map through the users orders and return each order with its download timeframe
  const orders = user.orders.map(async (order) => {
    return {
      ...order,
      downloadVerificationId: (
        await db.downloadVerification.create({
          data: {
            expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
            productId: order.product.id,
          },
        })
      ).id,
    };
  });

  // send the user an email of their order history
  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  });

  // if the email did not send, notify the suer to try again
  if (data.error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }

  // if the email sent, notify the user
  return {
    message:
      "Check your email to view your order history and download your products.",
  };
}
