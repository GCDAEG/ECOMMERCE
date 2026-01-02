import React, { RefObject, useEffect, useMemo, useState } from "react";
import { VariantFormTypes } from "./VariantForm";
import { AttributeWithValues } from "@/lib/types/dbtypes";
import SelectAttributeValue from "./SelectAttributeValue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
interface SelectAttributeProps {
  form: VariantFormTypes;
  setForm: React.Dispatch<React.SetStateAction<VariantFormTypes>>;
  allAttributes: RefObject<AttributeWithValues[]>;
  attributesSelectedIds: Set<string>;
  setAttributesSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const SelectAttribute: React.FC<SelectAttributeProps> = ({
  form,
  setForm,
  allAttributes,
  attributesSelectedIds,
  setAttributesSelectedIds,
}) => {
  const [addAttributeState, setAddAttributeState] = useState(false);
  const [selectValueState, setselectValueState] =
    useState<AttributeWithValues | null>(null);
  const availableAttributes = allAttributes.current.filter(
    (attribute) => !attributesSelectedIds.has(attribute.id)
  );

  const onValueChange = (e: string) => {
    const [attribute] = availableAttributes.filter(
      (attribute) => attribute.id === e
    );
    const attributeToAdd = {
      id: attribute.id,
      name: attribute.name,
      values: [...attribute.attributeValues],
      selectedValue: { value: "", id: "" },
    };

    setForm((prev) => ({
      ...prev,
      attributesSelected: [...prev.attributesSelected, attributeToAdd],
    }));
    //
    const newSet = new Set(attributesSelectedIds);
    newSet.add(e);
    setAttributesSelectedIds(newSet);
    addAttribute(false);
  };
  const addAttribute = (e: boolean) => {
    setAddAttributeState(e);
  };
  const onRemoveAttribute = (e: string) => {
    setForm((prev) => ({
      ...prev,
      attributesSelected: [
        ...prev.attributesSelected.filter(
          (attributeSelected) => attributeSelected.id !== e
        ),
      ],
    }));
    //

    const newSet = new Set(attributesSelectedIds);
    newSet.delete(e);
    setAttributesSelectedIds(newSet);
  };
  console.log("Se recibe en select attributes", availableAttributes);
  return (
    <div className="">
      {/* {JSON.stringify(availableAttributes, null, 2)} */}

      <div className="flex items-center justify-between px-2 h-8 ">
        <div>
          <p>Atributos</p>
        </div>
        <div>
          <Button
            type="button"
            className="text-xs h-full"
            onClick={() => addAttribute(true)}
          >
            <p>Agregar</p>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-2 relative">
        {form.attributesSelected.map((attributeSelected) => (
          <SelectAttributeValue
            onRemoveAttribute={onRemoveAttribute}
            attribute={attributeSelected}
            form={form}
            setForm={setForm}
            key={attributeSelected.id}
          ></SelectAttributeValue>
        ))}
        {addAttributeState ? (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white flex-col px-5">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="flex w-full justify-start">
                <p>Selecciona el atributo</p>
              </div>
              <Select
                onValueChange={onValueChange}
                value={selectValueState ? selectValueState.id : undefined}
              >
                <SelectTrigger
                  className="w-full text-xs bg-gray-600 text-white"
                  iconColor="text-white"
                >
                  <SelectValue placeholder="Hola"></SelectValue>
                </SelectTrigger>

                <SelectContent content="No hay">
                  <SelectGroup>
                    <SelectLabel>Atributos</SelectLabel>
                    {availableAttributes.map((attribute) => {
                      return (
                        <SelectItem key={attribute.id} value={attribute.id}>
                          {attribute.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="w-full flex justify-end">
                <Button type="button" onClick={() => addAttribute(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SelectAttribute;
