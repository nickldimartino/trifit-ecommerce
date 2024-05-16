// -------------------------------- Import Modules ---------------------------------
// External
import Stripe from "stripe";

// Internal
import db from "@/db/db";
import { notFound } from "next/navigation";
import { CheckoutForm } from "./_components/CheckoutForm";

// ----------------------------------- Constant ------------------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// ----------------------------------- Components ----------------------------------
// Purchase Page
export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  // find the current product in the database
  const product = await db.product.findUnique({ where: { id } });

  // return not found if the current product wasn't in the database
  if (product == null) return notFound();

  // create a Stripe payment intent for the current product
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  });

  // if the payment's client secret is null then Stripe did not create a payment intent
  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  // return the current product component
  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
