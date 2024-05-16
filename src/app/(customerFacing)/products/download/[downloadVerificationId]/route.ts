// -------------------------------- Import Modules ---------------------------------
// External
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

// Internal
import db from "@/db/db";

// ----------------------------------- Functions -----------------------------------
// Get Request
export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  // get the product with the download verification
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });

  // if there's no data then the product expired
  if (data == null) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url)
    );
  }

  // save the current products information
  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const extension = data.product.filePath.split(".").pop();

  // respond with the current proudcts file to download
  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
