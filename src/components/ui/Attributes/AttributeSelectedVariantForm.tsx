"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Plus, Trash2, X } from "lucide-react";
import {
  AttributeSelectedType,
  AttributeVariantFormType,
  InterfaceVariantForm,
} from "../Products/product_variants/ProductVariantForm";
import { UUID } from "crypto";
import { Badge } from "../badge";
import { Button } from "../button";
import AttributeValueForm from "./AttributeValueForm";
import { AttributeValues } from "@/lib/types/dbtypes";

interface AttributeVariantFormProps {
  onValueChangeAttributeValue: (e: string, f: UUID) => void;
  removeValue: (e: string, idAttribute: string) => void;
  removeAttribute: (e: string) => void;
  attributeSelected: AttributeSelectedType;
  form: InterfaceVariantForm;
  setForm: React.Dispatch<React.SetStateAction<InterfaceVariantForm>>;
  attributesVariantForm: AttributeVariantFormType[];
  setAttributesVariantForm: React.Dispatch<
    React.SetStateAction<AttributeVariantFormType[]>
  >;
}

const AttributeVariantForm: React.FC<AttributeVariantFormProps> = ({
  onValueChangeAttributeValue,
  removeAttribute,
  attributeSelected,
  form,
  setForm,
  attributesVariantForm,
  setAttributesVariantForm,
}) => {
  const [creatingValue, setCreatingValue] = useState(false);
  const [selectedValue, setSelectValue] = useState<AttributeValues | null>();
  const onSelectValue = (idValue: string) => {
    const [value] = attributeSelected.attributeValues.filter(
      (aValue) => aValue.id === idValue
    );

    setSelectValue(value);
  };
  const handleCreateValue = async (formValue: {
    value: string;
    attribute_id: string;
  }) => {
    // enviar nuevo valor al backend usando AttributeValueForm o API
    try {
      const response = await fetch(`/api/attribute_values`, {
        method: "POST",
        body: JSON.stringify({
          ...formValue,
        }),
        headers: {
          Content_type: "application/json",
        },
      }).then((res) => res.json());

      if (!response.data) throw "No se logro crear el valor.";
      setTimeout(() => setCreatingValue(false), 1500);

      setForm({
        ...form,
        attributesSelected: [
          ...form.attributesSelected.map((as) => {
            if (as.id === attributeSelected.id) {
              return {
                ...as,
                attributeValues: [...as.attributeValues, response.data],
              };
            }
            return {
              ...as,
            };
          }),
        ],
      });
      setAttributesVariantForm([
        ...attributesVariantForm.map((att) => {
          if (att.id === attributeSelected.id) {
            return {
              ...att,
              attributeValues: [...att.attributeValues, response.data],
            };
          }
          return att;
        }),
      ]);
      return {
        ok: true,
        message: "Valor creado con exito.",
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error,
      };
    }
  };
  useEffect(() => {
    if (attributeSelected.selectedValue) {
      setSelectValue({ ...attributeSelected.selectedValue });
    }
  }, []);

  return (
    <div className="col-span-1 flex flex-col rounded-md">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col w-full">
          <div className="text-sm flex justify-between items-center">
            <div>
              <p>{attributeSelected.name}</p>
            </div>
            <div>
              <Button
                className="rounded-full cursor-pointer hover:bg-transparent bg-transparent text-black p-0"
                onClick={() => removeAttribute(attributeSelected.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <Select
              onValueChange={(id) => {
                onValueChangeAttributeValue(id, attributeSelected.id);
                onSelectValue(id);
              }}
            >
              <SelectTrigger className="text-xs w-full cursor-pointer text-black opac rounded-none bg-gray-200 ">
                {selectedValue ? (
                  <p className="opacity-100 text-black">
                    {selectedValue.value}
                  </p>
                ) : (
                  <p>{attributeSelected.name}</p>
                )}
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel asChild className="border-b border-b-grat-200">
                    <div className="flex justify-between">
                      <p>Valores</p>
                      <button
                        className="text-gray-500 text-xs hover:underline w-4 rounded-full hover:text-black cursor-pointer"
                        onClick={() => setCreatingValue(true)}
                      >
                        <Plus className="size-full" />
                      </button>
                    </div>
                  </SelectLabel>

                  {attributeSelected.attributeValues.map((attv) => (
                    <SelectItem key={attv.id} value={attv.id}>
                      {attv.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Create new value inline */}
      <Dialog open={creatingValue} onOpenChange={setCreatingValue}>
        <DialogContent className="relative">
          <DialogHeader>
            <DialogTitle>Crear valor</DialogTitle>
          </DialogHeader>

          <AttributeValueForm
            idAttribute={attributeSelected.id}
            onSubmit={handleCreateValue}
          ></AttributeValueForm>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttributeVariantForm;
