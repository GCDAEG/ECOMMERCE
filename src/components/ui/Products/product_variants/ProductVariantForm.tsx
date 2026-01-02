"use client";
import { UUID } from "crypto";
import React, { useEffect, useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../../field";
import { Input } from "../../input";
import {
  AttributeValues,
  AttributeWithValues,
  BaseProduct,
  CleanProduct,
} from "@/lib/types/dbtypes";
import AttributeSelect from "../../Attributes/AttributeSelect";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import { CircleQuestionMark } from "lucide-react";
import { Checkbox } from "../../checkbox";
import { Skeleton } from "../../skeleton";
export interface InterfaceVariantForm {
  sku: string;
  price: string;
  stock: string;
  attributesSelected: AttributeSelectedType[];
}
export type AttributeSelectedType = {
  id: UUID;
  name: string;
  attributeValues: AttributeValues[];
  selectedValue: AttributeValues | null;
};
export interface AttributeVariantFormType extends AttributeWithValues {
  selected: boolean;
  selectedValue: any;
}
//COMPONENT PROPS
interface ProductVariantFormProps {
  onSubmit:()=>
  variantId?: string;
}
const ProductVariantForm: React.FC<ProductVariantFormProps> = ({
  productId,
  variantId,
}) => {
  const [loading, setLoading] = useState(false);
  const [cleanProduct, setCleanProduct] = useState<CleanProduct | any>();
  const [form, setForm] = useState<InterfaceVariantForm>({
    sku: "",
    price: "",
    stock: "",
    attributesSelected: [],
  });
  const [autoSku, setAutoSku] = useState<boolean>(true);
  const [attributesVariantForm, setAttributesVariantForm] = useState<
    AttributeVariantFormType[]
  >([]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCreateVariant = async () => {
    const body = variantId
      ? {
          ...form,
          autoSku: autoSku,
          productName: cleanProduct.product.name,
          product_id: cleanProduct.product.id,
          variant_id: variantId,
        }
      : {
          ...form,
          autoSku: autoSku,
          productName: cleanProduct.product.name,
          product_id: cleanProduct.product.id,
        };
    console.log("Se envia", body);
    try {
      const res = await fetch("/api/product_variants", {
        method: variantId ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        return { ok: false, message: "Error al crear la categoría" };
      }
      setForm({ sku: "", price: "", stock: "", attributesSelected: [] });
      return { ok: true, message: "Categoría creada exitosamente" };
    } catch (error) {
      return { ok: false, message: "Error de servidor" };
    }
  };

  useEffect(() => {
    const loadAttributes = async () => {
      const response = await fetch("/api/attributes")
        .then((res) => res.json())
        .catch((error) =>
          console.log("Ocurrio un error al llamar los atributos", error)
        );
      console.log(response, "RESPUESTA AL LLAMAR ATRIBUTOS");
      setAttributesVariantForm([
        ...response.data.map((att) => ({
          ...att,
          selected: false,
          selectedValue: {},
        })),
      ]);
    };
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`).then((res) =>
          res.json()
        );

        if (!response.data) throw "No se pudo cargar el producto";
        console.log("Esto se response al pedir el producto, ", response.data);
        setCleanProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        return null;
      }
    };
    const loadVariant = async () => {
      if (variantId) {
        setLoading(true);
        const response = await fetch(`/api/product_variants/${variantId}`).then(
          (res) => res.json()
        );
        console.log(
          "ESTO RESPONSE AL PEDIR PARA EL FORMULARIO  1111111",
          response.data
        );
        setForm({ ...response.data });
        setAttributesVariantForm((prev) => [
          ...prev.map((avf) => {
            const isSelected = response.data.attributesSelected.some(
              (att) => att.id === avf.id
            );
            if (isSelected) {
              return {
                ...avf,
                selected: true,
              };
            }
            return avf;
          }),
        ]);
        setLoading(false);
      }
    };
    loadVariant();
    loadProduct();
    loadAttributes();
  }, []);
  useEffect(() => {
    console.log(
      form,
      "Formulario cargado",
      variantId ? "Modo Edicion" : "Modo creacion"
    );
  }, [form]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center bg-gray-50">
      <form className="w-full max-w-md mx-auto border shadow-md p-5 rounded-md">
        <FieldSet>
          <FieldLegend>
            {!variantId
              ? "Creando variante de producto"
              : "Editando variante de producto"}
          </FieldLegend>
          <FieldGroup>
            <FieldGroup className="flex-row items-center">
              <Field>
                <FieldLabel>Sku</FieldLabel>
                <FieldGroup className="flex-row">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="finder-pref-9k2-hard-disks-ljj"
                      checked={autoSku}
                      onCheckedChange={() => setAutoSku((prev) => !prev)}
                    />
                    <FieldLabel
                      htmlFor="finder-pref-9k2-hard-disks-ljj"
                      className="font-normal text-xs"
                      defaultChecked
                    >
                      Automatico
                    </FieldLabel>
                  </Field>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleQuestionMark />
                    </TooltipTrigger>
                    <TooltipContent className="flex bg-white font-medium flex-col p-2 max-w-44 shadow-sm border">
                      <p className="font-bold text-gray-700">
                        SKU (Stock Keeping Unit):
                      </p>
                      <p className="text-gray-500">
                        Un código único que identifica una variante específica
                        del producto <br /> (por ejemplo: remera-roja-L). <br />{" "}
                        Ayuda a organizar el inventario y buscar productos
                        rápidamente.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </FieldGroup>
                <Input
                  onChange={handleChange}
                  placeholder="Sku"
                  name="sku"
                  disabled={autoSku}
                  value={form.sku}
                  className="disabled:shadow-none"
                ></Input>
                <Field />
              </Field>
            </FieldGroup>
            <FieldSeparator />

            {/* Precio y stock */}
            <FieldGroup className="flex-row">
              <Field>
                <FieldLabel>Stock</FieldLabel>
                <Input
                  value={form.stock}
                  onChange={handleChange}
                  name="stock"
                  placeholder="Stock"
                ></Input>
              </Field>
              <Field>
                <FieldLabel>Precio</FieldLabel>
                <Input
                  value={form.price}
                  onChange={handleChange}
                  name="price"
                  placeholder="Precio"
                ></Input>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </FieldSet>
        <AttributeSelect
          form={form}
          setForm={setForm}
          attributesVariantForm={attributesVariantForm}
          setAttributesVariantForm={setAttributesVariantForm}
        ></AttributeSelect>
        <button type="button" onClick={handleCreateVariant}>
          Guardar
        </button>
      </form>
    </div>
  );
};
export default ProductVariantForm;

//ARREGLAR EL ERROR CON EL .MAP
