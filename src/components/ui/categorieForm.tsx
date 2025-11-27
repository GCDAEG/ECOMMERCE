"use client";
import React, { useState } from "react";
import { Button } from "./button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./field";
import { Input } from "./input";

interface CategorieFormProps {}

const CategorieForm: React.FC<CategorieFormProps> = ({}) => {
  const [form, setForm] = useState({
    name: "",
    slug: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({
        ...form,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      alert("❌ Error al crear categoria");
      return;
    }

    alert("✔ Categoria creada");
  };
  return (
    <div className="component-name">
      <div className="p-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Crear categoria</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel>Nombre de la categoria</FieldLabel>
                <Input
                  name="name"
                  placeholder="Nombre"
                  className="border p-2 w-full"
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel>Slug</FieldLabel>
                <Input
                  name="slug"
                  placeholder="Slug (zapatilla-nike-air)"
                  className="border p-2 w-full"
                  onChange={handleChange}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Crear Producto
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CategorieForm;
