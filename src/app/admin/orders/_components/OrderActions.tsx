"use client";

// -------------------------------- Import Modules ---------------------------------
// External
import { useTransition } from "react";
import { useRouter } from "next/navigation";

// Internal
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteOrder } from "../../_actions/orders";

// ---------------------------------- Components -----------------------------------
// Delete Droptdown Menu List
export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteOrder(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
