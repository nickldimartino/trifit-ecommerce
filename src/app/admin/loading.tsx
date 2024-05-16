// -------------------------------- Import Modules ---------------------------------
// External
import { Loader2 } from "lucide-react";

// ----------------------------------- Components ----------------------------------
// Admin loading component
export default function AdminLoading() {
  return (
    <div className="flex justify-center">
      <Loader2 className="size-24 animate-spin" />
    </div>
  );
}
