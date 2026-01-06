"use client";
import React, { useEffect, useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../field";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Button } from "../button";
import CategorieSelect from "../categories/CategorieSelect";
import { Categorie } from "@/lib/types/dbtypes";
import { CheckCircle2 } from "lucide-react";
export interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  price: number;
  categories: Categorie[];
}
interface ProductFormProps {
  initialData?: ProductFormState;
  onSubmit: (e: ProductFormState) => Promise<{ ok: boolean; message: string }>;
}
const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState<ProductFormState>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      categories: [],
    }
  );
  const [error, setError] = useState<{
    ok: boolean;
    message: string;
    show: boolean;
  }>({
    ok: false,
    message: "",
    show: false,
  });
  const [categories, setCategories] = useState<Categorie[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const result = await onSubmit(form);
    setError({ ...result, show: true });
  };
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`/api/categories`, {
          cache: "no-store",
        });
        if (!response.ok) throw "No se pudo obtener las categorias.";

        const { data } = await response.json();

        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="w-full h-full ">
      <form className="p-6 max-w-lg mx-auto">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del producto</FieldLabel>
              <Input
                name="name"
                placeholder="Nombre"
                onChange={handleChange}
                value={form.name}
              />
            </Field>

            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input
                name="slug"
                placeholder="Slug"
                onChange={handleChange}
                value={form.slug}
              />
            </Field>

            <Field>
              <FieldLabel>Descripción</FieldLabel>
              <Textarea
                name="description"
                placeholder="Descripción"
                value={form.description}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel>Precio</FieldLabel>
              <Input
                type="number"
                name="price"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <CategorieSelect
                form={form}
                setForm={setForm}
                categories={categories}
              />
            </Field>
          </FieldGroup>

          <Button
            type="button"
            className=" text-white px-4 py-2 rounded"
            onClick={() => handleSubmit()}
          >
            Crear Producto
          </Button>
        </FieldSet>
        {error.show ? (
          error.ok ? (
            <div className="absolute z-50 top-0 left-0 w-full h-full bg-white flex justify-center items-center">
              <div className="flex flex-col items-center space-y-5 w-full">
                <CheckCircle2 className="size-1/3 text-green-500" />
                <p className="text-green-500 font-bold">{error.message}</p>
              </div>
            </div>
          ) : (
            <p className="text-red-500">{error.message}</p>
          )
        ) : null}
      </form>
    </div>
  );
};

export default ProductForm;
