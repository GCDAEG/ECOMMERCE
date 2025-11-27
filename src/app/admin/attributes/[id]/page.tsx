"use client";

import AttributeValueForm from "@/components/ui/AttributeValueForm";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface PageProps {}
const Page: React.FC<PageProps> = ({}) => {
  const { id } = useParams();
  const [attribute, setAttribute] = useState<any>({});
  const [values, setValues] = useState<any[]>([]);

  useEffect(() => {
    async function loadAttribute() {
      const { attribute } = await fetch(`/api/attributes/${id}`).then((res) =>
        res.json()
      );

      setAttribute(attribute);
      console.log(attribute);
    }
    loadAttribute();
    async function loadValues() {
      const { data } = await fetch(`/api/attribute_values/${id}`).then((res) =>
        res.json()
      );
      console.log(data, "VALORES DEL ATRIBUTO");
      setValues([...values, data]);
    }
    loadValues();
  }, []);

  return (
    <div className="component-name">
      {attribute.name || "nada"}
      <h2 className="text-xl">valores</h2>
      <AttributeValueForm id={id} />
      {values ? values.map((v) => <div key={v.id}>{v.value}</div>) : "nada"}
    </div>
  );
};

export default Page;
