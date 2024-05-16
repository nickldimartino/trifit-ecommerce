"use client";

// -------------------------------- Import Modules ---------------------------------
// External
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

// Internal
import { cn } from "@/lib/utils";

// ----------------------------------- Components ----------------------------------
// Nav Bar
export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-celestialblue text-primary-foreground flex justify-center px-4">
      {children}
    </nav>
  );
}

// Nav Bar Links
export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-frenchblue hover:text-citrine focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathname === props.href && "bg-background text-foreground"
      )}
    />
  );
}
