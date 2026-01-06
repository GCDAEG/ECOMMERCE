"use client";

import AttributeForm, {
  FormAttributeTypes,
} from "@/components/ui/Attributes/AttributeForm";
import AttributeValueForm from "@/components/ui/Attributes/AttributeValueForm";
import { Button } from "@/components/ui/button";
import { AttributeType, AttributeWithValues } from "@/lib/types/dbtypes";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../dialog";
import { Skeleton } from "../skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
const Attribute = ({}) => {
  const { id } = useParams();
  const [attribute, setAttribute] = useState<AttributeWithValues | null>(null);
  const [editAttribute, setEditAttribute] = useState(false);
  const [createValue, setCreateValue] = useState(false);
  const toggleEdit = () => {
    setEditAttribute(!editAttribute);
  };
  const handleEditAttribute = async (form: FormAttributeTypes) => {
    if (!attribute) return;
    const response = await fetch(`/api/attributes/${attribute.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...form }),
    }).then((res) => res.json());
    if (response.error) {
      return {
        ok: false,
        message: "Ocurrio un error al editar el atributo.",
      };
    }
    const survivingValues = [
      ...attribute.attributeValues.filter(
        (value) => !form.deletedValueIds.includes(value.id)
      ),
    ];
    setAttribute({
      ...response.data.attribute,
      attributeValues: [...survivingValues, ...response.data.newValues],
    });

    setTimeout(() => setEditAttribute(false), 1500);
    return {
      ok: true,
      message: "Atributo editado exitosamente.",
    };
  };
  useEffect(() => {
    async function loadAttribute() {
      const { attribute } = await fetch(`/api/attributes/${id}`).then((res) =>
        res.json()
      );

      console.log(attribute, "Atributo");
      setAttribute({
        ...attribute,
        attributeValues: [...attribute.attribute_values],
      });
    }
    loadAttribute();
  }, [id]);
  if (!attribute) {
    return (
      <div className="space-y-4 px-5 pt-5">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  return (
    <div className="component-name">
      <div className="w-full h-12 border-b flex space-x-2 items-center px-2 justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {attribute ? attribute.name : "nada"}
          </h1>
        </div>
        <Button onClick={toggleEdit} className="rounded-xs">
          Editar atributo
        </Button>
      </div>
      <Table>
        <TableCaption>Lista de categorias</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-auto min-h-full ">
          {attribute.attributeValues.map((value, index) => (
            <TableRow
              key={value.id}
              className="odd:bg-gray-200 even:bg-gray-100 cursor-pointer"
            >
              <TableCell>{value.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Dialog's */}
      <Dialog open={createValue} onOpenChange={setCreateValue}>
        <DialogContent className="p-0">
          <AttributeValueForm id={id} setAttribute={setAttribute} />
        </DialogContent>
      </Dialog>
      <Dialog open={editAttribute} onOpenChange={setEditAttribute}>
        <DialogContent className="p-0">
          <AttributeForm
            initialData={attribute}
            onSubmit={handleEditAttribute}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attribute;
