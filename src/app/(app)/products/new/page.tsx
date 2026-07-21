import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-zinc-900">Añadir producto</h1>
      <ProductForm />
    </div>
  );
}
