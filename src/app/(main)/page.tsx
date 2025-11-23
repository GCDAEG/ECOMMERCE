import React from "react";
import { supabaseServer } from "@/lib/supabase/server";
interface ComponentNameProps {}

const ComponentName: React.FC<ComponentNameProps> = async ({}) => {
  const supabase = await supabaseServer();

  const { data: products, error } = await supabase.from("products").select("*");
  console.log((await supabase.from("products").select("*")).data);

  return (
    <div className="min-h-screen bg-black">
      <p>
        {products?.map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </p>
    </div>
  );
};

export default ComponentName;
