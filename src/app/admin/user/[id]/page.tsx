import { useParams } from "next/navigation";
import React from "react";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  const id = useParams();
  return <div className="component-name"></div>;
};

export default Page;
