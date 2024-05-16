// -------------------------------- Import Modules ---------------------------------
// External
import { Suspense } from "react";

// Internal
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";

// ----------------------------------- Functions -----------------------------------
// Get all of the products from the database and cache them
const getProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
  });
}, ["/products", "getProducts"]);

// ----------------------------------- Components ----------------------------------
// Products Page
export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductsSuspense />
      </Suspense>
    </div>
  );
}

// Get all the products and create components for each one
async function ProductsSuspense() {
  const products = await getProducts();

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
