// -------------------------------- Import Modules ---------------------------------
// External
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

// Internal
import db from "@/db/db";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

// -------------------------------- Constant Variables -----------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

// POST function
export async function POST(req: NextRequest) {
  // create the event for Stripe
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  // check if the event succedded
  if (event.type === "charge.succeeded") {
    // save the event details
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    // find the current product in the database
    const product = await db.product.findUnique({ where: { id: productId } });

    // return Bad Request if the product or email doesn't exist
    if (product == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // save the email and order in the user fields
    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents } },
    };
    // save the order to the current user in the database
    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    // create the download verification timeframe to the product in the database
    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    // send the email confirmation for the order
    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      text: "hi",
    });
  }

  return new NextResponse();
}

/* 
react: (
        <PurchaseReceiptEmail
          order={order}
          product={product}
          downloadVerificationId={downloadVerification.id}
        />
      ),

*/
