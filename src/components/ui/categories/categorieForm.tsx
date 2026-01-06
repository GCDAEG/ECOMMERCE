"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../field";
import { Input } from "../input";
import { Categorie } from "@/lib/types/dbtypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { CheckCircle, CheckCircle2, CircleQuestionMark } from "lucide-react";
export interface CategorieFormType {
  name: string;
  slug: string;
}

interface CategoriesFormProps {
  legend: string;
  onSubmit: (
    categorieForm: CategorieFormType
  ) => Promise<{ ok: boolean; message: string }>;
  initialData?: CategorieFormType;
}

const CategorieForm: React.FC<CategoriesFormProps> = ({
  legend,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<CategorieFormType>(
    initialData || {
      name: "",
      slug: "",
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

    // Podés mostrar mensajes aquí o desde el padre
    console.log(result.message);
    setError({ ...result, show: true });
    if (result.ok) {
      setForm({
        name: "",
        slug: "",
      });
    }
  };
  useEffect(() => {
    console.log(
      form,
      "Formulario para editar y crear categorias",
      initialData ? initialData : "nada"
    );
  }, []);

  return (
    <div>
      <form>
        <FieldSet>
          <FieldLegend>{legend}</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre de la categoria</FieldLabel>
              <Input
                name="name"
                placeholder="Nombre"
                value={form.name}
                className="border p-2 w-full rounded-xs"
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel asChild>
                <div>
                  <p>Slug</p>
                  <Tooltip>
                    <TooltipTrigger asChild className="cursor-help">
                      <CircleQuestionMark />
                    </TooltipTrigger>
                    <TooltipContent className="flex bg-white font-medium flex-col p-2 max-w-64 shadow-sm border">
                      <p className="font-bold text-gray-500 ">
                        Slug (URL amigable):
                      </p>

                      <p className="text-gray-500">
                        Una versión simplificada del nombre del producto que se
                        usa en la dirección web. No debe tener espacios ni
                        caracteres especiales. Ayuda a crear URLs más limpias y
                        fáciles de encontrar. Ejemplo: “Remera Roja” →
                        remera-roja
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </FieldLabel>
              <Input
                name="slug"
                placeholder="slug"
                value={form.slug}
                className="border p-2 w-full rounded-xs"
                onChange={handleChange}
              />
            </Field>
          </FieldGroup>

          <Button type="button" onClick={handleSubmit}>
            Guardar
          </Button>
        </FieldSet>
        {error.show ? (
          error.ok ? (
            <div className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center">
              <div className="flex flex-col items-center space-y-5">
                <CheckCircle2 className="size-1/2 text-green-500" />
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

export default CategorieForm;
