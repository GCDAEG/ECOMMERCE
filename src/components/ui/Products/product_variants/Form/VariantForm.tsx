import {
  AttributeType,
  AttributeValues,
  AttributeWithValues,
} from "@/lib/types/dbtypes";
import React, { useEffect, useRef, useState } from "react";
import SelectAttribute from "./SelectAttribute";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";

//Atribute selected types
export type AttributeSelected = {
  id: string;
  name: string;
  values: AttributeValues[];
  selectedValue: { id: string; value: string };
};
//FORM TYPE
export type VariantFormTypes = {
  sku: string;
  price: number;
  stock: number;
  attributesSelected: AttributeSelected[];
  autoSku?: boolean;
  idVariant?: string;
  editAttributes?: boolean;
};
//PROPS
interface VariantFormProps {
  idVariant?: string;
  onSubmit: (
    form: VariantFormTypes
  ) => Promise<{ ok: boolean; message: string }>;
}
const VariantForm: React.FC<VariantFormProps> = ({ idVariant, onSubmit }) => {
  const [form, setForm] = useState<VariantFormTypes>({
    sku: "",
    price: 0,
    stock: 0,
    attributesSelected: [],
  });
  const initialAttributes = useRef<AttributeSelected[]>([]);
  const [attributesSelectedIds, setAttributesSelectedIds] = useState<
    Set<string>
  >(new Set([]));
  const allAttributes = useRef<AttributeWithValues[]>([]);
  const [autoSku, setAutoSku] = useState<CheckedState>(true);
  const [error, setError] = useState<{ ok: boolean; message: string }>({
    ok: false,
    message: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const verifChangesInAttributes = () => {
    const initialValues = initialAttributes.current;
    const formAttributes = form.attributesSelected;

    if (initialValues.length !== formAttributes.length) {
      return true;
    }

    return initialValues.some((initial) => {
      const current = formAttributes.find((attr) => attr.id === initial.id);

      if (!current) return true;

      return current.selectedValue.id !== initial.selectedValue.id;
    });
  };
  //Enviar formulario al backend
  const handleSubmit = async () => {
    const defaultForm = { ...form };
    const changesInAttributes = verifChangesInAttributes();
    if (autoSku) {
      defaultForm.autoSku = true;
    }
    if (idVariant) {
      defaultForm.idVariant = idVariant;
    }
    if (changesInAttributes) {
      defaultForm.editAttributes = true;
    }
    const response = await onSubmit(defaultForm);

    setError(response);
  };

  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const response = await fetch("/api/attributes").then((res) =>
          res.json()
        );

        if (!response) throw "No se pudo cargar los atributos";

        const attributes = response.data;

        allAttributes.current = attributes;
      } catch (error) {
        console.log(error);
      }
    };
    loadAttributes();
    const loadVariant = async () => {
      if (idVariant) {
        try {
          const response = await fetch(
            `/api/product_variants/${idVariant}`
          ).then((res) => res.json());

          if (!response) throw "No se pudo cargar la variante";
          console.log(response.data, "se carga?");
          setForm({ ...response.data });

          const selectAttributesIds: string[] = [
            ...response.data.attributesSelected.map(
              (attribute: { id: string }) => attribute.id
            ),
          ];
          setAttributesSelectedIds(new Set([...selectAttributesIds]));

          initialAttributes.current = [...response.data.attributesSelected];
        } catch (error) {
          console.log(error);
        }
      }
    };
    loadVariant();
  }, []);

  return (
    <div className="component-name">
      <p>Formulario</p>
      {/* {JSON.stringify(form, null, "\t")} */}
      <form>
        <FieldSet className="w-xs shadow-md bg-gray-100 rounded-sm text-gray-800 p-2">
          <FieldGroup>
            <FieldLegend className="font-bold">
              Creando/editando variante
            </FieldLegend>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLegend>Sku</FieldLegend>
              <div className="flex space-x-5">
                <Checkbox
                  checked={autoSku}
                  onCheckedChange={(e) => setAutoSku(e)}
                  className="w-5 h-5"
                />
                <p>Sku automatico</p>
              </div>
              <Input
                name="sku"
                onChange={handleChange}
                value={form.sku}
                disabled={autoSku === "indeterminate" ? false : autoSku}
                placeholder={autoSku ? "Automatico" : ""}
              ></Input>
            </Field>
            <FieldGroup className="flex-row ">
              <Field>
                <FieldLegend>Price</FieldLegend>
                <Input
                  name="price"
                  onChange={handleChange}
                  value={form.price}
                ></Input>
              </Field>
              <Field>
                <FieldLegend>Stock</FieldLegend>
                <Input
                  name="stock"
                  onChange={handleChange}
                  value={form.stock}
                ></Input>
              </Field>
            </FieldGroup>
          </FieldGroup>
          <FieldSeparator />
          <FieldGroup>
            <SelectAttribute
              allAttributes={allAttributes}
              attributesSelectedIds={attributesSelectedIds}
              setAttributesSelectedIds={setAttributesSelectedIds}
              form={form}
              setForm={setForm}
            />
          </FieldGroup>
          <Button type="button" onClick={handleSubmit}>
            Crear
          </Button>
        </FieldSet>
      </form>
      <p>Resultado del submit {JSON.stringify(error)}</p>
      {/* {JSON.stringify(allAttributes, null, "\t")}
      <p>Atributos iniciales</p>
      {JSON.stringify(initialAttributes, null, "\t")} */}
    </div>
  );
};

export default VariantForm;
