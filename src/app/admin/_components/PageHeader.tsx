// -------------------------------- Import Modules ---------------------------------
// External
import React, { ReactNode } from "react";

// ---------------------------------- Components -----------------------------------
export function PageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl mb-4 text-yellowgreen">{children}</h1>;
}
