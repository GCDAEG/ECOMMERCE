import React from "react";
import { supabaseServer } from "@/lib/supabase/server";
interface ComponentNameProps {}
async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("No se pudieron cargar los productos");

  return res.json();
}

const ComponentName: React.FC<ComponentNameProps> = async ({}) => {
  const productos = await getProducts();

  return (
    <div className="min-h-screen bg-gray-400">
      <div>
        {productos?.map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    </div>
  );
};

export default ComponentName;
