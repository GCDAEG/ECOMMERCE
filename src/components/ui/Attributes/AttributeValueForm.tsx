"use client";
import React, { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../field";
import { Input } from "../input";
import { Button } from "../button";
import { AttributeValues, AttributeWithValues } from "@/lib/types/dbtypes";
import { CheckCircle2 } from "lucide-react";

interface AttributeValueFormProps {
  idAttribute: string;
  initialData?: { value: string; attribute_id: string };
  onSubmit: (
    p: AttributeValues | { value: string; attribute_id: string }
  ) => Promise<{ ok: boolean; message: string }>;
}

const AttributeValueForm: React.FC<AttributeValueFormProps> = ({
  idAttribute,
  initialData,
  onSubmit,
}) => {
  const [form, setForm] = useState<{ value: string; attribute_id: string }>(
    initialData || {
      value: "",
      attribute_id: idAttribute,
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    const result = await onSubmit(form);

    setError({ ...result, show: true });
    // try {
    //   const response = await fetch(`/api/attribute_values`, {
    //     method: "POST",
    //     body: JSON.stringify({ ...form }),
    //     headers: {
    //       Content_type: "application/json",
    //     },
    //   });
    //   if (!response.ok) throw "No se pudo";

    //   const { data } = await response.json();
    //   console.log(data, "Data");
    //   setAttribute((prev) => ({
    //     ...prev,
    //     attribute_values: [...prev.attributeValues, data],
    //   }));
    //   return "si se pudo";
    // } catch (error) {
    //   console.log(error, "no se pudo");
    //   return "no se pudio";
    // }
  };

  return (
    <div className="w-full p-2">
      <form>
        <FieldSet>
          <FieldGroup>
            <Field>
              <Input
                name="value"
                onChange={handleChange}
                placeholder="Coloca el valor"
                value={form.value}
              ></Input>
            </Field>
          </FieldGroup>
          <Button type="button" onClick={handleSubmit}>
            Guardar
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

export default AttributeValueForm;
