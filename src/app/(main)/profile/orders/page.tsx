import Orders from "@/components/layout/orders/Orders";
import React from "react";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Orders />
    </div>
  );
};

export default Page;
