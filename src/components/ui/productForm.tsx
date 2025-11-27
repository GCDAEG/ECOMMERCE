"use client";
import React, { useEffect, useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./field";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";

interface ProductFormProps {}

const ProductForm: React.FC<ProductFormProps> = ({}) => {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
  });
  const [products, setProducts] = useState<any[]>([]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      alert("❌ Error al crear producto");
      return;
    }

    alert("✔ Producto creado");
  };
  const getProducts = async () => {
    const res = await fetch("http://localhost:3000/api/products", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("No se pudieron cargar los productos");

    return res.json();
  };

  useEffect(() => {
    const loadProducts = async () => {
      const products = await getProducts();
      console.log(products, "culero");
      if (products) setProducts(products);
    };
    loadProducts();
  }, []);
  return (
    <div className="p-6 max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Crear producto</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del producto</FieldLabel>
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
          <Field>
            <FieldLabel>Descripcion</FieldLabel>
            <Textarea
              name="description"
              placeholder="Descripción"
              className="border p-2 w-full"
              onChange={handleChange}
            />
          </Field>
          <Field>
            <FieldLabel>Precio</FieldLabel>
            <Input
              type="number"
              name="price"
              placeholder="Precio"
              className="border p-2 w-full"
              onChange={handleChange}
            />
          </Field>
        </FieldSet>

        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear Producto
        </Button>
      </form>
      <ul>{products ? products.map((p) => p.name) : "nada"}</ul>
    </div>
  );
};

export default ProductForm;
