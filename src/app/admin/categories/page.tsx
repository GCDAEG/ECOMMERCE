import CategorieForm from "@/components/ui/categorieForm";
import React from "react";
async function getCategories() {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("No se pudieron cargar las categorias");

  return res.json();
}
interface PageProps {}
const Page: React.FC<PageProps> = async ({}) => {
  const categories = await getCategories();
  console.log(categories);
  return (
    <div className="component-name">
      <h1>Categorias</h1>
      <ul className="bg-rose-200">{categories?.map((c) => c.name)}</ul>
      <div>
        <h1>Crear categoria</h1>
      </div>
      <CategorieForm />
    </div>
  );
};

export default Page;
