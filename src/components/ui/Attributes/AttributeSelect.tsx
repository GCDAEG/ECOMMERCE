"use client";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { FieldLabel } from "../field";
import { AttributeValues, AttributeWithValues } from "@/lib/types/dbtypes";
import AttributeSelectedVariantForm from "./AttributeSelectedVariantForm";
import {
  AttributeSelectedType,
  AttributeVariantForm,
  InterfaceVariantForm,
} from "../Products/product_variants/ProductVariantForm";
import { UUID } from "crypto";
import { Plus, X } from "lucide-react";
import { Button } from "../button";
import { SelectIcon } from "@radix-ui/react-select";
interface AttributeSelectProps {
  attributesVariantForm: AttributeVariantForm[];
  setAttributesVariantForm: React.Dispatch<
    React.SetStateAction<AttributeVariantForm[]>
  >;
  form: InterfaceVariantForm;
  setForm: React.Dispatch<React.SetStateAction<InterfaceVariantForm>>;
}

const AttributeSelect: React.FC<AttributeSelectProps> = ({
  attributesVariantForm,
  setAttributesVariantForm,
  form,
  setForm,
}) => {
  const [open, setOpen] = useState(false);
  const disabledPopover = !attributesVariantForm.some((avf) => !avf.selected);
  const alreadySelected = (id: string) => {
    return form.attributesSelected.some((as) => as.id === id);
  };
  //Add attribute
  const onValueChange = (value: string) => {
    const attributeSelected = getAttribute(value);

    const attributeToAdd: any = {
      ...attributeSelected,
    };
    const exist = alreadySelected(value);
    console.log(exist, "Existe?");
    if (!attributeSelected.selected) {
      setForm((prev) => ({
        ...prev,
        attributesSelected: [...prev.attributesSelected, attributeToAdd],
      }));
      setAttributesVariantForm((prev) =>
        prev.map((avf) => {
          if (avf.id === value) {
            return {
              ...avf,
              selected: true,
            };
          }
          return avf;
        })
      );
    }
    setOpen(false);
  };
  const removeAttribute = (value: string) => {
    setForm((prev) => ({
      ...prev,
      attributesSelected: [
        ...prev.attributesSelected.filter((att) => att.id !== value),
      ],
    }));
    setAttributesVariantForm((prev) =>
      prev.map((avf) => {
        if (avf.id === value) {
          return {
            ...avf,
            selected: false,
          };
        }
        return avf;
      })
    );
  };
  const getAttribute = (id: string) => {
    const [attribute] = attributesVariantForm.filter((att) => att.id == id);

    return attribute;
  };
  const getAttributeValue = (value: string, idAttribute: UUID) => {
    const attribute = getAttribute(idAttribute);
    console.log(attribute, "ATRIBUTO DE GETATTRIBUTE");
    const [attributeValue] = attribute.attributeValues.filter(
      (av) => av.id === value
    );

    return attributeValue;
  };

  //delete value
  const removeValue = (id: string, idAttribute: string) => {
    console.log(id, idAttribute, "Id del atributo");
    console.log("ME LLEGAAAAA");
    setForm((prev) => ({
      ...prev,
      attributesSelected: [
        ...prev.attributesSelected.map((att) => {
          if (att.id === idAttribute) {
            return {
              ...att,
              selectedValue: null,
            };
          }
          return att;
        }),
      ],
    }));
  };
  //Handle Popover
  const handleSelectState = (e: boolean) => {
    setOpen(e);
  };
  //AddValue
  const onValueChangeAttributeValue = (value: string, idAttribute: UUID) => {
    setForm((prev) => ({
      ...prev,
      attributesSelected: [
        ...prev.attributesSelected.map((att) => {
          if (att.id === idAttribute) {
            console.log("SE VA A GREGAR", att.selectedValue, "de ", att);
            return {
              ...att,
              selectedValue: att.attributeValues.filter(
                (avalue) => avalue.id === value
              )[0],
            };
          }
          return att;
        }),
      ],
    }));
  };

  return (
    <div className="flex mt-2">
      <div className="flex flex-col w-full">
        <FieldLabel asChild>
          <div className=" w-full flex justify-between">
            <div>
              <p>Atributos</p>
            </div>
            <Button
              type="button"
              className="rounded-full  h-2  text-xs cursor-pointer disabled:opacity-50"
              disabled={open}
              onClick={() => handleSelectState(true)}
            >
              <p>Añadir</p>
              <Plus />
            </Button>
          </div>
        </FieldLabel>
        <div className="grid grid-cols-3 gap-2 ">
          {form.attributesSelected.map((att) => (
            <AttributeSelectedVariantForm
              key={att.id}
              attributesVariantForm={attributesVariantForm}
              setAttributesVariantForm={setAttributesVariantForm}
              attributeSelected={att}
              form={form}
              setForm={setForm}
              onValueChangeAttributeValue={onValueChangeAttributeValue}
              removeAttribute={removeAttribute}
              removeValue={removeValue}
            ></AttributeSelectedVariantForm>
          ))}
          <div className="col-span-1 flex items-center w-full">
            {open ? (
              <div>
                <div className="text-sm flex justify-between items-center">
                  <div className="text-sm">
                    <p>Atributo</p>
                  </div>
                  <div>
                    <Button
                      className="rounded-full cursor-pointer hover:bg-transparent bg-transparent text-black p-0"
                      onClick={() => handleSelectState(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
                <Select onValueChange={onValueChange}>
                  <SelectTrigger
                    className="w-full text-xs bg-gray-600 text-white"
                    iconColor="text-white"
                  >
                    <p className="text-xs truncate text-gray-50">Seleccionar</p>
                  </SelectTrigger>

                  <SelectContent content="No hay">
                    <SelectGroup>
                      <SelectLabel>Atributos</SelectLabel>
                      {attributesVariantForm.map((cat) => {
                        if (!cat.selected) {
                          console.log("No esta seleccionado, asi que pasa");
                          return (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          );
                        }
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeSelect;
