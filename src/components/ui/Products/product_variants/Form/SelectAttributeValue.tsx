import React from "react";
import { AttributeSelected, VariantFormTypes } from "./VariantForm";
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
import { X } from "lucide-react";

interface SelectValueProps {
  attribute: AttributeSelected;
  form: VariantFormTypes;
  setForm: React.Dispatch<React.SetStateAction<VariantFormTypes>>;
  onRemoveAttribute: (id: string) => void;
}

const SelectAttributeValue: React.FC<SelectValueProps> = ({
  attribute,
  form,
  setForm,
  onRemoveAttribute,
}) => {
  const handleRemoveAttribute = (e: string) => {
    onRemoveAttribute(e);
  };
  const onChangeValue = (e: string) => {
    console.log("Estos son los seleccionados", form);

    setForm((prev) => ({
      ...prev,
      attributesSelected: [
        ...prev.attributesSelected.map((attributeForm) => {
          if (attributeForm.id === attribute.id) {
            return {
              ...attributeForm,
              selectedValue: {
                ...attribute.values.filter((value) => value.id === e)[0],
              },
            };
          }
          return attributeForm;
        }),
      ],
    }));
  };
  if (!attribute) {
    <div className="w-full h-full bg-black text-white">
      <p>EL ATRIBUTO NO SE HA CARGADO</p>
    </div>;
  }
  console.log("Se recibe", attribute);
  return (
    <div className="col-span-1">
      <div className="flex justify-between text-sm items-center h-xs">
        <div className="w-full text-xs">
          <p>{attribute.name}</p>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => {
              handleRemoveAttribute(attribute.id);
            }}
            className="bg-transparent hover:bg-transparent text-black"
          >
            <X />
          </Button>
        </div>
      </div>
      {/* <p>
        Valores del atributo {attribute.name || ""}, esto es el selector de
        valores
      </p>
      {JSON.stringify(attribute.attributeValues, null, 2)} */}
      <div className="col-span-1">
        <Select
          onValueChange={onChangeValue}
          value={attribute.selectedValue.id}
        >
          <SelectTrigger
            className="w-full text-xs bg-gray-300 text-gray-950 rounded-xs"
            iconColor="text-gray-500"
          >
            <SelectValue placeholder="Valor" />
          </SelectTrigger>

          <SelectContent content="No hay">
            <SelectGroup>
              <SelectLabel>Atributos</SelectLabel>
              {attribute.values.map((value) => {
                return (
                  <SelectItem key={value.id} value={value.id}>
                    {value.value}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectAttributeValue;
