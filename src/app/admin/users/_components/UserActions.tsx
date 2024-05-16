"use client";

// -------------------------------- Import Modules ---------------------------------
// External
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// Internal
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteUser } from "../../_actions/users";

// ----------------------------------- Components ----------------------------------
export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteUser(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
