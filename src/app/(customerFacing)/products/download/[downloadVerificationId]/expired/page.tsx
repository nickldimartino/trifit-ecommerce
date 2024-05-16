// -------------------------------- Import Modules ---------------------------------
// External
import Link from "next/link";

// Internl
import { Button } from "@/components/ui/button";

// ----------------------------------- Components ----------------------------------
// Expired Component
export default function Expired() {
  return (
    <>
      <h1 className="text-4xl mb-4">Download link expired</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get New Link</Link>
      </Button>
    </>
  );
}
