// -------------------------------- Import Modules ---------------------------------
// External
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ----------------------------------- Functions -----------------------------------
// combines the React and Tailwind class names to prevent collisions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
