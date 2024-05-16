// -------------------------------- Import Modules ---------------------------------
// Internal
import { PageHeader } from "../../_components/PageHeader";
import { ProductForm } from "../_components/ProductForm";

// ----------------------------------- Componenets ----------------------------------
// New Products Page Component
export default function NewProductPage() {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </>
  );
}
