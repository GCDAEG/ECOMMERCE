"use client";
import React, { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./field";
import { Input } from "./input";
import { Button } from "./button";

interface AttributeValueFormProps {
  id: any;
}

const AttributeValueForm: React.FC<AttributeValueFormProps> = ({ id }) => {
  const [form, setForm] = useState<{ value: string; attribute_id: string }>({
    value: "",
    attribute_id: id,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/attribute_values/${id}`, {
        method: "POST",
        body: JSON.stringify({ ...form }),
        headers: {
          Content_type: "application/json",
        },
      });
      if (!response.ok) throw "No se pudo";
      return "si se pudo";
    } catch (error) {
      console.log(error, "no se pudo");
      return "no se pudio";
    }
  };

  return (
    <div className="component-name">
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Valor de atributo</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>Valor</FieldLabel>
              <Input
                name="value"
                onChange={handleChange}
                placeholder="Coloca el valor"
                value={form.value}
              ></Input>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Button type="submit">Crear</Button>
      </form>
      <p>{form.attribute_id}</p>
    </div>
  );
};

export default AttributeValueForm;
