// -------------------------------- Import Modules ---------------------------------
// External
import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

// ------------------------------- Type Declarations -------------------------------
type Callback = (...args: any[]) => Promise<any>;

// ----------------------------------- Functions -----------------------------------
// Cache the received keyparts and options
export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}
