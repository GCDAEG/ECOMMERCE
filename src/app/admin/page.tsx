import Link from "next/link";

export default async function AdminPage() {
  return (
    <div>
      <div className="bg-black text-blue-500">
        <Link href={"/admin/products/new"}>Crear Producto</Link>
        <Link href={"/admin/categories/new"}>Crear Categoria</Link>
      </div>
    </div>
  );
}
