import Orders from "@/components/layout/orders/Orders";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {}

const Page: React.FC<PageProps> = async ({}) => {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // si está logueado, obtenés sus órdenes
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id);
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Orders orders={orders} />
    </div>
  );
};

export default Page;
