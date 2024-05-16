// -------------------------------- Import Modules ---------------------------------
// External
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

// Internal
import db from "@/db/db";

// ----------------------------------- Functions -----------------------------------
// GET request
export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // find the requested product
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  });

  // return not found if the product was not found in the database
  if (product == null) return notFound();

  // save the products file/image path and extension
  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split(".").pop();

  // respond with the products header to download
  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
