"use server";

// -------------------------------- Import Modules ---------------------------------
// External
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Interl
import db from "@/db/db";

// ----------------------------------- Constants -----------------------------------
const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

// ----------------------------------- Functions -----------------------------------
// Add a product to the database
export async function addProduct(prevState: unknown, formData: FormData) {
  // save the new product as an addSchema
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  // if the new product wasn't saved, return the error
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  // save the data from the new product
  const data = result.data;

  // save the directory of the new product file
  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  // save the directory of the new product image
  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  // create the product in the database
  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

// schema for a product to edit
const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

// Edit a product in the database
export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  // save the product to edit
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));

  // if the saved product failed, return the errors
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  // save the data of the saved product
  const data = result.data;

  // find the product in the database
  const product = await db.product.findUnique({ where: { id } });

  // if the product wasn't found then return not found
  if (product == null) return notFound();

  // save the products file path
  let filePath = product.filePath;

  // if the file exists then make the edits
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(product.filePath);
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  // save the products image path
  let imagePath = product.imagePath;

  // if the image exists, make the image edits
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  // update the product in the database
  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

// Update a products availability
export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  // update the product in the database
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });

  revalidatePath("/");
  revalidatePath("/products");
}

// delete a product in the database
export async function deleteProduct(id: string) {
  // delete and save the product
  const product = await db.product.delete({ where: { id } });

  // if the product doesn't exist return not found
  if (product == null) return notFound();

  // remove the file and image path
  await fs.unlink(product.filePath);
  await fs.unlink(`public${product.imagePath}`);

  revalidatePath("/");
  revalidatePath("/products");
}
