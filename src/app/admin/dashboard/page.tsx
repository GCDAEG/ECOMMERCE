// pages/UsersTable.tsx o donde quieras
"use client";
import VariantForm from "@/components/ui/Products/product_variants/Form/VariantForm";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export default function Page() {
  return (
    <div className="p-8">
      <p>MUESTRA DE FORMULARIO</p>
      <VariantForm idVariant="28e67bf0-1b39-4733-8cc2-cff31a8ad871" />
    </div>
  );
}
