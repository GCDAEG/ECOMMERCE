import Link from "next/link";
import React from "react";

interface HeaderDashboardProps {}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({}) => {
  return (
    <div className="w-full h-12 bg-black">
      <ul className="flex h-full items-center space-x-5 text-white pl-5">
        <Link href={"/admin/"}>Home</Link>
        <Link href={"/admin/orders"}>Ordenes</Link>
        <Link href={"/admin/products"}>Productos</Link>
        <Link href={"/admin/categories"}>Categorias</Link>
        <Link href={"/admin/attributes"}>Atributos</Link>
      </ul>
    </div>
  );
};

export default HeaderDashboard;
